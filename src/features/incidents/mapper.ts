import {
	type Incident,
	IncidentStatusSchema,
	PrioritySchema,
} from '~/contexts/building/incidents/domain/incident';
import type { IncidentWithFiles as DbIncidentWithFiles } from '~/core/db/types';

export function mapIncidentToDomain(dbIncident: DbIncidentWithFiles): Incident {
	return {
		id: dbIncident.id,
		buildingId: dbIncident.buildingId,
		title: dbIncident.title,
		description: dbIncident.description,
		dueDate: dbIncident.dueDate ?? null,
		category: dbIncident.category,
		priority: PrioritySchema.parse(dbIncident.priority),
		tags: dbIncident.tags,
		assignees: dbIncident.assignees,
		observations: dbIncident.observations ?? null,
		coordinates: [dbIncident.longitude, dbIncident.latitude],
		locationDetails: dbIncident.locationDetails ?? null,
		status: IncidentStatusSchema.parse(dbIncident.status),
		createdAt: dbIncident.createdAt,
		updatedAt: dbIncident.updatedAt,
		files: dbIncident.files,
	};
}
