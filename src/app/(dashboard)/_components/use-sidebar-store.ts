'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarState {
	collapsed: boolean;
	mobileOpen: boolean;
	toggle: () => void;
	openMobile: () => void;
	closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>()(
	persist(
		(set) => ({
			collapsed: false,
			mobileOpen: false,
			toggle: () => set((s) => ({ collapsed: !s.collapsed })),
			openMobile: () => set({ mobileOpen: true }),
			closeMobile: () => set({ mobileOpen: false }),
		}),
		{
			name: 'dashboard-sidebar',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ collapsed: state.collapsed }),
		},
	),
);
