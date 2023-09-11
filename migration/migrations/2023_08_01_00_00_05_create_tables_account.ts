import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('Customer')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('birthday', 'date', (col) => col.notNull())
        .addColumn('email', 'varchar', (col) => col.unique().notNull())
        .addColumn('status', sql`status`, (col) => col.defaultTo('new').notNull())
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute()

    await db.schema.createIndex('customer_email').on('Customer').column('email').execute()
    await db.schema.createIndex('customer_status').on('Customer').column('status').execute()

    await db.schema
        .createTable('NamespaceAccount')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('idCustomer', 'uuid', (col) => col.references('Customer.id').onDelete('cascade').notNull())
        .addColumn('namespaceCode', 'varchar', (col) => col.references('Namespace.code').onDelete('cascade').notNull())
        .addColumn('accountNumber', 'varchar', (col) => col.unique().notNull())
        .addColumn('accountKey', 'varchar', (col) => col.notNull())
        .addColumn('accountPassword', 'varchar')
        .addColumn('balance', 'integer', (col) => col.defaultTo(0).notNull())
        .addColumn('balanceExtra', 'integer', (col) => col.defaultTo(0).notNull())
		.addColumn('status', sql`status`, (col) => col.defaultTo('new').notNull())
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute()

    await db.schema.createIndex('account_customer').on('NamespaceAccount').column('idCustomer').execute()
    await db.schema.createIndex('account_namespace').on('NamespaceAccount').column('namespaceCode').execute()
    await db.schema.createIndex('account_number').on('NamespaceAccount').column('accountNumber').execute()

    await db.schema.alterTable('NamespaceAccount').addUniqueConstraint('namespace_account', ['namespaceCode', 'accountNumber']).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropType('Customer').ifExists().execute()
    await db.schema.dropType('NamespaceAccount').ifExists().execute()
}