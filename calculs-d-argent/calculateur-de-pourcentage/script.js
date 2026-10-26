(function(){var $=function(i){return document.getElementById(i)};if(!$('p1a'))return;
function N(i){var v=parseFloat($(i).value.replace(/\s/g,'').replace(',','.'));return isNaN(v)?null:v}
function f(n){return n.toLocaleString('fr-FR',{maximumFractionDigits:4})}
function run(k,fn){var a=N('p'+k+'a'),b=N('p'+k+'b'),o=$('r'+k);if(a===null||b===null){o.textContent='—';return}o.innerHTML=fn(a,b)}
function all(){run(1,function(a,b){return'<strong>'+f(a*b/100)+'</strong>'});
run(2,function(a,b){return b===0?'Y ne peut pas être nul.':'<strong>'+f(a/b*100)+' %</strong>'});
run(3,function(a,b){return a===0?'X ne peut pas être nul.':'<strong>'+(b>=a?'+':'')+f((b-a)/a*100)+' %</strong> ('+(b>=a?'hausse':'baisse')+')'});
run(4,function(a,b){return'<p>Après augmentation : <strong>'+f(a*(1+b/100))+'</strong></p><p>Après réduction : <strong>'+f(a*(1-b/100))+'</strong></p>'});
run(5,function(a,b){return b===-100?'Une baisse de 100 % ne peut pas être inversée.':'<strong>'+f(a/(1+b/100))+'</strong>'})}
Array.prototype.forEach.call(document.querySelectorAll('.qr-layout input'),function(e){e.addEventListener('input',all)});all()})();