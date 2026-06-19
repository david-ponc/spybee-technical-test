export const incidentListKeys = {
	all: ['incident-list'] as const,
	list: ({ page, limit, sort }: { page: number; limit: number; sort: string }) =>
		[...incidentListKeys.all, 'list', { page, limit, sort }] as const,
};
