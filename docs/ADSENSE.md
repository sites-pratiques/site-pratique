# Activer AdSense plus tard

État actuel : **aucune publicité, aucun script AdSense**, aucun identifiant. Les emplacements (`<aside class="ad-slot" hidden>`) sont masqués et n'occupent aucun espace.
Emplacements : accueil (après « Choisissez votre environnement »), guide (entre deux sections), bas des pages Windows, Mac et Navigateurs (identifiant `categories`). Aucun près de la recherche ou des boutons « Copier », ni sur les pages légales.

## Ce qu'il vous faut avant d'activer
1. Un compte AdSense approuvé pour votre site (je ne peux pas garantir l'approbation ; Google évalue contenu, domaine, pages légales).
2. Votre identifiant éditeur réel `ca-pub-` + 16 chiffres.
3. Des unités d'annonces créées dans AdSense (identifiants numériques « data-ad-slot »).
4. Pour l'EEE, le Royaume-Uni et la Suisse : une CMP certifiée Google (TCF) pour les annonces personnalisées. Google propose ses messages « Confidentialité et messagerie » (AdSense) ou une CMP tierce certifiée. Un bandeau « maison » ne suffit pas. Doc Google : https://support.google.com/adsense/answer/13554116
5. Pages légales : la politique de confidentialité et les mentions légales décrivent déjà AdSense et une CMP certifiée. Elles ne doivent donc être mises en ligne qu'avec l'activation réelle de la CMP et des annonces.

## Activation (dans cet ordre)
1. Installez et testez la CMP (selon sa documentation) sur toutes les pages.
2. Éditez `ads-config.js` : `enabled: true`, `publisherId: 'ca-pub-VOTRE_ID'`, `slots: { home: '…', guide: '…', categories: '…' }`, puis `consentManagementConfirmed: true` seulement quand la CMP fonctionne.
3. Redéployez et contrôlez : le script n'est chargé qu'une fois, aucune annonce n'apparaît sans configuration.
Un emplacement sans identifiant numérique reste masqué.

## Rattachement du site (examen AdSense)
Pour que Google détecte le site avant l'activation des annonces : `node tools/set-adsense-meta.mjs ca-pub-VOTRE_ID` (balise meta, aucun script), redéployez puis validez dans AdSense. Retrait : `node tools/set-adsense-meta.mjs --remove`.

## ads.txt
Ne créez `ads.txt` (à la racine) qu'après activation, avec la ligne exacte indiquée dans AdSense (Sites > ads.txt). Voir `docs/ads.txt.modele`. Je n'ai créé aucune ligne.

## Règles à respecter
Ne cliquez jamais sur vos annonces, n'incitez pas aux clics, ne placez pas d'annonce collée aux boutons du calculateur.
