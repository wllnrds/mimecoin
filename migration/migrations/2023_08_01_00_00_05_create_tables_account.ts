import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  console.log("✔️ Criando tabela Customer")
  await db.schema
    .createTable('customer')
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('name','varchar',(col) => col.unique().notNull())
      .addColumn('birthday','date',(col) => col.notNull())
      .addColumn('email','varchar',(col) => col.unique().notNull())
      .addColumn('document','varchar',(col) => col.unique().notNull())
      .addColumn('status', sql`status`,(col) => col.defaultTo('new').notNull())
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
    
  await db.schema.createIndex('customer_document').on('customer').column('document').execute()
  await db.schema.createIndex('customer_email').on('customer').column('email').execute()
  await db.schema.createIndex('customer_status').on('customer').column('status').execute()

  
  console.log("✔️ Criando tabela Account")
  await db.schema
    .createTable('account')
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('id_customer','integer',(col) => col.references('customer.id').onDelete('cascade').notNull())
      .addColumn('namespace_code','varchar',(col) => col.references('namespace.code').onDelete('cascade').notNull())
      .addColumn('account_number','varchar',(col) => col.unique().notNull())
      .addColumn('account_key','varchar',(col) => col.notNull())
      .addColumn('account_password','varchar')
      .addColumn('balance','integer',(col)=> col.defaultTo(0).notNull())
      .addColumn('balance_extra','integer',(col)=> col.defaultTo(0).notNull())
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
    
  await db.schema.createIndex('account_customer').on('account').column('id_customer').execute()
  await db.schema.createIndex('account_namespace').on('account').column('namespace_code').execute()
  await db.schema.createIndex('account_number').on('account').column('account_number').execute()
  
  await db.schema.alterTable('account').addUniqueConstraint('namespace_account', ['namespace_code','account_number']).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  console.log("❌ Deletando tabela Customer")
  await db.schema.dropType('customer').execute()
  console.log("❌ Deletando tabela Account")
  await db.schema.dropType('account').execute();
}