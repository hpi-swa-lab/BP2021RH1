import fs from 'node:fs';
import path from 'node:path';
import type { Reporter, Suite, TestCase } from '@playwright/test/reporter';

// Writes the counts and the failed and flaky tests to the run's page in GitHub Actions; the e2e workflow uses it
// when merging the runners' reports
export default class SummaryReporter implements Reporter {
  private root?: Suite;

  onBegin(_config: unknown, suite: Suite) {
    this.root = suite;
  }

  onEnd() {
    const file = process.env.GITHUB_STEP_SUMMARY;
    if (!file || !this.root) return;
    const tests = this.root.allTests();
    const outcome = (outcome: ReturnType<TestCase['outcome']>) =>
      tests.filter(test => test.outcome() === outcome);
    const line = (test: TestCase) => {
      const testDir = test.parent.project()?.testDir ?? '';
      const location = `${path.relative(testDir, test.location.file)}:${test.location.line}`;
      return `- \`${location}\` ${test.titlePath().slice(3).join(' › ')}`;
    };
    const section = (title: string, list: TestCase[]) =>
      list.length ? [`\n**${title}**\n`, ...list.map(line)] : [];
    const failed = outcome('unexpected');
    const flaky = outcome('flaky');
    const summary = [
      '### End-to-end tests\n',
      `${outcome('expected').length} passed, ${failed.length} failed, ${flaky.length} flaky, ` +
        `${outcome('skipped').length} skipped`,
      ...section('Failed', failed),
      ...section('Flaky (passed on retry)', flaky),
    ];
    fs.appendFileSync(file, summary.join('\n') + '\n');
  }
}
