import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  console.log("✔️ Criando tabela Transactions")
  await db.schema
    .createTable('transaction')
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('type', sql`transaction_type`,(col) => col.notNull())
      .addColumn('amount','integer',(col) => col.notNull())
      .addColumn('headline','varchar',(col) => col.defaultTo('').notNull())
      .addColumn('details','varchar',(col) => col.defaultTo('').notNull())
      .addColumn('namespace_code','varchar',(col) => col.references('namespace.code').notNull())
      .addColumn('id_account','varchar',(col) => col.references('account.account_number').notNull())
      .addColumn('id_account_origin','varchar',(col) => col.references('account.account_number'))
      .addColumn('id_account_target','varchar',(col) => col.references('account.account_number').notNull())
      .addColumn('status', sql`transaction_status`,(col) => col.defaultTo('pending').notNull())
      .addColumn('hash','varchar')
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('confirmed_at','timestamptz')
    .execute()
    
  await db.schema.createIndex('transaction_account').on('transaction').column('id_account').execute()
  await db.schema.createIndex('transaction_namespace').on('transaction').column('namespace_code').execute()
  await db.schema.createIndex('transaction_type').on('transaction').column('type').execute()
  await db.schema.createIndex('transaction_status').on('transaction').column('status').execute()
  await db.schema.createIndex('transaction_origen').on('transaction').column('id_account_origin').execute()
  await db.schema.createIndex('transaction_target').on('transaction').column('id_account_target').execute()

  
  console.log("✔️ Criando tabela Order")
  await db.schema
    .createTable('payment_order')
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('digits','varchar',(col) => col.notNull())
      .addColumn('namespace_code','varchar',(col) => col.references('namespace.code').notNull())
      .addColumn('id_account_origin','varchar',(col) => col.references('account.account_number').notNull())
      .addColumn('due','date',(col) => col.notNull())
      .addColumn('amount','integer',(col) => col.notNull())
      .addColumn('status', sql`transaction_status`,(col) => col.defaultTo('pending').notNull())
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('payed_at','timestamptz')
    .execute()
    
  await db.schema.createIndex('payment_order_namespace').on('payment_order').column('namespace_code').execute()
  await db.schema.createIndex('payment_order_origin').on('payment_order').column('id_account_origin').execute()
  await db.schema.createIndex('payment_order_digits').on('payment_order').column('digits').execute()
  await db.schema.createIndex('payment_order_status').on('payment_order').column('status').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.log("❌ Deletando tabela Transactions")
  await db.schema.dropType('transaction').execute()
  console.log("❌ Deletando tabela Order")
  await db.schema.dropType('payment_order').execute();
}