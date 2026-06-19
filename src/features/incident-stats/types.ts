import { z } from 'zod';

export const STATS_PERIOD_OPTIONS = {
	SevenDays: '7',
	FifteenDays: '15',
	ThirtyDays: '30',
	NinetyDays: '90',
	SixMonths: '180',
} as const;

export const StatsPeriodSchema = z.enum(STATS_PERIOD_OPTIONS);

export type StatsPeriod = z.infer<typeof StatsPeriodSchema>;

export const IncidentStatsSchema = z.object({
	open: z.number().int().nonnegative(),
	created: z.number().int().nonnegative(),
	createdPreviousPeriod: z.number().int().nonnegative(),
	closed: z.number().int().nonnegative(),
	closedPreviousPeriod: z.number().int().nonnegative(),
	closingRate: z.number().min(0).max(1),
	averageResolutionDays: z.number().nullable(),
	averageResolutionDaysPreviousPeriod: z.number().nullable(),
	overdue: z.number().int().nonnegative(),
});

export type IncidentStats = z.infer<typeof IncidentStatsSchema>;
