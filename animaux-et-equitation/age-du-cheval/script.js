'use strict';
/* Calculateur d'âge du cheval — dépend de common.js (window.SP), chargé avant ce fichier. */
(function () {
  var SP = window.SP;
  var CURRENT_YEAR = SP.CURRENT_YEAR;
  var MIN_YEAR = 1900;

  var birthYearInput = document.getElementById('birth-year');
  var horseLetterInput = document.getElementById('horse-letter');
  var yearResult = document.getElementById('year-result');
  var letterResult = document.getElementById('letter-result');
  if (!birthYearInput || !horseLetterInput || !yearResult || !letterResult) return;

  SP.LETTERS.forEach(function (letter) {
    var option = document.createElement('option');
    option.value = letter;
    option.textContent = letter + ' — ' + SP.yearsForLetter(letter).slice(0, 3).join(', ');
    horseLetterInput.appendChild(option);
  });
  birthYearInput.max = String(CURRENT_YEAR);

  // Onglets accessibles (clic + flèches gauche/droite + Début/Fin)
  var tabs = [document.getElementById('tab-year'), document.getElementById('tab-letter')];
  var panels = [document.getElementById('panel-year'), document.getElementById('panel-letter')];
  function selectTab(index, focus) {
    tabs.forEach(function (tab, i) {
      var active = i === index;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(i, false); });
    tab.addEventListener('keydown', function (event) {
      var target = null;
      if (event.key === 'ArrowRight') target = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') target = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;
      if (target !== null) { event.preventDefault(); selectTab(target, true); }
    });
  });
  selectTab(0, false);

  function showMessage(element, html) { element.innerHTML = html; element.hidden = false; }

  function calculateAge() {
    var raw = birthYearInput.value.trim();
    var year = Number(raw);
    if (!raw || !Number.isInteger(year) || year < MIN_YEAR || year > CURRENT_YEAR) {
      showMessage(yearResult, '<strong>Vérifiez l’année saisie.</strong><p>Entrez une année entre ' + MIN_YEAR + ' et ' + CURRENT_YEAR + '.</p>');
      return;
    }
    var age = CURRENT_YEAR - year;
    var label = SP.ageLabel(age);
    var letterLine = year >= SP.MIN_LETTER_YEAR
      ? '<p>Lettre de naissance théorique (cycle classique) : <strong>' + SP.letterForYear(year) + '</strong>.</p>'
      : '<p>Pour une année aussi ancienne, la lettre n’est pas indiquée : le cycle actuel ne peut pas être appliqué avec certitude.</p>';
    showMessage(yearResult,
      '<div class="eyebrow">RÉSULTAT</div><div class="big">' + label + '</div>' +
      '<p>En ' + CURRENT_YEAR + ', votre cheval a <strong>' + label + '</strong> selon le calcul par année civile.</p>' +
      letterLine +
      '<p class="hint">L’âge officiel peut dépendre des règles propres à la race ou au stud-book. <a href="guide.html#limites">Limites du calculateur</a></p>');
  }

  function calculateLetter() {
    var letter = horseLetterInput.value;
    if (!letter) {
      showMessage(letterResult, '<strong>Choisissez une lettre.</strong><p>Sélectionnez la première lettre du nom du cheval.</p>');
      return;
    }
    var items = SP.yearsForLetter(letter).map(function (year) {
      return '<li><strong>' + year + '</strong> — ' + SP.ageLabel(CURRENT_YEAR - year) + ' en ' + CURRENT_YEAR + '</li>';
    }).join('');
    showMessage(letterResult,
      '<div class="eyebrow">ANNÉES POSSIBLES</div><div class="big">Lettre ' + letter + '</div>' +
      '<p>Avec le cycle classique, cette lettre peut correspondre aux années suivantes :</p><ul>' + items + '</ul>' +
      '<p class="hint">La lettre seule ne permet pas de déterminer avec certitude l’année : vérifiez le livret du cheval. Certaines races ne suivent pas ce cycle. <a href="lettres.html">Voir les cas particuliers</a></p>');
  }

  document.getElementById('calculate-year').addEventListener('click', calculateAge);
  birthYearInput.addEventListener('keydown', function (event) { if (event.key === 'Enter') calculateAge(); });
  document.getElementById('calculate-letter').addEventListener('click', calculateLetter);
  horseLetterInput.addEventListener('keydown', function (event) { if (event.key === 'Enter') calculateLetter(); });

  // Repère rapide : 12 années récentes
  var letterGrid = document.getElementById('letter-grid');
  if (letterGrid) {
    for (var year = CURRENT_YEAR; year >= CURRENT_YEAR - 11; year--) {
      var card = document.createElement('div');
      card.className = 'letter-card';
      card.innerHTML = '<div class="letter">' + SP.letterForYear(year) + '</div><div class="year">' + year +
        '</div><div class="age">' + SP.ageLabel(CURRENT_YEAR - year) + ' en ' + CURRENT_YEAR + '</div>';
      letterGrid.appendChild(card);
    }
  }
})();
