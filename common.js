/* Code commun : année du pied de page (calculée depuis l'année du navigateur). */
(function () {
  'use strict';
  function init() {
    var y = String(new Date().getFullYear());
    var els = document.querySelectorAll('.js-current-year');
    for (var i = 0; i < els.length; i++) els[i].textContent = y;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
