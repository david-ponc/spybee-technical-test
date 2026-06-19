import { createServerClient } from '@supabase/ssr';
import type { cookies } from 'next/headers';

import { env } from '~/core/env';

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
	return createServerClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch (error) {
						console.error('[AUTH][CLIENT]Error setting cookies:', error);
					}
				},
			},
		},
	);
};
