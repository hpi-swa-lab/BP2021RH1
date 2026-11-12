import { test as base, expect, type Page, type Response } from '@playwright/test';

export { expect } from '@playwright/test';

// The Compose projects of the stacks that compose/e2e.sh started, one per worker
const projects = process.env.E2E_PROJECTS?.split(' ') ?? [];

type Stack = { gallery: string; strapi: string; mailpit: string };

// Logs the page in by giving it the token before the app loads, as the app keeps it in sessionStorage
export const logInAs = (page: Page, token: string) =>
  page.addInitScript(jwt => sessionStorage.setItem('jwt', jwt), token);

// The errors in a GraphQL response, each as "<operation name>: <message>"
const graphqlErrors = async (response: Response) => {
  let names: unknown[] = [];
  try {
    const request: unknown = response.request().postDataJSON();
    names = (Array.isArray(request) ? request : [request]).map(
      operation => (operation as { operationName?: unknown } | null)?.operationName
    );
  } catch {
    // An upload sends a multipart body
  }
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return response.ok() ? [] : [`HTTP ${response.status()} for ${names.join(', ')}`];
  }
  return (Array.isArray(body) ? body : [body]).flatMap((result, index) =>
    ((result as { errors?: { message: string }[] } | null)?.errors ?? []).map(
      error => `${String(names[index] ?? 'unknown operation')}: ${error.message}`
    )
  );
};

type TestFixtures = {
  curator: boolean;
  freshData: boolean;
  _freshData: void;
  expectedErrors: RegExp[];
};
type WorkerFixtures = { stack: Stack; curatorToken: string; resetData: () => Promise<void> };

export const test = base.extend<TestFixtures, WorkerFixtures>({
  stack: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, workerInfo) => {
      const project = projects[workerInfo.parallelIndex];
      if (!project) throw new Error('Run the tests with compose/e2e.sh, see docs/e2e.md');
      // The gallery shares the network namespace of the strapi container and passes /mailpit on
      const gallery = `http://${project}-strapi-1:3000`;
      await use({
        gallery,
        strapi: `http://${project}-strapi-1:9000`,
        mailpit: `${gallery}/mailpit`,
      });
    },
    { scope: 'worker' },
  ],
  baseURL: async ({ stack }, use) => use(stack.gallery),
  curatorToken: [
    async ({ playwright, stack }, use) => {
      const request = await playwright.request.newContext({ baseURL: stack.gallery });
      const response = await request.post('/api/graphql', {
        // Strapi lets a visitor run only the app's operations, by name
        data: {
          operationName: 'login',
          query:
            'mutation login($username: String!, $password: String!) { login(input: { identifier: $username, password: $password }) { jwt } }',
          variables: { username: 'testCurator', password: '1234abc' },
        },
      });
      const body = await response.text();
      await request.dispose();
      const jwt = (JSON.parse(body) as { data?: { login?: { jwt: string } } }).data?.login?.jwt;
      if (!jwt) throw new Error(`Logging in as the test curator failed: ${body}`);
      await use(jwt);
    },
    { scope: 'worker' },
  ],
  // Puts the stack's database and search index back to the test data
  resetData: [
    async ({ playwright, stack }, use) => {
      const request = await playwright.request.newContext({ baseURL: stack.gallery });
      const resetData = async () => {
        const response = await request.post('/api/e2e/reset', { timeout: 30_000 });
        if (!response.ok()) throw new Error(`Resetting the data failed: ${await response.text()}`);
      };
      // The first reset saves the test data that the later ones restore
      await resetData();
      await use(resetData);
      await request.dispose();
    },
    { scope: 'worker' },
  ],
  // Each test starts with the test data, unless a spec sets this to false and calls resetData in beforeAll,
  // as serial specs do whose tests build on each other
  freshData: [true, { option: true }],
  _freshData: [
    async ({ freshData, resetData }, use) => {
      if (freshData) await resetData();
      await use();
    },
    { auto: true },
  ],
  // test.use({ curator: true }) logs the pages of the tests in as the test curator
  curator: [false, { option: true }],
  // The page fails its test on GraphQL errors and uncaught errors, because the app often shows them
  // only as missing elements, and its permission checks treat a failed request as allowed.
  // A test that causes an error on purpose lists it with test.use({ expectedErrors: [/.../] }).
  expectedErrors: [[], { option: true }],
  page: async ({ page, curator, curatorToken, expectedErrors }, use) => {
    if (curator) await logInAs(page, curatorToken);
    const errors: string[] = [];
    const reads: Promise<void>[] = [];
    page.on('pageerror', error => errors.push(`Uncaught in the page: ${error.message}`));
    // Only finished requests, since the body of a request the page dropped never arrives
    page.on('requestfinished', request => {
      if (new URL(request.url()).pathname.endsWith('/graphql')) {
        reads.push(
          request
            .response()
            .then(response => (response ? graphqlErrors(response) : []))
            .then(found => void errors.push(...found))
        );
      }
    });
    await use(page);
    await Promise.all(reads);
    const unexpected = errors.filter(error => !expectedErrors.some(regex => regex.test(error)));
    expect(unexpected, 'GraphQL errors and uncaught errors in the page').toEqual([]);
  },
});
