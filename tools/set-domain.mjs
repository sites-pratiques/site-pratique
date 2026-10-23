// Remplace le domaine de production dans tout le site (canonical, sitemap, robots, JSON-LD, mentions légales).
// Usage : node tools/set-domain.mjs https://www.mon-nouveau-domaine.fr
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv[2];
if (!arg || !/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(arg)) {
  console.error('Usage : node tools/set-domain.mjs https://mon-domaine.fr   (sans "/" final)');
  process.exit(1);
}
const cfgPath = join(root, 'site.config.json');
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const oldDomain = cfg.domain;
const oldHost = oldDomain.replace('https://', '');
const newHost = arg.replace('https://', '');
let changed = 0;
for (const f of readdirSync(root,{recursive:true})) {
  if (!/\.(html|xml|txt)$/.test(f)) continue;
  const p = join(root, f);
  const src = readFileSync(p, 'utf8');
  const out = src.split(oldDomain).join(arg).split(oldHost).join(newHost);
  if (out !== src) { writeFileSync(p, out); changed++; console.log('modifié :', f); }
}
cfg.domain = arg;
writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
console.log(`Domaine ${oldDomain} -> ${arg} (${changed} fichier(s) modifié(s)).`);
