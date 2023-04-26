const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const _path = require('path');

const input = argv.path || './input';
const output = argv.output || './output';

const width = argv.width || 512;
const height = argv.height || 512;

const captions = !!argv.captions;
const separator = argv.separator || '.';

let globIndex = 1;

const composeCaptions = (prev, newPart) => {
  const newProcessed = newPart.split(separator).join(', ');
  return `${prev}, ${newProcessed}`;
};

const processFile = (path = '', filename, captions) => {
  const inputFilePath = _path.resolve(input, path, filename);
  const outputFilePath = _path.resolve(output, path, `${globIndex}.png`);
  if (!fs.existsSync(_path.resolve(output, path))) fs.mkdirSync(_path.resolve(output, path), { recursive: true });
  fs.copyFileSync(inputFilePath, outputFilePath);
  globIndex++;
};

const processDir = (path = '', captions) => {
  const dirData = fs.readdirSync(_path.resolve(input, path));

  dirData.forEach((item) => {
    const composedPath = _path.join(path, item);
    if (fs.lstatSync(_path.resolve(input, composedPath)).isDirectory()) {
      processDir(composedPath);
    } else {
      processFile(path, item);
    }
  });
};

if (fs.existsSync(input)) {
  processDir();
}
