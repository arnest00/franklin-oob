// eslint-disable-next-line import/no-extraneous-dependencies
import sass from 'sass';
import fs from 'fs';
import path from 'path';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const compileAndSave = async (sassFile) => {
  let dest;
  // Do not compile partials
  if (!sassFile.toString().includes('_')) {
    dest = sassFile.replace(path.extname(sassFile), '.css');

    fs.writeFile(dest, sass.compile(sassFile).css, (err) => {
      // eslint-disable-next-line no-console
      if (err) console.error(err);
    });
  } else {
    const baseSassFile = path.join(dirname, '/styles/styles.scss');
    dest = baseSassFile.replace(path.extname(sassFile), '.css');

    fs.writeFile(dest, sass.compile(baseSassFile).css, (err) => {
      // eslint-disable-next-line no-console
      if (err) console.error(err);
    });
  }
};

const processFiles = async (parent) => {
  const files = await readdir(parent, { withFileTypes: true });
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    if (file.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      await processFiles(path.join(parent, file.name));
    }
    if (path.extname(file.name) === '.scss') {
      // eslint-disable-next-line no-await-in-loop
      await compileAndSave(path.join(parent, file.name));
    }
  }
};

// eslint-disable-next-line no-restricted-syntax
for (const folder of ['styles', 'blocks']) {
  try {
    // eslint-disable-next-line no-await-in-loop
    await processFiles(path.join(dirname, folder));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

fs.watch('.', { recursive: true }, (eventType, fileName) => {
  if (path.extname(fileName) === '.scss' && eventType === 'change') {
    compileAndSave(path.join(dirname, fileName));
  }
});
