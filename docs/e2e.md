# End-to-end tests

The Playwright tests in `projects/bp-gallery/e2e` run against the same Docker Compose stack as local development (see [local-setup.md](local-setup.md)), but in stacks of their own with fresh test data:

```sh
compose/e2e.sh                                       # all tests, about 2 minutes on 16 cores
compose/e2e.sh e2e/contact.spec.ts                   # one file on a single stack (arguments go to `playwright test`)
```

CI runs the same script (`.github/workflows/e2e.yml`).

## What the script does

1. Installs the gallery's dependencies (`compose/install.sh`), then builds the gallery (`vite build -m test`, using `environments/.env.test`) while it installs and builds Strapi and its admin panel (`strapi build`).
2. Meanwhile it starts several stacks, Compose projects `bp-e2e-0`, `bp-e2e-1`, …. Each stack has its own database, search index, S3 and Mailpit, so the specs in one stack don't see what the others change. Their gallery containers wait for the build to finish and then serve it with `vite preview`.
3. It runs `playwright test` in the official Playwright image (`mcr.microsoft.com/playwright`) with one worker per stack, and then removes the stacks. When you update `@playwright/test` in `projects/bp-gallery/package.json`, update the image tag in `docker-compose.e2e.yml` and the `playwright@` version in the workflow's merge job to match.

The tests run on the working tree, so a run sees edits made while it runs.

The number of stacks is half the CPU cores, at most 5, or one when the script gets arguments; set `E2E_STACKS` to change it. In CI, three runners with three stacks each take every third spec file (`E2E_SHARD` in `playwright.config.ts`). The run's page lists failed and flaky tests, failures also show up as annotations in the PR's diff, and the `e2e-report` artifact holds the merged HTML report with the screenshots and traces of failed tests; a runner that fails also leaves its container logs in an `e2e-logs-N` artifact.

After a run, open the report with `pnpm exec playwright show-report` in `projects/bp-gallery`. Failed tests leave a screenshot and a trace in `projects/bp-gallery/test-results/`, and the stacks' container logs are then in `/tmp/bp-e2e/`; open a trace with `pnpm exec playwright show-trace <trace.zip>`. Set `E2E_KEEP=1` to keep the stacks running for a look afterwards (`docker compose -p bp-e2e-0 logs strapi`).

## Differences from the dev stack

`docker-compose.e2e.yml` changes the dev stack as follows:

- No ports are opened on the host, so the tests can run while the dev stack is up.
- The test build uses relative addresses: the gallery's `vite preview` passes `/api` on to Strapi, `/meilisearch` to the stack's search index and `/mailpit` to its Mailpit (`vite.config.ts`).
- Strapi uses the schema `dev`, as staging does on the server. The tables in `public` are there but empty, so SQL that names no schema finds no data and the tests fail.
- Strapi runs with `strapi start` from the `dist` folder that `strapi build` made, admin panel included.
- The gallery is a production build, not the Vite dev server. The type check (`tsc`) runs in the lint workflow instead.
- The tests use the committed GraphQL client (`src/graphql/APIConnector.tsx`) as it is.

All stacks use the same checkout, including `node_modules`, so don't run `compose/e2e.sh` while `docker compose run install` is running for the dev stack.

## Writing tests

- Import `test` and `expect` from `e2e/test.ts`, not from `@playwright/test`, so that tests use their worker's stack.
- Emails go to the stack's Mailpit at `stack.mailpit` (see the `mails` fixture in `contact.spec.ts`).
- A test that calls the GraphQL API directly has to send one of the app's operations from `bp-graphql`, by name and with the same text (see `curatorToken` in `e2e/test.ts`); Strapi refuses any other query as missing a permission.
- Each test starts with the test data: before it, the `freshData` fixture in `e2e/test.ts` resets the stack's database and search index (`projects/bp-strapi/src/e2eReset.ts`). So tests don't clean up after themselves. Serial specs set `test.use({ freshData: false })` and call `resetData()` in `beforeAll` instead, so their tests can build on each other's changes. The reset exists only when Strapi runs with `E2E_RESET=true`, and then Strapi refuses to start unless its database host is `postgres` (the Compose service) and `NODE_ENV` isn't `production`, so a server can't offer it.
- Each test gets a fresh page by default. `test.use({ curator: true })` logs these pages in as the test curator; for a page of your own, call `logInAs(page, curatorToken)`.
- Where tests build on what the test before left, the spec runs them in `serial` mode, so that a failed test skips the rest: on one page opened in `beforeAll` where they continue on the page (a picture open, a form half filled), and on fresh pages where a later test works with data an earlier one added (the bulk edit tag specs).
- Use Playwright's assertions (`await expect(locator).toBeVisible()`), which retry until they pass, instead of reading values once; `e2e/helper.ts` has `expectText` and `expectNoText` for text that is or isn't on the page.
- Find elements the way a visitor would: by role, label, title or text (`getByRole`, `getByLabel`, `getByTitle`, `getByText`), else by `getByTestId`. Use CSS classes only where nothing else names the element, since they change with the layout and MUI versions.
- Playwright matches a string case-insensitively and as part of a longer text, so `hasText: 'Orte'` also finds "Schlagworte". Pass `{ exact: true }` to `getByText` and `getByRole`, or a regular expression; for `hasText`, use `caseSensitive()` from `e2e/helper.ts`. ESLint flags string literals without these, but not variables.
- Split long tests into `test.step`s, so the report shows which step failed. The helpers in `e2e/helper.ts` that open a picture, select pictures or change tags are steps already; wrap a helper of your own in `step` from there, so a failure points at the line in the spec that called it.
- The save status of the picture sidebar and bulk edit reads "Gespeichert." before anything changes, so waiting for it doesn't wait for a save; wrap the action in `expectSaved`, which waits for the mutation's response.
- `pnpm check` type-checks and lints the tests along with the gallery (see [local-setup.md](local-setup.md) for running it in the container).
