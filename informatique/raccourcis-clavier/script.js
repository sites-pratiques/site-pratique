/* Accueil : recherche, filtres, pagination et copie. Dépend de shortcuts-data.js et shortcuts.js. */
(function () {
  'use strict';
  var SC = window.SC, data = window.SHORTCUTS_DATA || [];
  var grid = document.getElementById('shortcut-grid');
  if (!grid || !SC) return;
  var search = document.getElementById('search'), platform = document.getElementById('platform'),
      category = document.getElementById('category'), app = document.getElementById('app'),
      count = document.getElementById('results-count'), empty = document.getElementById('no-results'),
      more = document.getElementById('show-more'), limit = SC.PAGE_SIZE;

  function fill(select, values) { values.forEach(function (v) { var o = document.createElement('option'); o.value = v; o.textContent = v; select.appendChild(o); }); }
  fill(category, SC.unique(data.map(function (x) { return x.category; })));
  fill(app, SC.unique(data.map(function (x) { return x.app; })));

  function filtered() {
    var q = SC.norm(search.value.trim());
    return data.filter(function (x) {
      return (platform.value === 'all' || x.platform === platform.value) && (category.value === 'all' || x.category === category.value) &&
        (app.value === 'all' || x.app === app.value) && SC.matchesQuery(x, q);
    });
  }
  function render(reset) {
    if (reset !== false) limit = SC.PAGE_SIZE;
    var list = filtered();
    count.textContent = SC.countLabel(list.length);
    grid.innerHTML = list.slice(0, limit).map(SC.card).join('');
    empty.hidden = list.length > 0;
    more.hidden = list.length <= limit;
  }
  search.addEventListener('input', function () { render(); });
  [platform, category, app].forEach(function (el) { el.addEventListener('change', function () { render(); }); });
  document.getElementById('clear-search').addEventListener('click', function () {
    search.value = ''; platform.value = 'all'; category.value = 'all'; app.value = 'all';
    document.querySelectorAll('[data-query]').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    render(); search.focus();
  });
  document.querySelectorAll('[data-query]').forEach(function (b) {
    b.addEventListener('click', function () {
      search.value = b.getAttribute('data-query');
      document.querySelectorAll('[data-query]').forEach(function (c) { var on = c === b; c.classList.toggle('active', on); c.setAttribute('aria-pressed', String(on)); });
      render();
      document.getElementById('results-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  more.addEventListener('click', function () { limit += SC.PAGE_SIZE; render(false); });
  SC.bindCopy(grid, data);
  render();
})();
