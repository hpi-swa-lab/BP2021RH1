import { writeFile } from 'fs/promises';
import { normalize, resolve } from 'path';
import { Operation } from './Operation.js';
import * as operationsMap from './operations.js';
import { operationGraphQLPath } from './paths.js';

const formatSource = (source: string) => {
  return source.replace(/[\s,]+/g, ' ').trim();
};

const joinOperations = (operations: Operation[]) => {
  const generatedNote =
    '# NOTE: this file is auto-generated, edit /projects/bp-graphql/operations instead';
  const sources = operations
    .sort(
      (a, b) =>
        // sort by type (queries before mutations), then by name
        b.document.type.localeCompare(a.document.type) ||
        a.document.name.localeCompare(b.document.name)
    )
    .map(operation => formatSource(operation.document.source));
  return [generatedNote, ...sources].join('\n') + '\n';
};

export const generateOperationGraphQL = async () => {
  const operations = Object.values(operationsMap);
  const operationsFile = joinOperations(operations);
  await writeFile(operationGraphQLPath, operationsFile);
};

if (resolve(process.argv[1]) === normalize(__filename)) {
  generateOperationGraphQL();
}
