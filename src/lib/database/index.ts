import { DB } from '@/lib/database/db';

import { createKysely } from '@vercel/postgres-kysely';

import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

let connection;

if( process.env.NEXTAUTH_URL?.includes('localhost') ){
    connection = new Kysely<DB>({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: process.env.POSTGRES_URL + '?sslmode=require'
            })
        })
    });
}else{
    connection = createKysely<DB>();
}

export const db = connection;

export { sql } from 'kysely';