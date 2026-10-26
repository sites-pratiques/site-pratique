/*
 * Fonctions partagées par l'accueil et les pages de catégories (rendu des fiches, filtres, copie).
 * Fonctionne dans le navigateur ET dans Node (tools/prerender.mjs), sans accès au DOM ici.
 */
(function (root) {
  'use strict';
  var PAGES = {
    windows: function (x) { return x.platform === 'Windows'; },
    mac: function (x) { return x.platform === 'Mac'; },
    browser: function (x) { return x.category === 'Navigateurs'; },
    office: function (x) { return x.category === 'Bureautique' || x.category === 'Excel'; },
    dev: function (x) { return x.category === 'VS Code'; }
  };
  var PAGE_SIZE = 18;

  function norm(s) { return (s || '').toLocaleLowerCase('fr').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function keysMarkup(keys) {
    return String(keys).split(' + ').map(function (k) { return '<kbd class="key">' + esc(k) + '</kbd>'; }).join('<span aria-hidden="true">+</span>');
  }
  function card(x) {
    return '<article class="shortcut-card"><div class="card-top"><h3>' + esc(x.name) + '</h3><span class="platform' + (x.platform === 'Mac' ? ' mac' : '') + '">' + esc(x.platform) + '</span></div>' +
      '<div class="keys">' + keysMarkup(x.keys) + '</div><p>' + esc(x.description) + '</p>' +
      '<div class="card-bottom"><span class="category">' + esc(x.app) + ' · ' + esc(x.category) + '</span>' +
      '<button class="copy-btn" type="button" data-copy="' + x.id + '" aria-label="Copier ' + esc(x.keys) + '">Copier</button></div></article>';
  }
  function countLabel(n) { return n + ' raccourci' + (n > 1 ? 's' : '') + ' trouvé' + (n > 1 ? 's' : ''); }
  function matchesQuery(x, q) {
    return !q || norm([x.name, x.keys, x.platform, x.category, x.description, x.app].join(' ')).indexOf(q) !== -1;
  }
  function unique(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }).sort(function (x, y) { return x.localeCompare(y, 'fr'); }); }

  // Copie dans le presse-papiers (avec repli si l'API n'est pas autorisée)
  function bindCopy(grid, data) {
    grid.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-copy]') : null;
      if (!b) return;
      var item = data.filter(function (x) { return x.id === Number(b.getAttribute('data-copy')); })[0];
      if (!item) return;
      function done(text, ms) { b.textContent = text; setTimeout(function () { b.textContent = 'Copier'; }, ms); }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = item.keys; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(t);
        done(ok ? 'Copié !' : 'Sélectionnez les touches', 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(item.keys).then(function () { done('Copié !', 1400); }, fallback);
      } else fallback();
    });
  }

  root.SC = { PAGES: PAGES, PAGE_SIZE: PAGE_SIZE, norm: norm, esc: esc, keysMarkup: keysMarkup, card: card, countLabel: countLabel, matchesQuery: matchesQuery, unique: unique, bindCopy: bindCopy };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.SC;
})(typeof window !== 'undefined' ? window : globalThis);
