import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v7 as uuidv7 } from 'uuid';

import {
	type CreateIncidentCommand,
	CreateIncidentSchema,
} from '~/contexts/building/incidents/domain/incident';

interface UseCreateIncidentFormOptions {
	buildingId: number;
	defaultValues?: Partial<CreateIncidentCommand>;
}

export function useCreateIncidentForm({
	buildingId,
	defaultValues,
}: UseCreateIncidentFormOptions) {
	const [id] = useState(() => uuidv7());
	const form = useForm<CreateIncidentCommand>({
		resolver: zodResolver(CreateIncidentSchema),
		defaultValues: {
			id,
			buildingId,
			title: '',
			description: '',
			dueDate: null,
			category: '',
			priority: 'low',
			tags: [],
			assignees: [],
			observations: null,
			coordinates: [0, 0],
			locationDetails: null,
			...defaultValues,
		},
	});

	return form;
}

export type { CreateIncidentCommand as CreateIncidentFormValues };
