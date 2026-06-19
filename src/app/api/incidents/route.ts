import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { z } from 'zod';

import { IncidentSchema, PRIORITY } from '~/contexts/dashboard/incidents/domain/incident';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_SORT = 'priority:desc,dueDate:asc';
const ALLOWED_SORT_COLUMNS = ['priority', 'dueDate'];

const QueryParamsSchema = z.object({
	page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
	limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
	sort: z.string().default(DEFAULT_SORT),
});

const priorityWeight: Record<string, number> = {
	[PRIORITY.High]: 3,
	[PRIORITY.Medium]: 2,
	[PRIORITY.Low]: 1,
};

interface SortRule {
	id: string;
	desc: boolean;
}

function parseSortParam(sortParam: string): SortRule[] {
	const rules: SortRule[] = [];

	for (const part of sortParam.split(',')) {
		const [id, order] = part.split(':');

		if (ALLOWED_SORT_COLUMNS.includes(id) && (order === 'asc' || order === 'desc')) {
			rules.push({ id, desc: order === 'desc' });
		}
	}

	return rules.length > 0 ? rules : parseSortParam(DEFAULT_SORT);
}

function compareNullableDates(a: Date | null, b: Date | null): number {
	if (a === null && b === null) return 0;
	if (a === null) return 1;
	if (b === null) return -1;
	return a.getTime() - b.getTime();
}

function sortIncidents<T extends { priority: string; dueDate: Date | null }>(
	incidents: T[],
	sort: SortRule[],
): T[] {
	return [...incidents].sort((a, b) => {
		for (const { id, desc } of sort) {
			let comparison = 0;

			if (id === 'priority') {
				comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
			} else if (id === 'dueDate') {
				comparison = compareNullableDates(a.dueDate, b.dueDate);
			}

			if (desc) comparison = -comparison;
			if (comparison !== 0) return comparison;
		}

		return 0;
	});
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const {
			page,
			limit,
			sort: sortParam,
		} = QueryParamsSchema.parse({
			page: searchParams.get('page'),
			limit: searchParams.get('limit'),
			sort: searchParams.get('sort'),
		});
		const sort = parseSortParam(sortParam);

		const filePath = join(process.cwd(), 'data', 'incidents.mock.json');
		const fileContent = await readFile(filePath, 'utf-8');
		const raw = JSON.parse(fileContent);

		if (!Array.isArray(raw)) {
			return Response.json({ error: 'Invalid data shape' }, { status: 500 });
		}

		const parsed = raw
			.filter((item) => item?.deleted !== true)
			.map((item, index) => {
				try {
					return IncidentSchema.parse(item);
				} catch (error) {
					console.error(
						`[GET /api/incidents] Failed to parse incident at index ${index}:`,
						error,
					);
					return null;
				}
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		const sorted = sortIncidents(parsed, sort);
		const total = sorted.length;
		const totalPages = Math.max(1, Math.ceil(total / limit));
		const safePage = Math.min(page, totalPages);
		const start = (safePage - 1) * limit;
		const data = sorted.slice(start, start + limit);

		return Response.json({
			data,
			meta: { page: safePage, limit, total, totalPages },
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json({ error: 'Invalid query parameters' }, { status: 400 });
		}

		console.error('Error reading incidents mock data:', error);
		return Response.json({ error: 'Failed to load incidents' }, { status: 500 });
	}
}
