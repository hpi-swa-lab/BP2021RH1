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

- Gallery: user `testCurator`, password `1234abc` (the curator account the end-to-end tests use).
- Strapi admin panel: `dev@example.com`, password `Dev12345` (added by `compose/dev-admin.sql`).

## Search index

The test data has no Meilisearch index. On every start, the `strapi` container indexes pictures and comments unless they are indexed already; after that Strapi keeps the index up to date.

## Uploads

Like production, Strapi stores new uploads in S3. Locally that is SeaweedFS, which speaks the S3 API; anyone can read from the bucket, like the production CDN.

The pictures from the test data were uploaded before, so they still come from `projects/bp-strapi/public/uploads`.

## Common tasks

- Reset the database to the test data: `docker compose down -v` (also deletes the search index and the S3 uploads), then `docker compose up`.
- Run the stack on a copy of a server database, for example to try an upgrade or a migration on real data: `compose/load-dump.sh <file from pg_dump -Fc> [schema]`, with the schema the dump holds (`public` for production, `dev` for staging). It starts from an empty database on every run, with search indexing off; stop the dev stack first, both use the same ports. `docker compose -p bp-dump down -v` deletes the copy. The pictures' URLs still point to production's CDN, so opening the gallery or the admin media library loads them from the real hosting; uploads and deletes go to the local S3.
- Reinstall dependencies after a `package.json` change or a change in `projects/bp-graphql`: `docker compose run --rm install`.
- Strapi reads the operations from `projects/bp-graphql` only when it starts, and its own restart on a change in `projects/bp-strapi/src` can come before `bp-graphql` is rebuilt. After changing operations, `docker compose restart strapi`, or it refuses the new ones as missing a permission.
- The gallery container uses Strapi's network, so it loses its connection whenever the Strapi container restarts: run `docker compose restart gallery` after `docker compose restart strapi`. The gallery also needs a restart when Vite stops after a branch switch changed `vite.config.ts` ("failed to load config" in `docker compose logs gallery`); it doesn't retry. On the database copy, `-p bp-dump` goes after `docker compose`.
- Regenerate the gallery's GraphQL client (`src/graphql/APIConnector.tsx` and `operation.graphql`) after changing an operation in `projects/bp-graphql`: `docker compose exec gallery pnpm generate-api`. It reads the schema from `src/graphql/schema/schema.json`; after changing Strapi's GraphQL schema (a content type, a custom query), update that file first with `docker compose exec gallery pnpm refresh-schema`, which reads it from the running Strapi. CI fails when the generated files differ from what is committed.
- Run a command in a project: `docker compose exec gallery pnpm lint`, `docker compose exec strapi pnpm strapi …`.
- Type-check and lint the gallery and its e2e tests, also without the stack running: `docker compose run --rm --no-deps install sh -c 'cd /repo/projects/bp-gallery && pnpm check'`. CI runs the same checks.
- Format the gallery code before committing: `docker compose exec gallery pnpm format`. The gallery's pre-commit hook (Husky) normally does this, but this setup doesn't install it because it needs pnpm on the host.

The services listen on 127.0.0.1 only.
