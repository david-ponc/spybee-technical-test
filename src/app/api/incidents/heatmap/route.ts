import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { IncidentSchema } from '~/contexts/dashboard/incidents/domain/incident';
import {
	type IncidentHeatmapResponse,
	IncidentHeatmapResponseSchema,
} from '~/features/incident-heatmap/types';

const priorityWeight: Record<string, number> = {
	high: 3,
	medium: 2,
	low: 1,
};

export async function GET() {
	try {
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
						`[GET /api/incidents/heatmap] Failed to parse incident at index ${index}:`,
						error,
					);
					return null;
				}
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		const features = parsed.map((incident) => ({
			type: 'Feature' as const,
			properties: {
				id: incident.id,
				priority: incident.priority,
				weight: priorityWeight[incident.priority] ?? 1,
			},
			geometry: {
				type: 'Point' as const,
				coordinates: [incident.coordinates.lng, incident.coordinates.lat] as [
					number,
					number,
				],
			},
		}));

		const response: IncidentHeatmapResponse = {
			type: 'FeatureCollection',
			features,
		};

		return Response.json(IncidentHeatmapResponseSchema.parse(response));
	} catch (error) {
		console.error('Error reading incident heatmap mock data:', error);
		return Response.json({ error: 'Failed to load incident heatmap' }, { status: 500 });
	}
}
