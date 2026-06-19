import { cookies } from 'next/headers';

import { createClient as createServerClient } from '~/core/auth/server/client';

export const createClient = async () => {
	const cookieStore = await cookies();
	return createServerClient(cookieStore);
};
