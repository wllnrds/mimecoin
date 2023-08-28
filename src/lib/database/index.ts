import { DB } from '@/lib/database/db';

import { createKysely } from '@vercel/postgres-kysely';

import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

let connection;

connection = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.POSTGRES_URL + '?sslmode=require'
        })
    })
});

// if( process.env.POSTGRES_HOST?.includes('localhost')){
//     console.info("Usando Kysely direto")
//     connection = new Kysely<DB>({
//         dialect: new PostgresDialect({
//             pool: new Pool({
//                 connectionString: process.env.POSTGRES_URL + '?sslmode=require'
//             })
//         })
//     });
// }else{
//     console.info("Usando vercel")
//     connection = createKysely<DB>();
// }

export const db = connection;

export { sql } from 'kysely';