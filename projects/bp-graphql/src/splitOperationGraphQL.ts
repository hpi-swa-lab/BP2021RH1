import { readFile, writeFile } from 'fs/promises';
import { operationGraphQLPath, sourceOperationsDirectoryPath } from './paths.js';

const matchingClosingBraceIndex = (content: string, openingBraceIndex: number) => {
  if (content[openingBraceIndex] !== '{') {
    throw new Error('starting on non-opening-brace');
  }
  let currentIndex = openingBraceIndex + 1;
  let depth = 1;
  while (depth > 0) {
    switch (content[currentIndex]) {
      case '{':
        depth++;
        break;
      case '}':
        depth--;
        break;
    }
    currentIndex++;
  }
  return currentIndex - 1;
};

const indent = (source: string, indentation: string) => {
  return source.replaceAll('\n', '\n' + indentation);
};

const splitOperationGraphQL = async () => {
  const operationsBuffer = await readFile(operationGraphQLPath);
  const operationsFile = operationsBuffer.toString();
  // match type, then capture operation name, then look for first opening brace
  // after the optional parameter list (which could also contain opening braces)
  const startOfOperation = /(?:query|mutation) ([a-zA-Z]+)\s*(?:\([^)]*\)\s*)?\{/g;
  const operations: { name: string; source: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = startOfOperation.exec(operationsFile))) {
    const start = match.index;
    const bodyOpeningBrace = start + match[0].length - 1;
    const end = matchingClosingBraceIndex(operationsFile, bodyOpeningBrace);
    const source = operationsFile.slice(start, end + 1);
    const name = match[1];
    operations.push({
      name,
      source,
    });
  }
  await Promise.all(
    operations.map(async operation => {
      const path = `${sourceOperationsDirectoryPath}/${operation.name}.ts`;
      const code = `
import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql\`
    ${indent(operation.source, '    ')}
  \`,
} satisfies Operation;
      `;
      await writeFile(path, code.trim() + '\n');
    })
  );
};

splitOperationGraphQL();
