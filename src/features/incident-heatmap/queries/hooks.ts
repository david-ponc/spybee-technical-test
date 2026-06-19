'use client';

import { useQuery } from '@tanstack/react-query';

import { IncidentHeatmapResponseSchema } from '../types';
import { incidentHeatmapKeys } from './keys';

export function useIncidentHeatmapQuery() {
	return useQuery({
		queryKey: incidentHeatmapKeys.detail(),
		queryFn: async () => {
			const response = await fetch('/api/incidents/heatmap');

			if (!response.ok) {
				throw new Error('Failed to fetch incident heatmap');
			}

			return IncidentHeatmapResponseSchema.parse(await response.json());
		},
	});
}
