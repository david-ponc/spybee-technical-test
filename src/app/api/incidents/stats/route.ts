import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { z } from 'zod';

import { IncidentSchema } from '~/contexts/dashboard/incidents/domain/incident';

const ALLOWED_PERIODS = ['7', '15', '30', '90', '180'] as const;

const QueryParamsSchema = z.object({
	period: z.enum(ALLOWED_PERIODS).default('30'),
});

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

function diffInDays(start: Date, end: Date): number {
	return (end.getTime() - start.getTime()) / MILLISECONDS_PER_DAY;
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
	return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

function calculateStats(
	incidents: ReturnType<typeof IncidentSchema.parse>[],
	startDate: Date,
	endDate: Date,
) {
	const created = incidents.filter((incident) =>
		isDateInRange(incident.createdAt, startDate, endDate),
	).length;

	const closedIncidents = incidents.filter(
		(incident) =>
			incident.status === 'closed' &&
			incident.closingDate &&
			isDateInRange(incident.closingDate, startDate, endDate),
	);
	const closed = closedIncidents.length;

	const averageResolutionDays =
		closedIncidents.length > 0
			? closedIncidents.reduce((sum, incident) => {
					const closingDate = incident.closingDate as Date;
					return sum + diffInDays(incident.createdAt, closingDate);
				}, 0) / closedIncidents.length
			: null;

	return { created, closed, averageResolutionDays };
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const { period } = QueryParamsSchema.parse({
			period: searchParams.get('period'),
		});

		const now = new Date();
		const periodDays = Number(period);
		const currentStart = new Date(now.getTime() - periodDays * MILLISECONDS_PER_DAY);
		const previousStart = new Date(
			currentStart.getTime() - periodDays * MILLISECONDS_PER_DAY,
		);

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
						`[GET /api/incidents/stats] Failed to parse incident at index ${index}:`,
						error,
					);
					return null;
				}
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		const currentStats = calculateStats(parsed, currentStart, now);
		const previousStats = calculateStats(parsed, previousStart, currentStart);

		const open = parsed.filter((incident) => incident.status !== 'closed').length;

		const overdue = parsed.filter(
			(incident) =>
				incident.status !== 'closed' &&
				incident.dueDate &&
				incident.dueDate.getTime() < now.getTime(),
		).length;

		const closingRate =
			currentStats.created > 0 ? currentStats.closed / currentStats.created : 0;

		return Response.json({
			open,
			created: currentStats.created,
			createdPreviousPeriod: previousStats.created,
			closed: currentStats.closed,
			closedPreviousPeriod: previousStats.closed,
			closingRate,
			averageResolutionDays: currentStats.averageResolutionDays,
			averageResolutionDaysPreviousPeriod: previousStats.averageResolutionDays,
			overdue,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json({ error: 'Invalid query parameters' }, { status: 400 });
		}

		console.error('Error reading incident stats mock data:', error);
		return Response.json({ error: 'Failed to load incident stats' }, { status: 500 });
	}
}
