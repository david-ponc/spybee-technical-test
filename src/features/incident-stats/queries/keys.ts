export const incidentStatsKeys = {
	all: ['incident-stats'] as const,
	detail: (period: string) => [...incidentStatsKeys.all, 'detail', period] as const,
};
