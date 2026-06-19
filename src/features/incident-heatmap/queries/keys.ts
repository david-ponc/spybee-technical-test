export const incidentHeatmapKeys = {
	all: ['incident-heatmap'] as const,
	detail: () => [...incidentHeatmapKeys.all, 'detail'] as const,
};
