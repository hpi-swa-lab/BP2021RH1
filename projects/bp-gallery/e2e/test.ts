import { test as base, type Page } from '@playwright/test';

export { expect } from '@playwright/test';

// The Compose projects of the stacks that compose/e2e.sh started, one per worker
const projects = process.env.E2E_PROJECTS?.split(' ') ?? [];

type Stack = { gallery: string; strapi: string; mailpit: string };

// Logs the page in by giving it the token before the app loads, as the app keeps it in sessionStorage
export const logInAs = (page: Page, token: string) =>
  page.addInitScript(jwt => sessionStorage.setItem('jwt', jwt), token);

type TestFixtures = { curator: boolean; freshData: boolean; _freshData: void };
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
  page: async ({ page, curator, curatorToken }, use) => {
    if (curator) await logInAs(page, curatorToken);
    await use(page);
  },
});
