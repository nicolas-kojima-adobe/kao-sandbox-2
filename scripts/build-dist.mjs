import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const EXCLUDE = new Set(['node_modules', '.git', 'dist', 'coverage', 'logs']);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (EXCLUDE.has(entry.name)) continue;
  const from = path.join(root, entry.name);
  const to = path.join(dist, entry.name);
  fs.cpSync(from, to, { recursive: true });
}

console.log('Build: static assets copied to dist/');
