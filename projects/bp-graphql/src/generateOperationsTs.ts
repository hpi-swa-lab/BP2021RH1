import { readdir, writeFile } from 'fs/promises';
import { operationsDirectoryPath, operationsTsPath } from './paths';

const generateOperationsTs = async () => {
  const operationFileNames = await readdir(operationsDirectoryPath);
  const generatedNote = '// NOTE: this file is auto-generated, run yarn generate-api instead';
  const imports = operationFileNames
    .slice()
    .sort()
    .map(fileName => fileName.slice(0, -'.ts'.length))
    .map(name => `export { default as ${name} } from './operations/${name}.js';`)
    .join('\n');
  const content = generatedNote + '\n' + imports + '\n';
  await writeFile(operationsTsPath, content);
};

generateOperationsTs();
