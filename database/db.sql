CREATE TYPE "status" AS ENUM (
  'active',
  'deactive',
  'blocked'
);

CREATE TYPE "transaction_type" AS ENUM (
  'mint',
  'transfer',
  'deposit',
  'withdraw',
  'payment',
  'bonus',
  'cashback',
  'refund'
);

CREATE TYPE "transaction_status" AS ENUM (
  'pending',
  'confirmed',
  'cancelled'
);

CREATE TYPE "payment_status" AS ENUM (
  'pending',
  'payed',
  'cancelled',
  'overdue'
);

CREATE TABLE "user" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "lastName" varchar,
  "email" varchar,
  "password" varchar,
  "status" status
);

CREATE TABLE "user_limit" (
  "id" integer PRIMARY KEY,
  "id_user" integer,
  "max_namespaces" integer,
  "expires_at" datetime,
  "active" boolean DEFAULT true
);

CREATE TABLE "user_namespace" (
  "id_user" integer,
  "id_namespace" integer,
  PRIMARY KEY ("id_user", "id_namespace")
);

CREATE TABLE "access_token" (
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
  "birthdate" varchar,
  "email" varchar,
  "document" varchar,
  "status" status,
  "pin" varchar
);

CREATE TABLE "namespace" (
  "id" integer PRIMARY KEY,
  "code" varchar UNIQUE,
  "pic" varchar,
  "name" varchar,
  "status" status,
  "precision" int
);

CREATE TABLE "namespace_limit" (
  "id" integer PRIMARY KEY,
  "id_namespace" integer,
  "max_offer" double,
  "expires_at" datetime,
  "active" boolean DEFAULT true
);

CREATE TABLE "account" (
  "id" integer PRIMARY KEY,
  "id_customer" integer,
  "namespace_code" varchar,
  "account_number" varchar UNIQUE,
  "account_key" varchar,
  "account_password" varchar,
  "balance" double,
  "balance_extra" double,
  PRIMARY KEY ("namespace_code", "account_number")
);

CREATE TABLE "transaction" (
  "id" integer PRIMARY KEY,
  "type" transaction_type,
  "date_transation" datetime,
  "amount" double,
  "headline" varchar,
  "details" text,
  "id_account" integer,
  "id_namespace" integer,
  "id_account_origin" integer,
  "id_account_target" integer,
  "status" transaction_status,
  "hash" varchar
);

CREATE TABLE "payment_order" (
  "id" integer PRIMARY KEY,
  "digits" varchar UNIQUE,
  "id_account_origin" integer,
  "due" date,
  "amount" double,
  "status" payment_status
);

CREATE INDEX ON "user" ("email");

CREATE INDEX ON "user" ("status");

CREATE INDEX ON "user_limit" ("id_user");

CREATE INDEX ON "access_token" ("id_user");

CREATE INDEX ON "access_token" ("id_namespace");

CREATE INDEX ON "customer" ("name");

CREATE INDEX ON "customer" ("document");

CREATE INDEX ON "customer" ("email");

CREATE INDEX ON "customer" ("status");

CREATE INDEX ON "namespace" ("code");

CREATE INDEX ON "namespace" ("name");

CREATE INDEX ON "namespace" ("status");

CREATE INDEX ON "namespace_limit" ("id_namespace");

CREATE INDEX ON "namespace_limit" ("expires_at");

CREATE UNIQUE INDEX ON "account" ("id_customer", "namespace_code");

CREATE INDEX ON "account" ("id_customer");

CREATE INDEX ON "account" ("namespace_code");

CREATE INDEX ON "account" ("account_number");

CREATE INDEX ON "transaction" ("type");

CREATE INDEX ON "transaction" ("id_namespace");

CREATE INDEX ON "transaction" ("id_account_origin");

CREATE INDEX ON "transaction" ("id_account_target");

CREATE INDEX ON "payment_order" ("digits");

CREATE INDEX ON "payment_order" ("id_account_origin");

CREATE INDEX ON "payment_order" ("status");

COMMENT ON TABLE "user_limit" IS 'Cada usuário pode ter vários limites, o limite real é a soma dos limites ativos e não expirados.';

COMMENT ON COLUMN "user_limit"."max_namespaces" IS 'O máximo padrão é 1.';

COMMENT ON COLUMN "user_limit"."expires_at" IS 'diz que um limite pode expirar';

COMMENT ON COLUMN "customer"."pin" IS 'hash do pin';

COMMENT ON COLUMN "namespace"."code" IS 'O códio são 3 dígitos de 0 a 9';

COMMENT ON COLUMN "namespace"."precision" IS 'Por padrão todo namespace tem 0 ou 2 de precisão decimal. Valor máximo é 9. ';

COMMENT ON TABLE "namespace_limit" IS 'Cada namespace pode ter vários limites, o limite real é a soma dos limites ativos e não expirados.';

COMMENT ON COLUMN "namespace_limit"."max_offer" IS 'Por padrão todo namespace tem 100000 de oferta maxima.';

COMMENT ON COLUMN "namespace_limit"."expires_at" IS 'diz que um limite pode expirar';

COMMENT ON COLUMN "account"."account_number" IS 'número da conta sem digito verificador';

COMMENT ON COLUMN "account"."account_key" IS 'digito verificador';

COMMENT ON COLUMN "account"."account_password" IS 'hash da senha da conta';

COMMENT ON COLUMN "transaction"."amount" IS 'O valor é negativo sempre que for uma subtração da conta e positivo quando for uma adição';

COMMENT ON COLUMN "transaction"."id_account" IS 'Cria um registro de transação para cada conta envolvida';

COMMENT ON COLUMN "transaction"."hash" IS '[id_namespace] + [id_account_origin] + [type] + [amount] + [id_account_target] + [ pin ]';

COMMENT ON COLUMN "payment_order"."digits" IS '46 digitos';

ALTER TABLE "user_limit" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");

ALTER TABLE "user_namespace" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");

ALTER TABLE "user_namespace" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "access_token" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");

ALTER TABLE "access_token" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "namespace_limit" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "account" ADD FOREIGN KEY ("id_customer") REFERENCES "customer" ("id");

ALTER TABLE "account" ADD FOREIGN KEY ("namespace_code") REFERENCES "namespace" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account") REFERENCES "account" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account_origin") REFERENCES "account" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account_target") REFERENCES "account" ("id");

ALTER TABLE "payment_order" ADD FOREIGN KEY ("id_account_origin") REFERENCES "account" ("id");