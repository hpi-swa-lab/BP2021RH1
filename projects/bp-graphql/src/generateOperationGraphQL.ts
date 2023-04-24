import { readdir, writeFile } from "fs/promises";
import { normalize, resolve } from "path";
import { Operation } from "./Operation.js";
import {
  compiledOperationsDirectoryPath,
  operationGraphQLPath,
} from "./paths.js";

export enum OperationType {
  query = "query",
  mutation = "mutation",
}

export type LoadedOperation = Operation & {
  name: string;
  type: OperationType;
};

const operationType = (operation: Operation): OperationType => {
  const match = operation.document.source.match(/\s*(query|mutation)/);
  if (!match) {
    throw new Error("unknown operation type");
  }
  return match[1] as OperationType;
};

export const loadOperations = async (): Promise<LoadedOperation[]> => {
  const operationFiles = await readdir(compiledOperationsDirectoryPath);
  const operations = await Promise.all(
    operationFiles.map(async (file) => {
      if (!file.endsWith(".js")) {
        return null;
      }
      const { default: operation }: { default: Operation } = await import(
        `${compiledOperationsDirectoryPath}/${file}`
      );
      return {
        ...operation,
        name: file.slice(0, -".js".length),
        type: operationType(operation),
      };
    })
  );
  return operations.filter(
    (operation): operation is LoadedOperation => !!operation
  );
};

const formatSource = (source: string) => {
  return source.replace(/[\s,]+/g, " ").trim();
};

const joinOperations = (operations: LoadedOperation[]) => {
  const generatedNote =
    "# NOTE: this file is auto-generated, edit /projects/bp-graphql/operations instead";
  const sources = operations
    .sort(
      (a, b) =>
        // sort by type (queries before mutations), then by name
        b.type.localeCompare(a.type) || a.name.localeCompare(b.name)
    )
    .map((operation) => formatSource(operation.document.source));
  return [generatedNote, ...sources].join("\n") + "\n";
};

export const generateOperationGraphQL = async () => {
  const operations = await loadOperations();
  const operationsFile = joinOperations(operations);
  await writeFile(operationGraphQLPath, operationsFile);
};

if (resolve(process.argv[1]) === normalize(__filename)) {
  generateOperationGraphQL();
}
