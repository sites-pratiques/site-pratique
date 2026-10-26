/* Pages de catégories : liste filtrée selon <body data-kind="…">. Dépend de shortcuts-data.js et shortcuts.js. */
(function () {
  'use strict';
  var SC = window.SC, data = window.SHORTCUTS_DATA || [];
  var kind = document.body.getAttribute('data-kind');
  var grid = document.getElementById('page-grid');
  if (!SC || !grid || !SC.PAGES[kind]) return;
  var search = document.getElementById('page-search'), platform = document.getElementById('page-platform'),
      count = document.getElementById('page-count'), empty = document.getElementById('page-empty');

  function render() {
    var q = SC.norm(search.value.trim());
    var list = data.filter(function (x) {
      return SC.PAGES[kind](x) && (!platform || platform.value === 'all' || x.platform === platform.value) && SC.matchesQuery(x, q);
    });
    count.textContent = SC.countLabel(list.length);
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map(SC.card).join('');
  }
  search.addEventListener('input', render);
  if (platform) platform.addEventListener('change', render);
  document.getElementById('page-clear').addEventListener('click', function () {
    search.value = ''; if (platform) platform.value = 'all'; render(); search.focus();
  });
  SC.bindCopy(grid, data);
  render();
})();
