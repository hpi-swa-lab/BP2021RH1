import fs from 'node:fs';
import path from 'node:path';
import type { FullConfig, FullResult, Reporter, Suite } from '@playwright/test/reporter';

// Writes failures.txt to the output folder: each failed test with its error, without the call log,
// and the paths of its screenshot, trace and page snapshot
export default class FailuresReporter implements Reporter {
  private root?: Suite;
  private outputDir = 'test-results';

  onBegin(config: FullConfig, suite: Suite) {
    this.root = suite;
    this.outputDir = config.projects[0]?.outputDir ?? this.outputDir;
  }

  onEnd(_result: FullResult) {
    const failures = (this.root?.allTests() ?? [])
      .filter(test => test.outcome() === 'unexpected')
      .map(test => {
        const result = test.results[test.results.length - 1];
        const error = (result.error?.message ?? '')
          .replace(/\x1b\[[0-9;]*m/g, '') // eslint-disable-line no-control-regex
          .split(/\nCall log:/i)[0]
          .trim();
        const files = new Set(result.attachments.flatMap(attachment => attachment.path ?? []));
        return [
          `${path.relative(process.cwd(), test.location.file)}:${test.location.line} › ${test
            .titlePath()
            .slice(3)
            .join(' › ')}`,
          error,
          ...[...files].map(file => `  ${path.relative(process.cwd(), file)}`),
        ].join('\n');
      });
    const file = path.join(this.outputDir, 'failures.txt');
    fs.rmSync(file, { force: true });
    if (failures.length > 0) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      fs.writeFileSync(file, failures.join('\n\n') + '\n');
    }
  }
}
