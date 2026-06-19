import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  CONSTANTS & ENUMS
/* -------------------------------------------------------------------------- */

export const INCIDENT_STATUS = {
	Open: 'open',
	InProgress: 'in_progress',
	Resolved: 'resolved',
	Closed: 'closed',
} as const;

export const PRIORITY = {
	Low: 'low',
	Medium: 'medium',
	High: 'high',
} as const;

/* -------------------------------------------------------------------------- */
/*  VALIDATION SCHEMAS
/* -------------------------------------------------------------------------- */

export const IncidentStatusSchema = z.enum(INCIDENT_STATUS);

export const PrioritySchema = z.enum(PRIORITY);

export const IdSchema = z.uuidv7();

export const CoordinatesSchema = z.tuple([
	z.number().min(-180).max(180),
	z.number().min(-90).max(90),
]);

export const IncidentFileSchema = z.object({
	id: IdSchema,
	name: z.string().min(1),
	contentType: z.string().min(1),
	size: z.number().int().nonnegative(),
	storagePath: z.string().min(1),
	publicUrl: z.string().min(1),
	createdAt: z.date(),
});

export const IncidentSchema = z.object({
	id: IdSchema,
	buildingId: z.number().int().positive(),
	title: z.string().min(1).max(255),
	description: z.string().min(1),
	category: z.string().min(1).max(100),
	priority: PrioritySchema,
	status: IncidentStatusSchema,
	dueDate: z.date().nullable(),
	tags: z.array(z.string()),
	assignees: z.array(z.string()),
	observations: z.string().nullable(),
	coordinates: CoordinatesSchema,
	locationDetails: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	files: z.array(IncidentFileSchema),
});

/* -------------------------------------------------------------------------- */
/*  TYPE DEFINITIONS
/* -------------------------------------------------------------------------- */

export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type IncidentFile = z.infer<typeof IncidentFileSchema>;
export type Incident = z.infer<typeof IncidentSchema>;
export type IncidentId = z.infer<typeof IncidentSchema.shape.id>;

/* -------------------------------------------------------------------------- */
/*  DTOS
/* -------------------------------------------------------------------------- */

export const CreateIncidentSchema = IncidentSchema.omit({
	status: true,
	createdAt: true,
	updatedAt: true,
	files: true,
});

export type CreateIncidentCommand = z.infer<typeof CreateIncidentSchema>;

export const UpdateIncidentSchema = IncidentSchema.partial().omit({
	id: true,
	buildingId: true,
	createdAt: true,
	files: true,
});

export type UpdateIncidentCommand = z.infer<typeof UpdateIncidentSchema>;

/* -------------------------------------------------------------------------- */
/*  FACTORIES
/* -------------------------------------------------------------------------- */

export function createIncident(command: CreateIncidentCommand): Incident {
	const now = new Date();
	return IncidentSchema.parse({
		...command,
		status: INCIDENT_STATUS.Open,
		createdAt: now,
		updatedAt: now,
		files: [],
	});
}

export function updateIncident(
	existing: Incident,
	command: UpdateIncidentCommand,
): Incident {
	const now = new Date();
	return IncidentSchema.parse({
		...existing,
		...command,
		updatedAt: now,
	});
}
