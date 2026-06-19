'use client';

import { useQuery } from '@tanstack/react-query';

import { getIncidentsAction } from '../actions';
import { incidentKeys } from './keys';

export function useIncidents() {
	return useQuery({
		queryKey: incidentKeys.lists(),
		queryFn: getIncidentsAction,
	});
}
