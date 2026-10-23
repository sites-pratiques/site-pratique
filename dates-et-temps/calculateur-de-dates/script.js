(function(){var $=function(i){return document.getElementById(i)};if(!$('d1'))return;
function P(v){var p=v.split('-');return Date.UTC(+p[0],p[1]-1,+p[2])}
function F(ms){return new Date(ms).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}
function s(n,w){return n+' '+w+(Math.abs(n)>1&&w.slice(-1)!=='s'?'s':'')}
function dur(){var a=$('d1').value,b=$('d2').value,o=$('dur');if(!a||!b){o.textContent='Choisissez deux dates.';return}
var x=P(a),y=P(b),neg=y<x;if(neg){var t=x;x=y;y=t}
var days=Math.round((y-x)/864e5)+($('inc').checked?1:0),A=new Date(x),B=new Date(y),tm=(B.getUTCFullYear()-A.getUTCFullYear())*12+B.getUTCMonth()-A.getUTCMonth();
function am(n){var mo=A.getUTCMonth()+n,yr=A.getUTCFullYear()+Math.floor(mo/12),m=((mo%12)+12)%12;return Date.UTC(yr,m,Math.min(A.getUTCDate(),new Date(Date.UTC(yr,m+1,0)).getUTCDate()))}
while(tm>0&&am(tm)>y)tm--;var dd=Math.round((y-am(tm))/864e5),yy=Math.floor(tm/12),mm=tm%12;
var bd=0;for(var i=x;i<=y-($('inc').checked?0:864e5);i+=864e5){var wd=new Date(i).getUTCDay();if(wd>0&&wd<6)bd++}
o.innerHTML='<p><strong>'+s(days,'jour')+'</strong>'+(neg?' (la date de fin précède la date de début)':'')+'</p><p>'+s(Math.floor(days/7),'semaine')+' et '+s(days%7,'jour')+'</p><p>'+s(yy,'an')+', '+mm+' mois, '+s(dd,'jour')+'</p><p>'+s(bd,'jour')+' ouvré'+(bd>1?'s':'')+' (lundi–vendredi, hors jours fériés)</p>'}
function add(){var a=$('a0').value,n=parseInt($('an').value,10),o=$('add');if(!a||isNaN(n)){o.textContent='Choisissez une date et un nombre de jours.';return}o.innerHTML='<strong>'+F(P(a)+n*864e5)+'</strong>'}
['d1','d2','inc'].forEach(function(i){$(i).addEventListener('input',dur)});['a0','an'].forEach(function(i){$(i).addEventListener('input',add)})})();