'use client';

import { useQuery } from '@tanstack/react-query';

import { PaginatedIncidentsResponseSchema } from '../types';
import { incidentListKeys } from './keys';

interface UseIncidentsQueryOptions {
	page: number;
	limit: number;
	sort: string;
}

export function useIncidentsQuery({ page, limit, sort }: UseIncidentsQueryOptions) {
	return useQuery({
		queryKey: incidentListKeys.list({ page, limit, sort }),
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				sort,
			});

			const response = await fetch(`/api/incidents?${searchParams.toString()}`);

			if (!response.ok) {
				throw new Error('Failed to fetch incidents');
			}

			return PaginatedIncidentsResponseSchema.parse(await response.json());
		},
	});
}
