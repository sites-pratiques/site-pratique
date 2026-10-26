(function(){var $=function(i){return document.getElementById(i)};if(!$('pw'))return;
var S={l:'abcdefghijklmnopqrstuvwxyz',u:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',d:'0123456789',s:'!@#$%^&*()-_=+[]{};:,.?'};
function rnd(n){var m=Math.floor(4294967296/n)*n,a=new Uint32Array(1);do{crypto.getRandomValues(a)}while(a[0]>=m);return a[0]%n}
function gen(){var set='',sel=[];['l','u','d','s'].forEach(function(k){if($('c-'+k).checked){var s=S[k];if($('c-a').checked)s=s.replace(/[O0lI1]/g,'');set+=s;sel.push(s)}});
 var L=+$('len').value;$('lv').textContent=L;if(!set){$('pw').value='';$('pst').textContent='Cochez au moins un type de caractères.';return}
 var p=[];for(var i=0;i<L;i++)p.push(set[rnd(set.length)]);
 for(var j=0;j<sel.length&&j<L;j++)p[j]=sel[j][rnd(sel[j].length)];
 for(var k=p.length-1;k>0;k--){var r=rnd(k+1),t=p[k];p[k]=p[r];p[r]=t}
 $('pw').value=p.join('');var bits=Math.round(L*Math.log(set.length)/Math.LN2);
 $('pst').innerHTML='<strong>Entropie estimée : '+bits+' bits</strong> — '+(bits<50?'faible':bits<70?'moyenne':bits<100?'bonne':'très bonne')}
['len','c-l','c-u','c-d','c-s','c-a'].forEach(function(i){$(i).addEventListener('input',gen)});$('gen').addEventListener('click',gen);
$('cop').addEventListener('click',function(){var v=$('pw').value;if(!v)return;var b=$('cop');function ok(){b.textContent='Copié !';setTimeout(function(){b.textContent='Copier'},1500)}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(ok,function(){$('pw').select()});else{$('pw').select();try{document.execCommand('copy');ok()}catch(e){}}});
gen()})();