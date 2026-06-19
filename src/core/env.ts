import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		BASE_URL: z.url(),
		DATABASE_URL: z.url(),
		NODE_ENV: z.enum(['development', 'production', 'test']),
	},
	client: {
		NEXT_PUBLIC_BASE_URL: z.string(),
		NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
		NEXT_PUBLIC_SUPABASE_URL: z.url(),
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	},
});
