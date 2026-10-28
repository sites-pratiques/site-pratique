(function(){var $=function(i){return document.getElementById(i)};if(!$('ta'))return;
function esc(s){return s.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function tok(s,m){return m==='l'?s.split('\n'):s.split(/(\s+)/).filter(function(t){return t!==''})}
function go(){var a=$('ta').value,b=$('tb').value,o=$('out'),m=$('md').value;if(!a&&!b){o.innerHTML='';$('msg').textContent='Saisissez deux textes.';return}
 var A=tok(a,m),B=tok(b,m),n=A.length,k=B.length;if(n>2500||k>2500){$('msg').textContent='Textes trop longs pour la comparaison.';o.innerHTML='';return}
 var W=k+1,t=new Int32Array((n+1)*W),i,j;for(i=1;i<=n;i++)for(j=1;j<=k;j++)t[i*W+j]=A[i-1]===B[j-1]?t[(i-1)*W+j-1]+1:Math.max(t[(i-1)*W+j],t[i*W+j-1]);
 var ops=[];i=n;j=k;while(i>0||j>0){if(i>0&&j>0&&A[i-1]===B[j-1]){ops.push(['e',A[i-1]]);i--;j--}else if(j>0&&(i===0||t[i*W+j-1]>=t[(i-1)*W+j])){ops.push(['i',B[j-1]]);j--}else{ops.push(['d',A[i-1]]);i--}}
 ops.reverse();var h='',add=0,del=0,sep=m==='l'?'\n':'';ops.forEach(function(p){var s=esc(p[1])+sep;if(p[0]==='e')h+=s;else if(p[0]==='i'){if(p[1].trim()||m==='l')add++;h+='<ins class="d">'+s+'</ins>'}else{if(p[1].trim()||m==='l')del++;h+='<del class="d">'+s+'</del>'}});
 o.innerHTML=h;$('msg').textContent=add||del?add+' ajout(s), '+del+' suppression(s).':'Les deux textes sont identiques.'}Array.prototype.forEach.call(document.querySelectorAll("main input,main select,main textarea"),function(e){e.addEventListener("input",go);e.addEventListener("change",go)});go()})();