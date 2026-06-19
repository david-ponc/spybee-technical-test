import type { incidentFiles, incidents } from './schema';

export type Incident = typeof incidents.$inferSelect;
export type NewIncident = typeof incidents.$inferInsert;

export type IncidentFile = typeof incidentFiles.$inferSelect;
export type NewIncidentFile = typeof incidentFiles.$inferInsert;

export type IncidentWithFiles = Incident & {
	files: IncidentFile[];
};
