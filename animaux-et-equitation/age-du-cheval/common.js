/*
 * Code commun à toutes les pages : année courante, cycle des lettres de naissance,
 * éléments dynamiques (année du pied de page, repères de lettres, tableau des lettres).
 * Les années affichées dépendent de l'année du navigateur : rien n'est à modifier au 1er janvier.
 */
(function () {
  'use strict';

  // Cycle indiqué par l'IFCE : 22 lettres (W, X, Y, Z exclues), une lettre par année, en ordre alphabétique.
  // Repère : l'IFCE indique que la lettre de 2026 est Q ; l'année 2010 correspond donc à A dans le cycle.
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUV'.split('');
  var REFERENCE_YEAR = 2010;
  var CURRENT_YEAR = new Date().getFullYear();
  // Le cycle n'est affiché que sur les 3 derniers cycles : au-delà, la règle n'est pas garantie.
  var MIN_LETTER_YEAR = CURRENT_YEAR - 65;

  function letterForYear(year) {
    var n = LETTERS.length;
    return LETTERS[(((year - REFERENCE_YEAR) % n) + n) % n];
  }
  function yearsForLetter(letter, minYear, maxYear) {
    var out = [];
    for (var y = (maxYear === undefined ? CURRENT_YEAR : maxYear); y >= (minYear === undefined ? MIN_LETTER_YEAR : minYear); y--) {
      if (letterForYear(y) === letter) out.push(y);
    }
    return out;
  }
  function ageLabel(age) { return age + (age > 1 ? ' ans' : ' an'); }

  window.SP = {
    LETTERS: LETTERS, CURRENT_YEAR: CURRENT_YEAR, MIN_LETTER_YEAR: MIN_LETTER_YEAR,
    letterForYear: letterForYear, yearsForLetter: yearsForLetter, ageLabel: ageLabel
  };

  function init() {
    var i, els;
    els = document.querySelectorAll('.js-current-year');
    for (i = 0; i < els.length; i++) els[i].textContent = String(CURRENT_YEAR);

    els = document.querySelectorAll('[data-year-offset]');
    for (i = 0; i < els.length; i++) els[i].textContent = String(CURRENT_YEAR - Number(els[i].getAttribute('data-year-offset')));
    els = document.querySelectorAll('[data-year-letter]');
    for (i = 0; i < els.length; i++) els[i].textContent = letterForYear(CURRENT_YEAR - Number(els[i].getAttribute('data-year-letter')));

    // Tableau complet des lettres (page lettres.html)
    var tbody = document.getElementById('letter-table-body');
    if (tbody) {
      LETTERS.forEach(function (letter) {
        var last = yearsForLetter(letter, CURRENT_YEAR - 21, CURRENT_YEAR)[0];
        var next = last + LETTERS.length;
        var tr = document.createElement('tr');
        if (last === CURRENT_YEAR) tr.className = 'is-current';
        tr.innerHTML = '<th scope="row">' + letter + '</th><td>' + last + '</td><td>' + ageLabel(CURRENT_YEAR - last) + '</td><td>' + next + '</td>';
        tbody.appendChild(tr);
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
