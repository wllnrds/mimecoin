import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  console.log("✔️ Criando tabela Namespace")
  await db.schema
    .createTable('namespace')
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('code','varchar',(col) => col.unique().notNull())
      .addColumn('pic','varchar')
      .addColumn('name','varchar',(col) => col.notNull())
      .addColumn('status', sql`status`,(col) => col.defaultTo('active').notNull())
      .addColumn('created_by','integer',(col) => col.references('user.id').onDelete('cascade').notNull())
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
    
  await db.schema.createIndex('namespace_code').on('namespace').column('code').execute()
  await db.schema.createIndex('namespace_status').on('namespace').column('status').execute()
  
  console.log("✔️ Criando tabela Namespace Limit")
  await db.schema
    .createTable('namespace_limit').ifNotExists()
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('id_namespace','integer',(col) => col.references('namespace.id').onDelete('cascade').notNull())
      .addColumn('max_offer','integer', (col) => col.defaultTo(1000).notNull())
      .addColumn('precision','integer', (col) => col.defaultTo(2).notNull())
      .addColumn('expires_at','timestamptz')
      .addColumn('active', 'boolean', (col) => col.defaultTo(true).notNull())
      .addColumn('created_at','timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()) 
      .addColumn('updated_at','timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
    
  await db.schema.createIndex('namespace_limit_namespace').on('namespace_limit').column('id_namespace').execute()
  await db.schema.createIndex('namespace_limit_expires_at').on('namespace_limit').column('expires_at').execute()

  console.log("✔️ Criando tipo User Namespace")
  await db.schema
    .createTable('user_namespace').ifNotExists()
      .addColumn('id_user','integer',(col) => col.references('user.id').onDelete('cascade').notNull())
      .addColumn('id_namespace','integer',(col) => col.references('namespace.id').onDelete('cascade').notNull())
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

  await db.schema.alterTable('user_namespace').addUniqueConstraint('user_namespace_index',['id_user','id_namespace']).execute();

  console.log("✔️ Criando tipo AccessToken")
  await db.schema
    .createTable('access_token').ifNotExists()
      .addColumn('id','serial',(col) => col.primaryKey())
      .addColumn('id_user','integer',(col) => col.references('user.id').onDelete('cascade').notNull())
      .addColumn('id_namespace','integer',(col) => col.references('namespace.id').onDelete('cascade').notNull())
      .addColumn('key','varchar',(col) => col.unique().notNull())
      .addColumn('secret','varchar',(col) => col.notNull())
      .addColumn('expires_at','timestamptz')
      .addColumn('created_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at','timestamptz',(col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
    
  await db.schema.createIndex('access_token_user').on('access_token').column('id_user').execute()
  await db.schema.createIndex('access_token_namespace').on('access_token').column('id_namespace').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.log("❌ Deletando tabela Namespace")
  await db.schema.dropType('namespace').execute();
  console.log("❌ Deletando tabela Namespace Limit")
  await db.schema.dropType('namespace_limit').execute();
  console.log("❌ Deletando tabela User Namespace")
  await db.schema.dropType('user_namespace').execute();
  console.log("❌ Deletando tabela Access Token")
  await db.schema.dropType('access_token').execute();
}