(function(){var $=function(i){return document.getElementById(i)};if(!$('in'))return;
var F={up:function(s){return s.toLocaleUpperCase('en')},low:function(s){return s.toLocaleLowerCase('en')},
title:function(s){return s.toLocaleLowerCase('en').replace(/(^|[^\p{L}\p{N}])(\p{L})/gu,function(m,a,b){return a+b.toLocaleUpperCase('en')})},
sent:function(s){return s.toLocaleLowerCase('en').replace(/(^|[.!?…]\s+|\n\s*)(\p{L})/gu,function(m,a,b){return a+b.toLocaleUpperCase('en')})}};
Array.prototype.forEach.call(document.querySelectorAll('[data-m]'),function(b){b.addEventListener('click',function(){$('out').value=F[b.getAttribute('data-m')]($('in').value)})});
$('cop').addEventListener('click',function(){var o=$('out');if(!o.value)return;var b=$('cop');o.select();function ok(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy result'},1500)}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(o.value).then(ok);else{try{document.execCommand('copy');ok()}catch(e){}}})})();