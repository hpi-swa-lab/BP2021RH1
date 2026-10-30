# End-to-end tests

The Cypress tests in `projects/bp-gallery/cypress/e2e` run against the same Docker Compose stack as local development (see [local-setup.md](local-setup.md)), but in stacks of their own with fresh test data:

```sh
compose/e2e.sh                                       # all tests, about 2 minutes on 16 cores
compose/e2e.sh --spec cypress/e2e/contact.cy.ts      # one file on a single stack
```

CI runs the same script (`.github/workflows/e2e.yml`).

## What the script does

1. Installs the gallery's dependencies and the Cypress binary (`compose/install.sh`), then builds the gallery (`vite build -m test`, using `environments/.env.test`) while it installs and compiles Strapi (`tsc`).
2. Meanwhile it starts several stacks, Compose projects `bp-e2e-0`, `bp-e2e-1`, …, and splits the spec files between them. Each stack has its own database, search index, S3 and Mailpit, so the specs in one stack don't see what the others change. Their gallery containers wait for the build to finish and then serve it with `vite preview`.
3. Each stack runs its specs in the `cypress/base` image (Node and the libraries Cypress needs, no browsers; the tests use the Electron browser that comes with Cypress), and the script prints a summary per stack and removes the stacks.

The Cypress binary is kept in `~/.cache/bp-e2e-cypress` (`E2E_CYPRESS_CACHE`). In CI, `actions/cache` keeps it and the projects' `node_modules` between runs.

The number of stacks is half the CPU cores, at most 5; set `E2E_SHARDS` to change it. The script splits the specs by how long they took last time (`/tmp/bp-e2e/durations`), longest first; without a local run, it uses the times of a CI run in `compose/e2e-durations`. CI splits the specs over three runners with two stacks each (`E2E_RUNNERS`, `E2E_RUNNER`). Logs are in `/tmp/bp-e2e/`, including the container logs of each stack that failed (in CI, in the run's `e2e-N` artifacts); set `E2E_KEEP=1` to keep the stacks running for a look afterwards (`docker compose -p bp-e2e-0 logs strapi`).

## Differences from the dev stack

`docker-compose.e2e.yml` changes the dev stack as follows:

- No ports are opened on the host, so the tests can run while the dev stack is up. Cypress shares the network namespace of the `strapi` container and reaches Strapi on `localhost:9000`, the gallery on `localhost:3000`, and the other services by name (`http://mailpit:8025`, `http://meilisearch:7700`).
- Strapi runs with `strapi start` from the `dist` folder that `strapi build` made, admin panel included.
- The gallery is a production build, not the Vite dev server. The type check (`tsc`) runs in the lint workflow instead.
- The tests use the committed GraphQL client (`src/graphql/APIConnector.tsx`) as it is.

All stacks use the same checkout, including `node_modules`, so don't run `compose/e2e.sh` while `docker compose run install` is running for the dev stack. To test another commit, run it from a git worktree of that commit.

## Writing tests

- Emails go to Mailpit; read them with `cy.request('http://mailpit:8025/api/v1/messages')` (see `contact.cy.ts`).
- Tests in one spec file share a database and run in order. A spec that changes data cleans up after itself, as the `after` hooks do, so that it doesn't depend on which other specs share its stack.
- Screenshots of failed tests end up in `projects/bp-gallery/cypress/screenshots`.
