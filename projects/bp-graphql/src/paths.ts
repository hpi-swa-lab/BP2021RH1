import { basename, dirname, resolve } from 'path';

const ancestorNamed = (child: string, ancestor: string) => {
  let current = child;
  while (dirname(current) !== current) {
    if (basename(current) === ancestor) {
      return current;
    }
    current = dirname(current);
  }
  throw new Error(`${child} doesn't have an ancestor named ${ancestor}`);
};

const moduleDirectory = __dirname;

export const bpGraphqlDirectoryPath = ancestorNamed(moduleDirectory, 'bp-graphql');
export const operationGraphQLPath = resolve(
  bpGraphqlDirectoryPath,
  '../bp-gallery/src/graphql/operation.graphql'
);
export const operationsDirectoryPath = resolve(bpGraphqlDirectoryPath, 'src/operations');
export const operationsTsPath = resolve(bpGraphqlDirectoryPath, 'src/operations.ts');
