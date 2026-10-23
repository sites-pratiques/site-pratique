(function(){var $=function(i){return document.getElementById(i)};if(!$('bd'))return;
function P(v){var p=v.split('-');return Date.UTC(+p[0],p[1]-1,+p[2])}
function D(ms){return new Date(ms).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}
function go(){var o=$('out'),b=$('bd').value;if(!b){o.textContent='Saisissez une date de naissance.';return}
 var n=new Date(),x=P(b),y=$('rd').value?P($('rd').value):Date.UTC(n.getFullYear(),n.getMonth(),n.getDate());
 if(y<x){o.textContent='La date de naissance doit précéder la date de référence.';return}
 var A=new Date(x),B=new Date(y);function am(k){var mo=A.getUTCMonth()+k,yr=A.getUTCFullYear()+Math.floor(mo/12),m=((mo%12)+12)%12;return Date.UTC(yr,m,Math.min(A.getUTCDate(),new Date(Date.UTC(yr,m+1,0)).getUTCDate()))}
 var tm=(B.getUTCFullYear()-A.getUTCFullYear())*12+B.getUTCMonth()-A.getUTCMonth();while(tm>0&&am(tm)>y)tm--;
 var dd=Math.round((y-am(tm))/864e5),days=Math.round((y-x)/864e5),yr=Math.floor(tm/12),next=am((yr+1)*12);
 o.innerHTML='<p><strong>'+yr+' an'+(yr>1?'s':'')+', '+tm%12+' mois, '+dd+' jour'+(dd>1?'s':'')+'</strong></p><p>'+days.toLocaleString('fr-FR')+' jours vécus ('+Math.floor(days/7).toLocaleString('fr-FR')+' semaines)</p><p>Né(e) un '+D(x)+'</p><p>Prochain anniversaire : '+D(next)+' (dans '+Math.round((next-y)/864e5)+' jours)</p>'}
['bd','rd'].forEach(function(i){$(i).addEventListener('input',go)})})();