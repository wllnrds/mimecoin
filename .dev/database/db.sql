CREATE TYPE "status" AS ENUM (
  'active',
  'deactive',
  'blocked',
  'new'
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

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "email" VARCHAR,
  "password" VARCHAR,
  "status" status,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_limit" (
  "id" SERIAL PRIMARY KEY,
  "id_user" INTEGER,
  "max_namespaces" INTEGER,
  "expires_at" TIMESTAMP,
  "active" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_namespace" (
  "id_user" INTEGER,
  "id_namespace" INTEGER,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id_user", "id_namespace")
);

CREATE TABLE "access_token" (
  "id" SERIAL PRIMARY KEY,
  "id_user" INTEGER,
  "id_namespace" INTEGER,
  "key" VARCHAR,
  "secret" VARCHAR,
  "expires_at" VARCHAR,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "customer" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "birthday" DATE,
  "email" VARCHAR,
  "document" VARCHAR,
  "status" status,
  "pin" VARCHAR,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "namespace" (
  "id" SERIAL PRIMARY KEY,
  "code" VARCHAR UNIQUE,
  "pic" VARCHAR,
  "name" VARCHAR,
  "status" status,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "namespace_limit" (
  "id" SERIAL PRIMARY KEY,
  "id_namespace" INTEGER,
  "max_offer" INTEGER,
  "precision" INTEGER,
  "expires_at" TIMESTAMP,
  "active" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "account" (
  "id" SERIAL PRIMARY KEY,
  "id_customer" INTEGER,
  "namespace_code" VARCHAR,
  "account_number" VARCHAR UNIQUE,
  "account_key" VARCHAR,
  "account_password" VARCHAR,
  "balance" INTEGER,
  "balance_extra" INTEGER,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "transaction" (
  "id" SERIAL PRIMARY KEY,
  "type" transaction_type,
  "amount" INTEGER,
  "headline" VARCHAR,
  "details" text,
  "id_account" SERIAL,
  "id_namespace" SERIAL,
  "id_account_origin" INTEGER,
  "id_account_target" INTEGER,
  "status" transaction_status,
  "hash" VARCHAR,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
  "confirmed_at" TIMESTAMP
);

CREATE TABLE "payment_order" (
  "id" SERIAL PRIMARY KEY,
  "digits" VARCHAR UNIQUE,
  "id_account_origin" INTEGER,
  "due" DATE,
  "amount" INTEGER,
  "status" transaction_status,
  "created_at" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP
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

CREATE UNIQUE INDEX ON "account" ("namespace_code", "account_number");

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

COMMENT ON TABLE "namespace_limit" IS 'Cada namespace pode ter vários limites, o limite real é a soma dos limites ativos e não expirados.';

COMMENT ON COLUMN "namespace_limit"."max_offer" IS 'Por padrão todo namespace tem 100000 de oferta maxima.';

COMMENT ON COLUMN "namespace_limit"."precision" IS 'Por padrão todo namespace tem 0 ou 2 de precisão decimal. Valor máximo é 9. ';

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

ALTER TABLE "account" ADD FOREIGN KEY ("namespace_code") REFERENCES "namespace" ("code");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account") REFERENCES "account" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_namespace") REFERENCES "namespace" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account_origin") REFERENCES "account" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("id_account_target") REFERENCES "account" ("id");

ALTER TABLE "payment_order" ADD FOREIGN KEY ("id_account_origin") REFERENCES "account" ("id");