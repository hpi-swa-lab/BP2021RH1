# Running everything locally

Everything runs in Docker: you only need Docker with Compose. Node 18 runs inside the containers, because Strapi 4.4 does not support newer Node versions.

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

Nothing talks to the hosted services: search uses the local Meilisearch, emails go to Mailpit, and Sentry and Matomo are off.

## Logins

- Gallery: user `testCurator`, password `1234abc` (the curator account the Cypress tests use).
- Strapi admin panel: `dev@example.com`, password `Dev12345` (added by `compose/seed-db.sh`).

## Search index

The test data has no Meilisearch index. On every start, the `strapi` container (`compose/strapi.mjs`) asks the Strapi Meilisearch plugin to index pictures and comments unless they are indexed already; after that Strapi keeps the index up to date.

## Common tasks

- Reset the database to the test data: `docker compose down -v` (also deletes the search index), then `docker compose up`.
- Reinstall dependencies after a `package.json` change or a change in `projects/bp-graphql`: `docker compose run --rm install`.
- Run a command in a project: `docker compose exec gallery yarn lint`, `docker compose exec strapi yarn strapi …`.
- Format the gallery code before committing: `docker compose exec gallery yarn format`. The gallery's pre-commit hook (Husky) normally does this, but this setup doesn't install it because it needs yarn on the host.

The services listen on 127.0.0.1 only.
