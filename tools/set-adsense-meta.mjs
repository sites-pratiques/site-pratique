// Ajoute (ou retire) la balise de rattachement du site à votre compte AdSense, sur toutes les pages.
// Cette balise ne charge AUCUN script : elle permet seulement à Google de relier le site à votre compte.
// Usage :  node tools/set-adsense-meta.mjs ca-pub-XXXXXXXXXXXXXXXX      (remplacez par VOTRE identifiant)
//          node tools/set-adsense-meta.mjs --remove
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv[2];
const remove = arg === '--remove';
if (!remove && !/^ca-pub-\d{16}$/.test(arg || '')) {
  console.error('Usage : node tools/set-adsense-meta.mjs ca-pub-XXXXXXXXXXXXXXXX  (16 chiffres, votre identifiant réel)\n        node tools/set-adsense-meta.mjs --remove');
  process.exit(1);
}
const re = /\s*<meta name="google-adsense-account" content="[^"]*">/;
let n = 0;
for (const f of readdirSync(root,{recursive:true}).filter((f) => f.endsWith('.html') && f !== '404.html' && !f.startsWith('tools'))) {
  const p = join(root, f);
  const src = readFileSync(p, 'utf8');
  const base = src.replace(re, '');
  const out = remove ? base : base.replace(/(<meta charset="utf-8">)/i, `$1\n  <meta name="google-adsense-account" content="${arg}">`);
  if (out !== src) { writeFileSync(p, out); n++; }
}
console.log(remove ? `Balise retirée (${n} page(s)).` : `Balise ajoutée sur ${n} page(s). Redéployez, puis cliquez sur « Valider » dans AdSense.`);
