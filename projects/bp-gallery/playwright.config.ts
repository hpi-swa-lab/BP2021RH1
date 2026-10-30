import { defineConfig } from '@playwright/test';
import { readdirSync } from 'node:fs';

const specs = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory()
      ? specs(`${dir}/${entry.name}`)
      : entry.name.endsWith('.spec.ts')
      ? [`${dir}/${entry.name}`]
      : []
  );

// CI hands the spec files to its runners in turn (E2E_SHARD=2/3); Playwright's --shard would give
// each runner a block of files in name order, and the slow bulk-edit specs sort together
const [shard, shards] = (process.env.E2E_SHARD ?? '1/1').split('/').map(Number);

// Runs in the containers of compose/e2e.sh, with one stack per worker (e2e/test.ts), see docs/e2e.md
export default defineConfig({
  testDir: 'e2e',
  testMatch: specs('e2e')
    .sort()
    .filter((_, i) => i % shards === shard - 1),
  workers: process.env.E2E_PROJECTS?.split(' ').length ?? 1,
  // Hands out single tests to the workers; serial describes stay together
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    process.env.CI ? ['blob', { fileName: `report-${shard}.zip` }] : ['html', { open: 'never' }],
    // Failures as annotations on the run and the PR's diff
    ...(process.env.CI ? [['github'] as const] : []),
    ['./e2e/failures-reporter.ts'],
  ],
  use: {
    viewport: { width: 1000, height: 660 },
    // Recording a trace slows every test down, so CI records it only on the retry
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
