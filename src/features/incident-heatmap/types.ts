import { z } from 'zod';

import { PrioritySchema } from '~/contexts/dashboard/incidents/domain/incident';

export const IncidentHeatmapFeatureSchema = z.object({
	type: z.literal('Feature'),
	properties: z.object({
		id: z.string(),
		priority: PrioritySchema,
		weight: z.number().positive(),
	}),
	geometry: z.object({
		type: z.literal('Point'),
		coordinates: z.tuple([z.number(), z.number()]),
	}),
});

export const IncidentHeatmapResponseSchema = z.object({
	type: z.literal('FeatureCollection'),
	features: z.array(IncidentHeatmapFeatureSchema),
});

export type IncidentHeatmapFeature = z.infer<typeof IncidentHeatmapFeatureSchema>;
export type IncidentHeatmapResponse = z.infer<typeof IncidentHeatmapResponseSchema>;
