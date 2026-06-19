import { redirect } from 'next/navigation';
import { cache } from 'react';

import { createClient } from '~/core/auth';

export const verifySession = cache(async () => {
	const client = await createClient();
	const {
		data: { user },
		error,
	} = await client.auth.getUser();

	if (error || !user) {
		redirect('/auth/sign-in');
	}

	return { user };
});
