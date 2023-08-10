import { DB } from '@/lib/database/db';
import { createKysely } from '@vercel/postgres-kysely';

export const db = createKysely<DB>();

export { sql } from 'kysely';