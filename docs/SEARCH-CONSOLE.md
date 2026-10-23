# Google Search Console

1. https://search.google.com/search-console > Ajouter une propriété.
   - « Préfixe d'URL » : saisissez l'URL exacte du site (ex. `https://sites-pratiques.vercel.app/`). Vérification par balise HTML : Google vous donne une balise `<meta name="google-site-verification" content="…">` à coller dans le `<head>` de `index.html` (je n'en ai pas créé). Redéployez, puis cliquez sur « Valider ».
   - « Domaine » (domaine personnalisé uniquement) : vérification par enregistrement DNS TXT.
2. Sitemaps > saisissez `sitemap.xml` > Envoyer. Statut attendu : « Réussite », 9 URL découvertes.
3. Indexation des pages > liste des pages indexées / non indexées et motifs.
4. Inspection d'URL : collez l'URL de la page d'accueil > « Tester l'URL en direct » > « Demander l'indexation » si elle n'est pas indexée.
5. Erreurs : rapport « Pages » (motifs d'exclusion : noindex, canonique, 404, exploré non indexé) et « Expérience > Core Web Vitals ».
6. Performances > Résultats de recherche : requêtes, clics, impressions, CTR, position moyenne (données après quelques jours).

L'indexation et le classement prennent du temps (de quelques jours à plusieurs semaines) et ne sont jamais garantis.
