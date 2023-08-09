import { DB } from '@/lib/database/db';
import { Kysely, PostgresDialect} from 'kysely';
import { Pool } from 'pg';

export const db = new Kysely<DB>({
    dialect : new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL
        })
    })
});
export { sql } from 'kysely';