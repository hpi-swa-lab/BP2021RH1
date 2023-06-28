import { readdir, writeFile } from 'fs/promises';
import { basename } from 'path';
import {
  groupsDirectoryPath,
  groupsTsPath,
  operationsDirectoryPath,
  operationsTsPath,
} from './paths';

const generateIndexFile = async (directoryPath: string, indexFilePath: string) => {
  const fileNames = await readdir(directoryPath);
  const directory = basename(directoryPath);
  const generatedNote = '// NOTE: this file is auto-generated, run yarn generate-api instead';
  const exports = fileNames
    .slice()
    .sort()
    .map(fileName => fileName.slice(0, -'.ts'.length))
    .map(name => `export { default as ${name} } from './${directory}/${name}.js';`)
    .join('\n');
  const content = generatedNote + '\n' + exports + '\n';
  await writeFile(indexFilePath, content);
};

generateIndexFile(operationsDirectoryPath, operationsTsPath);
generateIndexFile(groupsDirectoryPath, groupsTsPath);
