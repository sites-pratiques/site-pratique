(function(){var $=function(i){return document.getElementById(i)};if(!$('file'))return;var data=null,lib=null;
function L(){return lib||(lib=import('/vendor/pdfjs/pdf.min.mjs').then(function(m){m.GlobalWorkerOptions.workerSrc='/vendor/pdfjs/pdf.worker.min.mjs';return m}))}
$('file').addEventListener('change',function(){var f=$('file').files[0];if(!f)return;f.arrayBuffer().then(function(b){data=b;$('go').disabled=false;$('msg').textContent=f.name})});
$('go').addEventListener('click',async function(){if(!data)return;$('go').disabled=true;$('msg').textContent='Extraction…';$('out').value='';$('dl').hidden=true;
 try{var m=await L(),d=await m.getDocument({data:data.slice(0)}).promise,all='';
  for(var i=1;i<=d.numPages;i++){var tc=await(await d.getPage(i)).getTextContent(),s='';tc.items.forEach(function(it){s+=it.str+(it.hasEOL?'\n':' ')});all+=($('mk').checked?'--- Page '+i+' ---\n':'')+s.replace(/[ \t]+\n/g,'\n').trim()+'\n\n'}
  all=all.trim();$('out').value=all;$('cop').disabled=!all;
  if(!all)$('msg').textContent='Aucun texte trouvé : ce PDF est probablement un scan (image).';else{$('msg').textContent=d.numPages+' page(s), '+all.length.toLocaleString('fr-FR')+' caractères.';$('dl').href=URL.createObjectURL(new Blob([all],{type:'text/plain;charset=utf-8'}));$('dl').hidden=false}}
 catch(e){$('msg').textContent=e&&e.name==='PasswordException'?'Ce PDF est protégé par un mot de passe.':'Impossible de lire ce PDF.'}
 $('go').disabled=false});
$('cop').addEventListener('click',function(){var v=$('out').value,b=$('cop');function ok(){b.textContent='Copié !';setTimeout(function(){b.textContent='Copier'},1500)}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(ok);else{$('out').select();try{document.execCommand('copy');ok()}catch(e){}}})})();