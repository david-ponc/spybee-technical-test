import { z } from 'zod';

import { IncidentSchema } from '~/contexts/dashboard/incidents/domain/incident';

export const PaginatedIncidentsResponseSchema = z.object({
	data: z.array(IncidentSchema),
	meta: z.object({
		page: z.number().int(),
		limit: z.number().int(),
		total: z.number().int(),
		totalPages: z.number().int(),
	}),
});

export type PaginatedIncidentsResponse = z.infer<typeof PaginatedIncidentsResponseSchema>;

export interface IncidentListParams {
	page: number;
	limit: number;
	sort: string;
}
