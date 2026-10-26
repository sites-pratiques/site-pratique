# Déploiement sur Vercel

1. Décompressez l'archive dans le dossier de votre dépôt (remplacez les fichiers existants).
2. Vérifiez : `node tools/check.mjs`
3. Terminal Windows (PowerShell), à la racine du dépôt :
```
cd C:\chemin\vers\votre\depot
node tools/check.mjs
git status
git add .
git commit -m "SEO, accessibilité et préparation AdSense"
git push
```
4. Vercel redéploie automatiquement (Framework Preset `Other`, pas de commande de build, répertoire de sortie : racine).
5. Contrôlez en ligne : `/`, `/windows.html`, `/guide.html`, `/robots.txt`, `/sitemap.xml`, `/index.html` (doit rediriger vers `/`), une URL inexistante (page 404).
6. Dans Vercel > Settings > Analytics / Speed Insights : vérifiez qu'ils sont désactivés (sinon, mettez à jour la politique de confidentialité).

## Changer de domaine
```
node tools/set-domain.mjs https://www.mon-domaine.fr
node tools/check.mjs
```
Puis redéployez et ajoutez la nouvelle propriété dans Search Console. Tant que le domaine `.vercel.app` n'est pas définitif, évitez de l'utiliser en AdSense : AdSense demande généralement un domaine que vous possédez (à confirmer dans votre compte).
