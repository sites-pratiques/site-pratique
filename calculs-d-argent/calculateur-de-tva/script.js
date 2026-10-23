(function(){var $=function(i){return document.getElementById(i)};if(!$('am'))return;
function N(i){var v=parseFloat($(i).value.replace(/\s/g,'').replace(',','.'));return isNaN(v)?null:v}
function e(n){return n.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}
function go(){var a=N('am'),t=N('rt'),o=$('out');if(a===null||t===null||t<=-100){o.textContent='—';return}
 var k=1+t/100,ht=$('md').value==='ht'?a:a/k,ttc=$('md').value==='ht'?a*k:a;
 o.innerHTML='<p>Prix HT : <strong>'+e(ht)+'</strong></p><p>TVA ('+t.toLocaleString('fr-FR')+' %) : <strong>'+e(ttc-ht)+'</strong></p><p>Prix TTC : <strong>'+e(ttc)+'</strong></p>'}
$('pre').addEventListener('change',function(){if($('pre').value)$('rt').value=$('pre').value.replace('.',',');go()});
['am','md','rt'].forEach(function(i){$(i).addEventListener('input',go)});go()})();