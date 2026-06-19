'use server';

import { desc, eq } from 'drizzle-orm';

import {
	type CreateIncidentCommand,
	CreateIncidentSchema,
	createIncident,
} from '~/contexts/building/incidents/domain/incident';
import { verifySession } from '~/core/data-access/verify-session';
import { db } from '~/core/db/client';
import { incidentFiles, incidents } from '~/core/db/schema';

import { mapIncidentToDomain } from './mapper';
import { deleteIncidentFile, uploadIncidentFiles } from './storage';

export async function createIncidentAction(
	command: CreateIncidentCommand,
	files: File[],
) {
	const { user } = await verifySession();
	CreateIncidentSchema.parse(command);

	const incident = createIncident(command);

	try {
		await db.insert(incidents).values({
			id: incident.id,
			buildingId: incident.buildingId,
			title: incident.title,
			description: incident.description,
			category: incident.category,
			priority: incident.priority,
			status: incident.status,
			dueDate: incident.dueDate,
			observations: incident.observations,
			locationDetails: incident.locationDetails,
			latitude: incident.coordinates[1],
			longitude: incident.coordinates[0],
			tags: incident.tags,
			assignees: incident.assignees,
			createdBy: user.id,
		});
	} catch (error) {
		console.error('[createIncidentAction] Database insert failed:', error);
		throw new Error('Failed to create incident in database');
	}

	const uploadedFiles = await uploadIncidentFiles(user.id, incident.id, files);

	if (uploadedFiles.length > 0) {
		await db.insert(incidentFiles).values(uploadedFiles);
	}

	const incidentWithFiles = await db.query.incidents.findFirst({
		where: eq(incidents.id, incident.id),
		with: { files: true },
	});

	if (!incidentWithFiles) {
		throw new Error('Failed to fetch created incident');
	}

	return mapIncidentToDomain(incidentWithFiles);
}

export async function getIncidentsAction() {
	const { user } = await verifySession();

	const rows = await db.query.incidents.findMany({
		where: eq(incidents.createdBy, user.id),
		with: { files: true },
		orderBy: desc(incidents.createdAt),
	});

	return rows.map(mapIncidentToDomain);
}

export async function deleteIncidentAction(id: string) {
	const { user } = await verifySession();

	const incident = await db.query.incidents.findFirst({
		where: eq(incidents.id, id),
		with: { files: true },
	});

	if (!incident || incident.createdBy !== user.id) {
		throw new Error('Incident not found or unauthorized');
	}

	await Promise.all(incident.files.map((file) => deleteIncidentFile(file.storagePath)));

	await db.delete(incidents).where(eq(incidents.id, id));
}
