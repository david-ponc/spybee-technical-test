'use client';

import { useQuery } from '@tanstack/react-query';

import { IncidentStatsSchema, type StatsPeriod } from '../types';
import { incidentStatsKeys } from './keys';

interface UseIncidentStatsQueryOptions {
	period: StatsPeriod;
}

export function useIncidentStatsQuery({ period }: UseIncidentStatsQueryOptions) {
	return useQuery({
		queryKey: incidentStatsKeys.detail(period),
		queryFn: async () => {
			const response = await fetch(`/api/incidents/stats?period=${period}`);

			if (!response.ok) {
				throw new Error('Failed to fetch incident stats');
			}

			return IncidentStatsSchema.parse(await response.json());
		},
	});
}
