(function(){var $=function(i){return document.getElementById(i)};if(!$('file'))return;var img=null,url=null;
function kb(n){return n>1048576?(n/1048576).toFixed(2)+' Mo':Math.round(n/1024)+' Ko'}
$('qual').addEventListener('input',function(){$('qv').textContent=$('qual').value});
$('file').addEventListener('change',function(){var f=$('file').files[0];$('dl').hidden=$('pv').hidden=true;if(!f)return;
 if(!/^image\//.test(f.type)){$('msg').textContent='Ce fichier n’est pas une image.';return}
 var i=new Image(),u=URL.createObjectURL(f);i.onload=function(){URL.revokeObjectURL(u);img={i:i,size:f.size,name:f.name.replace(/\.[^.]+$/,'')};$('go').disabled=false;$('msg').textContent=i.naturalWidth+'×'+i.naturalHeight+' px, '+kb(f.size)+'.'};
 i.onerror=function(){img=null;$('go').disabled=true;$('msg').textContent='Image illisible par ce navigateur.'};i.src=u});
$('go').addEventListener('click',function(){if(!img)return;var w=img.i.naturalWidth,h=img.i.naturalHeight,m=parseInt($('wid').value,10);
 if(m>0&&m<w){h=Math.round(h*m/w);w=m}var cv=$('cv'),x=cv.getContext('2d'),t=$('fmt').value;cv.width=w;cv.height=h;
 if(t==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,w,h)}else x.clearRect(0,0,w,h);x.drawImage(img.i,0,0,w,h);
 cv.toBlob(function(b){if(!b){$('msg').textContent='Conversion impossible (image trop grande ?).';return}
  if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(b);var ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[b.type]||'png',d=$('dl');
  d.href=url;d.download=img.name+'.'+ext;d.hidden=false;$('pv').hidden=false;
  $('msg').textContent=w+'×'+h+' px, '+kb(b.size)+' (original : '+kb(img.size)+').'+(b.type!==t?' Votre navigateur ne gère pas ce format : un PNG a été produit.':'')},t,$('qual').value/100)})})();