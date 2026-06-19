import { relations } from 'drizzle-orm';
import {
	bigint,
	doublePrecision,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

export const incidents = pgTable(
	'incidences',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		buildingId: bigint('building_id', { mode: 'number' }).notNull(),
		title: varchar('title', { length: 255 }).notNull(),
		description: text('description').notNull(),
		category: varchar('category', { length: 100 }).notNull(),
		priority: varchar('priority', { length: 20 }).notNull(),
		status: varchar('status', { length: 20 }).notNull().default('open'),
		dueDate: timestamp('due_date', { withTimezone: true }),
		observations: text('observations'),
		locationDetails: text('location_details'),
		latitude: doublePrecision('latitude').notNull(),
		longitude: doublePrecision('longitude').notNull(),
		tags: text('tags').array().notNull().default([]),
		assignees: text('assignees').array().notNull().default([]),
		createdBy: uuid('created_by').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('incidences_building_id_idx').on(table.buildingId),
		index('incidences_created_by_idx').on(table.createdBy),
	],
);

export const incidentFiles = pgTable(
	'incidence_files',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		incidenceId: uuid('incidence_id')
			.notNull()
			.references(() => incidents.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }).notNull(),
		contentType: varchar('content_type', { length: 100 }).notNull(),
		size: integer('size').notNull(),
		storagePath: text('storage_path').notNull(),
		publicUrl: text('public_url').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index('incidence_files_incidence_id_idx').on(table.incidenceId)],
);

export const incidentsRelations = relations(incidents, ({ many }) => ({
	files: many(incidentFiles),
}));

export const incidentFilesRelations = relations(incidentFiles, ({ one }) => ({
	incidence: one(incidents, {
		fields: [incidentFiles.incidenceId],
		references: [incidents.id],
	}),
}));
