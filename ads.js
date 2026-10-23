/*
 * Chargeur AdSense — ne fait RIEN tant que ads-config.js n'est pas complété
 * et validé (voir docs/ADSENSE.md). Il n'injecte jamais de script par défaut.
 */
(function () {
  'use strict';
  var cfg = window.SP_ADS_CONFIG;
  if (!cfg || cfg.enabled !== true) return;
  if (!/^ca-pub-\d{16}$/.test(String(cfg.publisherId || ''))) return;
  if (cfg.consentManagementConfirmed !== true) return;

  var slots = cfg.slots || {};
  var containers = Array.prototype.filter.call(
    document.querySelectorAll('.ad-slot[data-ad-slot-name]'),
    function (el) { return /^\d+$/.test(String(slots[el.getAttribute('data-ad-slot-name')] || '')); }
  );
  if (!containers.length) return; // aucune unité configurée sur cette page : rien à charger

  function render() {
    containers.forEach(function (el) {
      if (el.querySelector('ins.adsbygoogle')) return; // évite le double rendu
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', cfg.publisherId);
      ins.setAttribute('data-ad-slot', String(slots[el.getAttribute('data-ad-slot-name')]));
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      el.appendChild(ins);
      el.hidden = false;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* ignoré */ }
    });
  }

  if (!document.querySelector('script[data-sp-adsense]')) {
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-sp-adsense', '1');
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cfg.publisherId);
    document.head.appendChild(s);
  }
  render();
})();
