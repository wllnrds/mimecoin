import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  console.log("✔️ Alterando tabela account e adicionando status")
  await db.schema.alterTable('account')
    .addColumn('status', sql`status`,(col) => col.defaultTo('new').notNull())
  .execute()

  await db.schema.createIndex('account_status').on('account').column('status').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.log("❌ Alterando tabela account e removendo status")
  await db.schema.alterTable('account').dropColumn('status').execute()
}