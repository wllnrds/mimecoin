import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  console.log("✔️ Criando tipo Status")
  await db.schema
    .createType('status').asEnum([
      'active',
      'deactive',
      'blocked',
      'new'
    ]).execute()
  
  console.log("✔️ Criando tipo Transactions")
  await db.schema
    .createType('transaction_type').asEnum([
      'mint',
      'transfer',
      'deposit',
      'withdraw',
      'payment',
      'bonus',
      'cashback',
      'refund'
    ]).execute()

  console.log("✔️ Criando tipo Transactions Status")
  await db.schema
    .createType('transaction_status').asEnum([
      'pending',
      'confirmed',
      'cancelled'
    ]).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.log("❌ Deletando tipo Status")
  await db.schema.dropType('status').execute();
  console.log("❌ Deletando tipo Transactions")
  await db.schema.dropType('transaction_type').execute();
  console.log("❌ Deletando tipo Transactions Status")
  await db.schema.dropType('transaction_status').execute();
}