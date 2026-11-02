(function(){var $=function(i){return document.getElementById(i)};if(!$('in'))return;
var F={up:function(s){return s.toLocaleUpperCase('it')},low:function(s){return s.toLocaleLowerCase('it')},
title:function(s){return s.toLocaleLowerCase('it').replace(/(^|[^\p{L}\p{N}])(\p{L})/gu,function(m,a,b){return a+b.toLocaleUpperCase('it')})},
sent:function(s){return s.toLocaleLowerCase('it').replace(/(^|[.!?…]\s+|\n\s*)(\p{L})/gu,function(m,a,b){return a+b.toLocaleUpperCase('it')})}};
Array.prototype.forEach.call(document.querySelectorAll('[data-m]'),function(b){b.addEventListener('click',function(){$('out').value=F[b.getAttribute('data-m')]($('in').value)})});
$('cop').addEventListener('click',function(){var o=$('out');if(!o.value)return;var b=$('cop');o.select();function ok(){b.textContent='Copiato!';setTimeout(function(){b.textContent='Copia il risultato'},1500)}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(o.value).then(ok);else{try{document.execCommand('copy');ok()}catch(e){}}})})();