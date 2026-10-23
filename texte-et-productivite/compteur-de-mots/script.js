(function(){var $=function(i){return document.getElementById(i)},t=$('txt');if(!t)return;
function fmt(s){return s<60?Math.round(s)+' s':Math.floor(s/60)+' min '+Math.round(s%60)+' s'}
function up(){var v=t.value,w=(v.match(/\S+/g)||[]).length;$('s-w').textContent=w;$('s-c').textContent=Array.from(v).length;$('s-cs').textContent=Array.from(v.replace(/\s/g,'')).length;
$('s-s').textContent=(v.match(/[^.!?…\s][^.!?…]*[.!?…]+(?=\s|$)|[^.!?…\s][^.!?…]*$/g)||[]).length;$('s-p').textContent=v.split(/\n\s*\n/).filter(function(p){return p.trim()}).length;$('s-r').textContent=fmt(w/200*60)}
t.addEventListener('input',up);up()})();