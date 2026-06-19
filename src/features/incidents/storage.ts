import { createClient } from '~/core/auth';
import type { NewIncidentFile } from '~/core/db/types';
import { env } from '~/core/env';

const BUCKET_NAME = 'incidence-files';

function buildPublicUrl(path: string): string {
	return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

function sanitizeFileName(name: string): string {
	return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function buildStoragePath(userId: string, incidentId: string, file: File): string {
	const timestamp = Date.now();
	const safeName = sanitizeFileName(file.name);
	return `${userId}/${incidentId}/${timestamp}-${safeName}`;
}

export async function uploadIncidentFiles(
	userId: string,
	incidentId: string,
	files: File[],
): Promise<NewIncidentFile[]> {
	if (files.length === 0) return [];

	const client = await createClient();
	const uploadedFiles: NewIncidentFile[] = [];

	for (const file of files) {
		const path = buildStoragePath(userId, incidentId, file);

		const { error } = await client.storage.from(BUCKET_NAME).upload(path, file, {
			contentType: file.type,
			upsert: false,
		});

		if (error) {
			throw new Error(`Error uploading file ${file.name}: ${error.message}`);
		}

		uploadedFiles.push({
			incidenceId: incidentId,
			name: file.name,
			contentType: file.type,
			size: file.size,
			storagePath: path,
			publicUrl: buildPublicUrl(path),
		});
	}

	return uploadedFiles;
}

export async function deleteIncidentFile(storagePath: string): Promise<void> {
	const client = await createClient();
	const { error } = await client.storage.from(BUCKET_NAME).remove([storagePath]);

	if (error) {
		throw new Error(`Error deleting file: ${error.message}`);
	}
}
