// Vérifications du portail : node tools/check.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const D = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8')).domain;
let err = 0; const ko = (m) => { err++; console.log('  ✘ ' + m); };
const files = readdirSync(root, { recursive: true }).map(String).filter((f) => !f.startsWith('tools') && !f.startsWith('docs'));
const pages = files.filter((f) => f.endsWith('.html'));
const rd = (f) => readFileSync(join(root, f), 'utf8');
const titles = new Set();
for (const f of pages) {
  const h = rd(f), t = (h.match(/<title>([^<]*)/) || [])[1];
  if (titles.has(t)) ko(f + ' : title dupliqué'); titles.add(t);
  if (f !== '404.html') {
    const exp = D + '/' + (f.endsWith('index.html') ? f.slice(0, -10) : f), c = (h.match(/rel="canonical" href="([^"]+)"/) || [])[1];
    if (c !== exp) ko(f + ' : canonical ' + c);
    if ((h.match(/<h1[\s>]/g) || []).length !== 1) ko(f + ' : H1');
  }
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) try { JSON.parse(m[1]); } catch { ko(f + ' : JSON-LD'); }
  for (const m of h.matchAll(/(?:href|src)="([^"#]+)/g)) {
    const u = m[1]; if (/^(https?:|mailto:|tel:|data:)/.test(u)) continue;
    let p = u.startsWith('/') ? join(root, u) : normalize(join(root, dirname(f), u));
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p)) ko(f + ' : lien introuvable ' + u);
  }
  for (const m of h.matchAll(/https:\/\/[a-z0-9.-]+\.vercel\.app/g)) if (m[0] !== D) ko(f + ' : autre domaine ' + m[0]);
  for (const m of h.matchAll(/<aside class="ad-slot"[^>]*>/g)) if (!/\bhidden\b/.test(m[0])) ko(f + ' : pub non masquée');
  if (/ca-pub-\d|adsbygoogle\.js|<ins\b/.test(h)) ko(f + ' : AdSense actif');
}
const locs = [...rd('sitemap.xml').matchAll(/<loc>([^<]+)/g)].map((m) => m[1]).sort();
const exp = pages.filter((f) => f !== '404.html').map((f) => D + '/' + (f.endsWith('index.html') ? f.slice(0, -10) : f)).sort();
if (JSON.stringify(locs) !== JSON.stringify(exp)) ko('sitemap ≠ pages');
const a = rd('ads-config.js'); if (!/enabled:\s*false/.test(a) || !/publisherId:\s*''/.test(a) || !/consentManagementConfirmed:\s*false/.test(a)) ko('ads-config.js doit rester inactif');
console.log(pages.length + ' pages, base.css sha256 ' + createHash('sha256').update(readFileSync(join(root, 'base.css'))).digest('hex').slice(0, 16));
for (const f of pages) { const n = (rd(f).match(/À compléter/g) || []).length; if (n) console.log('  ! ' + f + ' : ' + n + ' info(s) à compléter'); }
console.log(err + ' erreur(s).'); process.exit(err ? 1 : 0);
