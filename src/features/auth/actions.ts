'use server';

import { redirect } from 'next/navigation';

import { createClient } from '~/core/auth';
import { verifySession } from '~/core/data-access/verify-session';

export async function signOutAction() {
	await verifySession();
	const client = await createClient();
	await client.auth.signOut();
	redirect('/auth/sign-in');
}
