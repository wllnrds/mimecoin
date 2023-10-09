# Setup Mimecoin

## 1. Setup Environment Variables

```properties
NEXT_PUBLIC_GA_MEASUREMENT_ID="ACOMPANHAMENTO GOOGLE TAG"

POSTGRES_DATABASE=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""

SECRET_KEY="SECRET JWT"
NEXTAUTH_URL="HOST URL"

GOOGLE_SERVICE_KEY_="Google JSON Account Permission to PubSub Cloud"
```

### 1.1 Guides
- [Setup Google Tag](https://firebase.google.com/docs/analytics/get-started?hl=pt-br&platform=web)
- [Generate Secret](https://acte.ltd/utils/randomkeygen) [Use 256 WEP]
- [Setup Google Service Key](https://cloud.google.com/pubsub/docs/subscription-properties?hl=pt-br#authentication)

## 2. Run migrations

```shell
cd ./migration
npm i
npm run build
npm run migrate
```

## 3. It's ready to build

```shell
npm i
npm run build
npm start
```

---

## Caveats

### Generate Database @types

```shell
# Run it after migrated
# Change --url param from package.json `db:schema` script
npm run db:schema

# or just run
kysely-codegen --dialect postgres --url postgres://user:password@host/databaseName --out-file ./src/lib/database/db.d.ts
```