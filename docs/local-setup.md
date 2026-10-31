# Running everything locally

Everything runs in Docker: you only need Docker with Compose. Node 22 runs inside the containers, because Strapi 4.26 does not support newer Node versions.

```sh
docker compose up
```

The first start installs all dependencies (`compose/install.sh`, a few minutes) and loads the test data (111 pictures, a curator account) from `projects/bp-strapi/e2e/data.sql` into a fresh database.

| What | URL |
| --- | --- |
| Gallery (React, Vite) | http://localhost:3000 |
| Strapi API and GraphQL | http://localhost:9000, http://localhost:9000/graphql |
| Strapi admin panel | http://localhost:9000/admin |
| Meilisearch (search) | http://localhost:7700, key `local-dev-master-key` |
| Mailpit (catches all emails Strapi sends) | http://localhost:8025 |
| S3 server for uploads (SeaweedFS) | http://localhost:8333, bucket `bp-uploads` |

Nothing talks to the hosted services: search uses the local Meilisearch, uploads go to the local S3 server, emails go to Mailpit, and Sentry and Matomo are off.

## Logins

- Gallery: user `testCurator`, password `1234abc` (the curator account the Cypress tests use).
- Strapi admin panel: `dev@example.com`, password `Dev12345` (added by `compose/dev-admin.sql`).

## Search index

The test data has no Meilisearch index. On every start, the `strapi` container (`compose/strapi.mjs`) asks the Strapi Meilisearch plugin to index pictures and comments unless they are indexed already; after that Strapi keeps the index up to date.

## Uploads

Like production, Strapi stores new uploads in S3. Locally that is SeaweedFS, which speaks the S3 API: Strapi writes with the key pair from `compose/s3.json`, and anyone can read from the bucket, like the production CDN. `AWS_ENDPOINT` and `AWS_FORCE_PATH_STYLE` in `docker-compose.yml` point Strapi at it; production leaves both unset. `compose/s3.sh` starts SeaweedFS and creates the bucket.

The pictures from the test data were uploaded before, so they still come from `projects/bp-strapi/public/uploads`.

## Common tasks

- Reset the database to the test data: `docker compose down -v` (also deletes the search index and the S3 uploads), then `docker compose up`.
- Run the stack on a copy of a server database, for example to try an upgrade or a migration on real data: `compose/load-dump.sh <file from pg_dump -Fc> [schema]`, with the schema the dump holds (`public` for production, `dev` for staging). It uses its own Compose project with Meilisearch indexing off and starts from an empty database on every run; stop the dev stack first, both use the same ports. `docker compose -p bp-dump down -v` deletes the copy. The pictures' URLs still point to production's CDN, so opening the gallery or the admin media library loads them from the real hosting; uploads and deletes go to the local S3.
- Reinstall dependencies after a `package.json` change or a change in `projects/bp-graphql`: `docker compose run --rm install`.
- Run a command in a project: `docker compose exec gallery pnpm lint`, `docker compose exec strapi pnpm strapi …`.
- Format the gallery code before committing: `docker compose exec gallery pnpm format`. The gallery's pre-commit hook (Husky) normally does this, but this setup doesn't install it because it needs pnpm on the host.

The services listen on 127.0.0.1 only.
