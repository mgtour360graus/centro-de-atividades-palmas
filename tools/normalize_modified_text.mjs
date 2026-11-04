import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
for (const relativePath of [
  'index.htm',
  'index.html',
  'skin-fecomercio/palmas.css',
  'skin-fecomercio/mg360-fecomercio-motion-skin.bundle.js',
]) {
  const filePath = path.join(root, relativePath);
  const contents = fs.readFileSync(filePath, 'utf8')
    .replace(/\r\n/g, '\n')
    .replace(/\n[ \t]+\n/g, '\n\n');
  fs.writeFileSync(filePath, contents, 'utf8');
}
