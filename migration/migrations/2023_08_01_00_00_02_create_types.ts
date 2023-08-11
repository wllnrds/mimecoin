import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('status')
    .asEnum([ 'active', 'deactive', 'blocked', 'new' ])
    .execute()
    
  await db.schema
    .createType('transaction_type')
    .asEnum([ 'mint', 'transfer', 'deposit', 'withdraw', 'payment', 'bonus', 'cashback', 'refund' ]).execute()
    
  await db.schema
    .createType('transaction_status')
    .asEnum([ 'pending', 'confirmed', 'cancelled' ])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropType('status').ifExists().execute();
  await db.schema.dropType('transaction_type').ifExists().execute();
  await db.schema.dropType('transaction_status').ifExists().execute();
}