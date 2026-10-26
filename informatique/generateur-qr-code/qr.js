(function(){'use strict';
var $=function(i){return document.getElementById(i)},C=window.QRCodeCore,LV={L:1,M:0,Q:3,H:2},cur=null;
if(!C||!$('qr-canvas'))return;
function esc(s){return String(s).replace(/([\\;,:"])/g,'\\$1')}
function payload(){var t=$('type').value,v=function(i){return $(i).value.trim()};
 if(t==='text')return $('f-text').value;
 if(t==='wifi'){if(!v('w-ssid'))return'';var sec=$('w-sec').value;return 'WIFI:T:'+(sec==='nopass'?'nopass':sec)+';S:'+esc(v('w-ssid'))+';'+(sec==='nopass'?'':'P:'+esc($('w-pass').value)+';')+($('w-hidden').checked?'H:true;':'')+';'}
 if(t==='mail'){if(!v('m-to'))return'';var q=[];if(v('m-sub'))q.push('subject='+encodeURIComponent(v('m-sub')));if($('m-body').value)q.push('body='+encodeURIComponent($('m-body').value));return 'mailto:'+v('m-to')+(q.length?'?'+q.join('&'):'')}
 if(t==='tel')return v('t-num')?'tel:'+v('t-num').replace(/[^\d+]/g,''):'';
 if(t==='sms')return v('s-num')?'SMSTO:'+v('s-num').replace(/[^\d+]/g,'')+':'+$('s-msg').value:'';
 return''}
function build(s){var b=unescape(encodeURIComponent(s));for(var n=1;n<=40;n++){try{var q=new C(n,LV[$('ecc').value]);q.addData(b);q.make();return q}catch(e){}}return null}
function lum(h){var c=[1,3,5].map(function(i){var x=parseInt(h.substr(i,2),16)/255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function msg(t,c){var m=$('qr-msg');m.textContent=t;m.className='qr-msg '+(c||'')}
function draw(){var s=payload(),cv=$('qr-canvas'),x=cv.getContext('2d');cur=null;$('dl-png').disabled=$('dl-svg').disabled=true;
 if(!s){cv.width=cv.height=1;msg('Renseignez le contenu pour générer le QR code.');return}
 var q=build(s);if(!q){msg('Contenu trop long pour un QR code avec ce niveau de correction. Raccourcissez-le ou choisissez L.','err');return}
 var n=q.getModuleCount(),mg=Math.max(0,Math.min(10,+$('margin').value||0)),px=Math.max(1,Math.floor(+$('size').value/(n+2*mg))),w=px*(n+2*mg),fg=$('fg').value,bg=$('bg').value;
 cv.width=cv.height=w;x.fillStyle=bg;x.fillRect(0,0,w,w);x.fillStyle=fg;
 for(var r=0;r<n;r++)for(var c=0;c<n;c++)if(q.isDark(r,c))x.fillRect((c+mg)*px,(r+mg)*px,px,px);
 cur={q:q,n:n,mg:mg,fg:fg,bg:bg,w:w};$('dl-png').disabled=$('dl-svg').disabled=false;
 var l1=lum(fg),l2=lum(bg),ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
 if(l1>l2)msg('Attention : modules plus clairs que le fond. De nombreux lecteurs ne les reconnaissent pas.','warn');
 else if(ratio<4)msg('Contraste faible : le QR code risque d’être difficile à scanner.','warn');
 else if(mg<4)msg('Marge inférieure à 4 modules : certains lecteurs peuvent échouer.','warn');
 else msg('QR code généré (version '+q.typeNumber+', '+n+'×'+n+' modules). Testez-le avec un téléphone avant de l’imprimer.')}
function dl(url,name){var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a)}
$('dl-png').addEventListener('click',function(){if(cur)dl($('qr-canvas').toDataURL('image/png'),'qr-code.png')});
$('dl-svg').addEventListener('click',function(){if(!cur)return;var d='',t=cur.n+2*cur.mg;
 for(var r=0;r<cur.n;r++)for(var c=0;c<cur.n;c++)if(cur.q.isDark(r,c))d+='M'+(c+cur.mg)+' '+(r+cur.mg)+'h1v1h-1z';
 var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+t+' '+t+'" shape-rendering="crispEdges"><rect width="'+t+'" height="'+t+'" fill="'+cur.bg+'"/><path d="'+d+'" fill="'+cur.fg+'"/></svg>';
 var u=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));dl(u,'qr-code.svg');setTimeout(function(){URL.revokeObjectURL(u)},1000)});
function panels(){var t=$('type').value;['text','wifi','mail','tel','sms'].forEach(function(k){$('p-'+k).hidden=k!==t});$('w-pw').hidden=$('w-sec').value==='nopass'}
$('type').addEventListener('change',function(){panels();draw()});$('w-sec').addEventListener('change',function(){panels();draw()});
Array.prototype.forEach.call(document.querySelectorAll('.qr-layout input,.qr-layout select,.qr-layout textarea'),function(e){e.addEventListener('input',draw);e.addEventListener('change',draw)});
$('qr-reset').addEventListener('click',function(){Array.prototype.forEach.call(document.querySelectorAll('.qr-layout input[type=text],.qr-layout input[type=tel],.qr-layout input[type=email],.qr-layout input[type=password],.qr-layout textarea'),function(e){e.value=''});$('w-hidden').checked=false;draw()});
panels();draw()})();
