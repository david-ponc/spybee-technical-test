import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '~/core/env';

import * as schema from './schema';

const globalForDb = globalThis as unknown as {
	postgresSqlClient?: postgres.Sql;
};

export const postgresSqlClient =
	globalForDb.postgresSqlClient ?? postgres(env.DATABASE_URL, { prepare: false });

if (env.NODE_ENV !== 'production') {
	globalForDb.postgresSqlClient = postgresSqlClient;
}

export const db = drizzle(postgresSqlClient, { schema });
