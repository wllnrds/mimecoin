import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("Account")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`) )
    .addColumn("userId", "uuid", (col) => col.references("User.id").onDelete("cascade").notNull() )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refreshToken", "text")
    .addColumn("accessToken", "text")
    .addColumn("expiresAt", "bigint")
    .addColumn("tokenType", "text")
    .addColumn("scope", "text")
    .addColumn("idToken", "text")
    .addColumn("sessionState", "text")
    .execute();

  await db.schema
    .createTable("Session")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`) )
    .addColumn("userId", "uuid", (col) => col.references("User.id").onDelete("cascade").notNull() )
    .addColumn("sessionToken", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("VerificationToken")
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema.createIndex("Account_userId_index").on("Account").column("userId").execute();
  await db.schema.createIndex("Session_userId_index").on("Session").column("userId").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("Account").ifExists().execute();
  await db.schema.dropTable("Session").ifExists().execute();
  await db.schema.dropTable("VerificationToken").ifExists().execute();
}