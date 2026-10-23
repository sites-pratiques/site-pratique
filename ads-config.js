/*
 * Configuration Google AdSense — DÉSACTIVÉE PAR DÉFAUT.
 *
 * Aucun script AdSense n'est chargé tant que les trois conditions suivantes
 * ne sont pas toutes réunies (voir docs/ADSENSE.md) :
 *   1. enabled vaut true ;
 *   2. publisherId contient VOTRE véritable identifiant éditeur (ca-pub- + 16 chiffres) ;
 *   3. consentManagementConfirmed vaut true, ce qui signifie que vous avez
 *      réellement installé et testé une plateforme de consentement (CMP)
 *      certifiée Google.
 *
 * Ne remplissez jamais publisherId avec un identifiant qui n'est pas le vôtre.
 */
window.SP_ADS_CONFIG = {
  enabled: false,
  publisherId: '',                  // à renseigner : ca-pub-XXXXXXXXXXXXXXXX
  consentManagementConfirmed: false, // passer à true seulement après installation d'une CMP
  slots: {                           // identifiants numériques d'unités d'annonces créées dans AdSense
    home: '',        // accueil, après la section « Choisissez votre environnement »
    guide: '',       // guide, entre deux sections
    categories: ''   // pages de catégories, en bas de page (même unité réutilisable)
  }
};
