CREATE TYPE "transaction_type" AS ENUM (
  'mint',
  'transfer',
  'deposit',
  'withdraw',
  'payment',
  'bonus',
  'cashback'
);

CREATE TABLE "user" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "lastName" varchar,
  "email" varchar,
  "password" varchar
);

CREATE TABLE "user_namespace" (
  "id_user" integer,
  "id_namespace" integer,
  PRIMARY KEY ("id_user", "id_namespace")
);

CREATE TABLE "acess_token" (
  "id" integer PRIMARY KEY,
  "id_user" integer,
  "id_namespace" integer,
  "key" varchar,
  "secret" varchar,
  "expiresAt" varchar
);

CREATE TABLE "customer" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "email" varchar,
  "password" varchar
);

CREATE TABLE "namespace" (
  "id" integer PRIMARY KEY,
  "pic" varchar,
  "name" varchar,
  "code" varchar UNIQUE,
  "status" boolean
);

CREATE TABLE "account" (
  "id" integer PRIMARY KEY,
  "id_namespace" integer,
  "account_number" varchar UNIQUE,
  "account_key" varchar,
  "balance" double,
  "balance_extra" double,
  "id_customer" integer
);

CREATE TABLE "transaction" (
  "id" integer PRIMARY KEY,
  "date_transation" datetime,
  "amount" double,
  "headline" varchar,
  "details" text,
  "id_namespace" integer,
  "id_account_origin" integer,
  "id_account_target" integer,
  "type" transaction_type
);

ALTER TABLE "user_namespace" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");

ALTER TABLE "user_namespace" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "acess_token" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");

ALTER TABLE "acess_token" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "account" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "account" ADD FOREIGN KEY ("id_customer") REFERENCES "customer" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account_origin") REFERENCES "account" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account_target") REFERENCES "account" ("id");