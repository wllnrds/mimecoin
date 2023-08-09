import { Kysely,sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  console.log("✔️ Criando tabela User")

  await db.schema
    .createTable('user').ifNotExists()
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('name','varchar',(col) => col.notNull())
      .addColumn('email','varchar',(col) => col.notNull().unique())
      .addColumn('password','varchar',(col) => col.notNull())
      .addColumn('status',sql`status`,(col) => col.defaultTo('new').notNull())
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

  await db.schema.createIndex('user_status').on('user').column('status').execute()
  await db.schema.createIndex('user_email').on('user').column('email').execute()
  
  console.log("✔️ Criando tabela User Limit")
  await db.schema
    .createTable('user_limit').ifNotExists()
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('id_user','integer',(col) => col.references('user.id').onDelete('cascade').notNull())
      .addColumn('max_namespace','integer',(col) => col.defaultTo(1).notNull())
      .addColumn('expires_at','timestamptz')
      .addColumn('active','boolean',(col) => col.defaultTo(true).notNull())
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
    
  await db.schema.createIndex('user_limit_user').on('user_limit').column('id_user').execute()
  await db.schema.createIndex('user_limit_expires_at').on('user_limit').column('expires_at').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.log("❌ Deletando tabela User")
  await db.schema.dropType('user').execute();
  console.log("❌ Deletando tabela User Limit")
  await db.schema.dropType('user_limit').execute();
}