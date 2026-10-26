(function(){var $=function(i){return document.getElementById(i)};if(!$('hx'))return;
function h2r(h){var m=/^#?([0-9a-f]{6})$/i.exec(h.trim());if(!m)return null;var v=parseInt(m[1],16);return[v>>16,v>>8&255,v&255]}
function r2h(r,g,b){return'#'+[r,g,b].map(function(x){return('0'+x.toString(16)).slice(-2)}).join('')}
function r2l(r,g,b){r/=255;g/=255;b/=255;var M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2,h=0,s=0,d=M-m;if(d){s=d/(1-Math.abs(2*l-1));h=M===r?((g-b)/d+6)%6:M===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[Math.round(h),Math.round(s*100),Math.round(l*100)]}
function l2r(h,s,l){s/=100;l/=100;var c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs(h/60%2-1)),m=l-c/2,v=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return v.map(function(t){return Math.round((t+m)*255)})}
function lum(r,g,b){var a=[r,g,b].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]}
function show(r,g,b,from){var hx=r2h(r,g,b),L=r2l(r,g,b);if(from!=='hx')$('hx').value=hx;if(from!=='rgb'){$('rr').value=r;$('gg').value=g;$('bb').value=b}if(from!=='hsl'){$('hh').value=L[0];$('ss').value=L[1];$('ll').value=L[2]}$('pk').value=hx;$('sw').style.background=hx;
var l=lum(r,g,b),cw=1.05/(l+.05),cb=(l+.05)/.05;$('out').innerHTML='<p><strong>'+hx.toUpperCase()+'</strong> · rgb('+r+', '+g+', '+b+') · hsl('+L[0]+', '+L[1]+'%, '+L[2]+'%)</p><p>Contraste avec le blanc : '+cw.toFixed(2)+':1 · avec le noir : '+cb.toFixed(2)+':1</p>'}
function C(v,m){v=parseInt(v,10);return isNaN(v)?0:Math.max(0,Math.min(m,v))}
$('pk').addEventListener('input',function(){var c=h2r($('pk').value);show(c[0],c[1],c[2])});
$('hx').addEventListener('input',function(){var c=h2r($('hx').value);if(c)show(c[0],c[1],c[2],'hx')});
['rr','gg','bb'].forEach(function(i){$(i).addEventListener('input',function(){show(C($('rr').value,255),C($('gg').value,255),C($('bb').value,255),'rgb')})});
['hh','ss','ll'].forEach(function(i){$(i).addEventListener('input',function(){var c=l2r(C($('hh').value,360),C($('ss').value,100),C($('ll').value,100));show(c[0],c[1],c[2],'hsl')})});
show(87,155,112)})();