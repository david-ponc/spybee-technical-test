import { redirect } from 'next/navigation';
import { cache } from 'react';

import { createClient } from '~/core/auth';

export const verifyGuestSession = cache(async () => {
	const client = await createClient();
	const { data } = await client.auth.getClaims();

	if (data?.claims) {
		redirect('/mapa');
	}
});
