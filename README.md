# Sites Pratiques — portail

Site statique (HTML/CSS/JS, aucune dépendance). Structure : `/catégorie/outil/`.
- `/informatique/raccourcis-clavier/` (188 fiches, données dans `shortcuts-data.js`, puis `node` prerender du site d'origine)
- `/informatique/generateur-qr-code/` (encodeur MIT de Kazuhiko Arase dans `qr-core.js`)
- `/animaux-et-equitation/age-du-cheval/`
- `base.css` : socle commun, identique à la référence. `style.css` : styles du portail et du générateur.
- `node tools/check.mjs` · `node tools/set-domain.mjs https://…` · `node tools/set-adsense-meta.mjs ca-pub-…`
- À compléter : `[À compléter : …]` dans les mentions légales. Domaine provisoire : sites-pratiques.vercel.app.
