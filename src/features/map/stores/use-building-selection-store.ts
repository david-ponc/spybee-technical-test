import { create } from 'zustand';

export interface SelectedBuilding {
	id: number;
	coordinates: [number, number];
	height?: number;
	minHeight?: number;
}

interface State {
	selectedBuilding: SelectedBuilding | null;
}

interface Actions {
	selectBuilding: (building: SelectedBuilding) => void;
	clearSelection: () => void;
}

export type BuildingSelectionStore = State & Actions;

export const useBuildingSelectionStore = create<BuildingSelectionStore>((set) => ({
	selectedBuilding: null,
	selectBuilding: (building) => set({ selectedBuilding: building }),
	clearSelection: () => set({ selectedBuilding: null }),
}));
