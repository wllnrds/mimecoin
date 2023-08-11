import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('Namespace')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('code', 'varchar', (col) => col.unique().notNull())
        .addColumn('pic', 'varchar')
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('status', sql`status`, (col) => col.defaultTo('active').notNull())
        .addColumn('createdBy', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute()

    await db.schema.createIndex('namespace_code').on('Namespace').column('code').execute()
    await db.schema.createIndex('namespace_status').on('Namespace').column('status').execute()

    
    await db.schema
        .createTable('NamespaceLimit').ifNotExists()
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('idNamespace', 'uuid', (col) => col.references('Namespace.id').onDelete('cascade').notNull())
        .addColumn('maxOffer', 'integer', (col) => col.defaultTo(1000).notNull())
        .addColumn('precision', 'integer', (col) => col.defaultTo(2).notNull())
        .addColumn('active', 'boolean', (col) => col.defaultTo(true).notNull())
        .addColumn('expiresAt', 'timestamptz')
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute()

    await db.schema.createIndex('namespace_limit_namespace').on('NamespaceLimit').column('idNamespace').execute()
    await db.schema.createIndex('namespace_limit_expiresAt').on('NamespaceLimit').column('expiresAt').execute()

    
    await db.schema
        .createTable('UserNamespace').ifNotExists()
        .addColumn('idUser', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
        .addColumn('idNamespace', 'uuid', (col) => col.references('Namespace.id').onDelete('cascade').notNull())
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute()

    await db.schema.alterTable('UserNamespace').addUniqueConstraint('user_namespace', ['idUser', 'idNamespace']).execute();

    await db.schema
        .createTable('AccessToken').ifNotExists()
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('idUser', 'uuid', (col) => col.references('User.id').onDelete('cascade').notNull())
        .addColumn('idNamespace', 'uuid', (col) => col.references('Namespace.id').onDelete('cascade').notNull())
        .addColumn('key', 'varchar', (col) => col.unique().notNull())
        .addColumn('secret', 'varchar', (col) => col.notNull())
        .addColumn('expiresAt', 'timestamptz')
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute()

    await db.schema.createIndex('access_token_user').on('AccessToken').column('idUser').execute()
    await db.schema.createIndex('access_token_namespace').on('AccessToken').column('idNamespace').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropType('Namespace').ifExists().execute();
    await db.schema.dropType('NamespaceLimit').ifExists().execute();
    await db.schema.dropType('UserNamespace').ifExists().execute();
    await db.schema.dropType('AccessToken').ifExists().execute();
}