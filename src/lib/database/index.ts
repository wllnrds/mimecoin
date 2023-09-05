import { DB } from '@/lib/database/db';

import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.POSTGRES_URL + '?sslmode=require'
        })
    })
});

export { sql } from 'kysely';