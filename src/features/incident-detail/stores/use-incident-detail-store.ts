import { create } from 'zustand';

import type { Incident } from '~/contexts/building/incidents/domain/incident';

interface State {
	selectedIncident: Incident | null;
}

interface Actions {
	selectIncident: (incident: Incident) => void;
	clearIncident: () => void;
}

export const useIncidentDetailStore = create<State & Actions>((set) => ({
	selectedIncident: null,
	selectIncident: (incident) => set({ selectedIncident: incident }),
	clearIncident: () => set({ selectedIncident: null }),
}));
