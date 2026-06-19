import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  CONSTANTS & ENUMS
/* -------------------------------------------------------------------------- */

export const INCIDENT_STATUS = {
	Open: 'open',
	Closed: 'closed',
	OnPause: 'on_pause',
} as const;

export const PRIORITY = {
	Low: 'low',
	Medium: 'medium',
	High: 'high',
} as const;

export const INCIDENT_TYPE_KEY = {
	Achitectural: 'achitectural',
	Coordination: 'coordination',
	Electrical: 'electrical',
	Excavation: 'excavation',
	Foundation: 'foundation',
	Infrastructure: 'infrastructure',
	Masonry: 'masonry',
	Materials: 'materials',
	Observation: 'observation',
	Plumbing: 'plumbing',
	SafetyHazard: 'safety_hazard',
	SoilStudy: 'soil-study',
	Stability: 'stability',
	Structural: 'structural',
	UrbanPlanning: 'urban_planning',
} as const;

export const MEDIA_TYPE = {
	Image: 'image',
	Video: 'video',
} as const;

export const MEDIA_FORMAT = {
	Jpg: 'jpg',
	Mp4: 'mp4',
	Png: 'png',
} as const;

export const MEDIA_STATUS = {
	Uploaded: 'uploaded',
} as const;

/* -------------------------------------------------------------------------- */
/*  VALIDATION SCHEMAS
/* -------------------------------------------------------------------------- */

export const IncidentStatusSchema = z.enum(INCIDENT_STATUS);

export const PrioritySchema = z.enum(PRIORITY);

export const IncidentTypeKeySchema = z.enum(INCIDENT_TYPE_KEY);

export const MediaTypeSchema = z.enum(MEDIA_TYPE);

export const MediaFormatSchema = z.enum(MEDIA_FORMAT);

export const MediaStatusSchema = z.enum(MEDIA_STATUS);

export const IdSchema = z.string().regex(/^[a-f0-9]{24}$/);

export const SequenceIdSchema = z.string().regex(/^\d+$/);

export const CoordinatesSchema = z.object({
	lat: z.number(),
	lng: z.number(),
});

export const UserSchema = z.object({
	id: IdSchema,
	name: z.string().min(1),
	email: z.email(),
	avatarUrl: z.url(),
});

export const ProjectSchema = z.object({
	id: IdSchema,
	name: z.string().min(1),
});

export const IncidentTypeSchema = z.object({
	id: IdSchema,
	key: IncidentTypeKeySchema,
	name: z.string().min(1),
	name_en: z.string().min(1).optional(),
});

export const MediaSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	type: MediaTypeSchema,
	format: MediaFormatSchema,
	size: z.number().int().nonnegative(),
	status: MediaStatusSchema,
	url: z.url(),
});

export const TagSchema = z.object({
	id: IdSchema,
	name: z.string().min(1),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const IncidentSchema = z.object({
	id: IdSchema,
	sequenceId: SequenceIdSchema,
	order: z.number().int().positive(),
	title: z.string().min(1),
	description: z.string().min(1),
	type: IncidentTypeSchema,
	priority: PrioritySchema,
	status: IncidentStatusSchema,
	approval: z.boolean(),
	project: ProjectSchema,
	owner: UserSchema.nullable(),
	whatsappOwner: z.string().nullable(),
	assignees: z.array(UserSchema),
	observers: z.array(UserSchema),
	coordinates: CoordinatesSchema,
	locationDescription: z.string().min(1),
	dueDate: z.coerce.date().nullable(),
	closingDate: z.coerce.date().nullable(),
	media: z.array(MediaSchema),
	tags: z.array(TagSchema),
	deleted: z.boolean().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

/* -------------------------------------------------------------------------- */
/*  TYPE DEFINITIONS
/* -------------------------------------------------------------------------- */

export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;

export type Priority = z.infer<typeof PrioritySchema>;

export type IncidentTypeKey = z.infer<typeof IncidentTypeKeySchema>;

export type MediaType = z.infer<typeof MediaTypeSchema>;

export type MediaFormat = z.infer<typeof MediaFormatSchema>;

export type MediaStatus = z.infer<typeof MediaStatusSchema>;

export type Coordinates = z.infer<typeof CoordinatesSchema>;

export type User = z.infer<typeof UserSchema>;

export type Project = z.infer<typeof ProjectSchema>;

export type IncidentType = z.infer<typeof IncidentTypeSchema>;

export type Media = z.infer<typeof MediaSchema>;

export type Tag = z.infer<typeof TagSchema>;

export type Incident = z.infer<typeof IncidentSchema>;

export type IncidentId = z.infer<typeof IncidentSchema.shape.id>;
