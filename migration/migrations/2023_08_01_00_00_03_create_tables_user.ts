import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('User').ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`) )
		.addColumn("image", "text")
		.addColumn('name', 'varchar', (col) => col.notNull())
		.addColumn('email', 'varchar', (col) => col.unique().notNull())
		.addColumn("emailVerified", "timestamptz")
		.addColumn('password', 'varchar', (col) => col.notNull())
		.addColumn('status', sql`status`, (col) => col.defaultTo('new').notNull())
		.addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute()

	await db.schema.createIndex('user_status').on('User').column('status').execute()
	await db.schema.createIndex('user_email').on('User').column('email').execute()

	await db.schema
		.createTable('UserLimit').ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`) )
		.addColumn('idUser', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
		.addColumn('maxNamespace', 'integer', (col) => col.defaultTo(1).notNull())
		.addColumn('expiresAt', 'timestamptz')
		.addColumn('active', 'boolean', (col) => col.defaultTo(true).notNull())
		.addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute()

	await db.schema.createIndex('user_limit_user').on('UserLimit').column('idUser').execute()
	await db.schema.createIndex('user_limit_expiresAt').on('UserLimit').column('expiresAt').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropType('User').ifExists().execute();
	await db.schema.dropType('UserLimit').ifExists().execute();
}