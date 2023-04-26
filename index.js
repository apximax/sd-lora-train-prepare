const Jimp = require('jimp');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const _path = require('path');

const input = argv.path || './input';
const output = argv.output || './output';

const width = argv.width || 512;
const height = argv.height || 512;

let globIndex = 1;

const processFile = async (path = '', filename) => {
  const inputFilePath = _path.resolve(input, path, filename);
  const outputFilePath = _path.resolve(output, path, `${globIndex}.png`);
  if (!fs.existsSync(_path.resolve(output, path))) fs.mkdirSync(_path.resolve(output, path), { recursive: true });

  const image = await Jimp.read(inputFilePath);
  await image.cover(width, height);
  await image.writeAsync(outputFilePath);
    
  globIndex++;
};

const processDir = async (path = '') => {
  const dirData = fs.readdirSync(_path.resolve(input, path));

  for await (let item of dirData) {
    const composedPath = _path.join(path, item);
    if (fs.lstatSync(_path.resolve(input, composedPath)).isDirectory()) {
      await processDir(composedPath);
    } else {
      await processFile(path, item);
    }
  }
};

(async function () {
  if (fs.existsSync(input)) {
    await processDir();
  }  
})();