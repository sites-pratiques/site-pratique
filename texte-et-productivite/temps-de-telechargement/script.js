(function(){var $=function(i){return document.getElementById(i)};if(!$('sz'))return;function N(i){var v=parseFloat($(i).value.replace(/\s/g,'').replace(',','.'));return isNaN(v)?null:v}
function E(n){return n.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}
function go(){var s=N('sz'),p=N('sp'),o=$('out');if(s===null||p===null||p<=0){o.textContent='—';return}
var t=s*$('su').value*8/(p*$('pu').value),h=Math.floor(t/3600),m=Math.floor(t%3600/60),sec=Math.round(t%60);
o.innerHTML='<strong>'+(t<1?'moins d’une seconde':(h?h+' h ':'')+(m||h?m+' min ':'')+sec+' s')+'</strong>'}Array.prototype.forEach.call(document.querySelectorAll("main input,main select,main textarea"),function(e){e.addEventListener("input",go);e.addEventListener("change",go)});go()})();