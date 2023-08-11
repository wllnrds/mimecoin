import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('Transaction')
		.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
		.addColumn('type', sql`transaction_type`, (col) => col.notNull())
		.addColumn('amount', 'integer', (col) => col.notNull())
		.addColumn('headline', 'varchar', (col) => col.defaultTo('').notNull())
		.addColumn('details', 'varchar', (col) => col.defaultTo('').notNull())
		.addColumn('namespaceCode', 'varchar', (col) => col.references('Namespace.code').notNull())
		.addColumn('namespaceAccount', 'varchar', (col) => col.references('NamespaceAccount.accountNumber').notNull())
		.addColumn('namespaceAccountOrigin', 'varchar', (col) => col.references('NamespaceAccount.accountNumber'))
		.addColumn('namespaceAccountTarget', 'varchar', (col) => col.references('NamespaceAccount.accountNumber').notNull())
		.addColumn('status', sql`transaction_status`, (col) => col.defaultTo('pending').notNull())		
		.addColumn('hash', 'varchar')
		.addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('confirmedAt', 'timestamptz')
		.execute()

	await db.schema.createIndex('transaction_namespace').on('Transaction').column('namespaceCode').execute()
	await db.schema.createIndex('transaction_type').on('Transaction').column('type').execute()
	await db.schema.createIndex('transaction_status_index').on('Transaction').column('status').execute()

	await db.schema.createIndex('transaction_account').on('Transaction').column('namespaceAccount').execute()
	await db.schema.createIndex('transaction_origen').on('Transaction').column('namespaceAccountOrigin').execute()
	await db.schema.createIndex('transaction_target').on('Transaction').column('namespaceAccountTarget').execute()


	await db.schema
		.createTable('PaymentOrder')
		.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
		.addColumn('digits', 'varchar', (col) => col.notNull())
		.addColumn('namespaceCode', 'varchar', (col) => col.references('Namespace.code').notNull())
		.addColumn('namespaceAccountOrigin', 'varchar', (col) => col.references('NamespaceAccount.accountNumber').notNull())
		.addColumn('due', 'date', (col) => col.notNull())
		.addColumn('amount', 'integer', (col) => col.notNull())
		.addColumn('status', sql`transaction_status`, (col) => col.defaultTo('pending').notNull())
		.addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('payedAt', 'timestamptz')
		.execute()

	await db.schema.createIndex('payment_order_namespace').on('PaymentOrder').column('namespaceCode').execute()
	await db.schema.createIndex('payment_order_origin').on('PaymentOrder').column('namespaceAccountOrigin').execute()
	await db.schema.createIndex('payment_order_digits').on('PaymentOrder').column('digits').execute()
	await db.schema.createIndex('payment_order_status').on('PaymentOrder').column('status').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropType('Transaction').ifExists().execute()
	await db.schema.dropType('PaymentOrder').ifExists().execute()
}