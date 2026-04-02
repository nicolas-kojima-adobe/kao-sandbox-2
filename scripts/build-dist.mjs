import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const EXCLUDE = new Set(['node_modules', '.git', 'dist', 'coverage', 'logs']);

/** Recursive copy without fs.cpSync (Cloud Manager may run Node older than 16.7). */
function copyRecursiveSync(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (EXCLUDE.has(entry.name)) continue;
  const from = path.join(root, entry.name);
  const to = path.join(dist, entry.name);
  copyRecursiveSync(from, to);
}

console.log('Build: static assets copied to dist/');
