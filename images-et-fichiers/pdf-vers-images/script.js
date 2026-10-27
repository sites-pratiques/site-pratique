(function(){var $=function(i){return document.getElementById(i)};if(!$('file'))return;var data=null,name='document',lib=null;function kb(n){return n>1048576?(n/1048576).toFixed(2)+" Mo":Math.max(1,Math.round(n/1024))+" Ko"}
function L(){return lib||(lib=import('/vendor/pdfjs/pdf.min.mjs').then(function(m){m.GlobalWorkerOptions.workerSrc='/vendor/pdfjs/pdf.worker.min.mjs';return m}))}
$('file').addEventListener('change',function(){var f=$('file').files[0];$('res').innerHTML='';if(!f)return;if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){$('msg').textContent='Ce fichier n’est pas un PDF.';$('go').disabled=true;return}
 name=f.name.replace(/\.pdf$/i,'');f.arrayBuffer().then(function(b){data=b;$('go').disabled=false;$('msg').textContent=f.name+' ('+kb(f.size)+')'})});
function pages(s,n){var r=[];if(!s.trim()){for(var i=1;i<=n;i++)r.push(i)}else s.split(',').forEach(function(p){var m=/^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(p);if(!m)return;var a=+m[1],b=m[2]?+m[2]:a;for(var i=Math.max(1,a);i<=Math.min(n,b);i++)if(r.indexOf(i)<0)r.push(i)});return r.slice(0,50)}
$('go').addEventListener('click',async function(){if(!data)return;var res=$('res');res.innerHTML='';$('go').disabled=true;$('msg').textContent='Conversion en cours…';
 try{var m=await L(),doc=await m.getDocument({data:data.slice(0)}).promise,list=pages($('rg').value,doc.numPages);if(!list.length){$('msg').textContent='Aucune page valide (le document en compte '+doc.numPages+').';$('go').disabled=false;return}
  var grid=document.createElement('div');grid.className='pg-grid';res.appendChild(grid);var t=$('fmt').value,ext=t==='image/png'?'png':'jpg';
  for(var k=0;k<list.length;k++){$('msg').textContent='Page '+list[k]+' ('+(k+1)+'/'+list.length+')…';var pg=await doc.getPage(list[k]),sc=$('dpi').value/72,vp=pg.getViewport({scale:sc});
   while(vp.width*vp.height>25e6){sc*=.8;vp=pg.getViewport({scale:sc})}
   var cv=document.createElement('canvas');cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);var x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);
   await pg.render({canvasContext:x,canvas:cv,viewport:vp}).promise;
   var b=await new Promise(function(r){cv.toBlob(r,t,.92)}),u=URL.createObjectURL(b),d=document.createElement('div');d.className='pg';
   var im=new Image();im.src=u;im.alt='Page '+list[k];d.appendChild(im);var a=document.createElement('a');a.className='btn secondary';a.href=u;a.download=name+'-page-'+list[k]+'.'+ext;a.textContent='Page '+list[k]+' · '+kb(b.size);d.appendChild(a);grid.appendChild(d);pg.cleanup()}
  $('msg').textContent=list.length+' page(s) convertie(s). Cliquez sur un bouton pour télécharger l’image.'}
 catch(e){$('msg').textContent=e&&e.name==='PasswordException'?'Ce PDF est protégé par un mot de passe.':'Impossible de lire ce PDF ('+(e&&e.message||'erreur')+').'}
 $('go').disabled=false});})();