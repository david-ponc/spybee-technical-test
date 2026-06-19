import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateIncidentCommand } from '~/contexts/building/incidents/domain/incident';

import { createIncidentAction, deleteIncidentAction } from '../actions';
import { incidentKeys } from '../queries/keys';

interface CreateIncidentVariables {
	command: CreateIncidentCommand;
	files: File[];
}

export function useCreateIncidentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ command, files }: CreateIncidentVariables) =>
			createIncidentAction(command, files),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
		},
	});
}

export function useDeleteIncidentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteIncidentAction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
		},
	});
}
