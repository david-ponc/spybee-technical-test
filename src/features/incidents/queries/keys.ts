export const incidentKeys = {
	all: ['incidents'] as const,
	lists: () => [...incidentKeys.all, 'list'] as const,
	detail: (id: string) => [...incidentKeys.all, 'detail', id] as const,
};
