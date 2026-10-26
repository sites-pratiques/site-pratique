(function(){var $=function(i){return document.getElementById(i)};if(!$('cat'))return;
var U={'Longueur':{'mm':.001,'cm':.01,'m':1,'km':1000,'pouce (in)':.0254,'pied (ft)':.3048,'yard (yd)':.9144,'mile (mi)':1609.344},
'Masse':{'mg':1e-6,'g':.001,'kg':1,'tonne (t)':1000,'once (oz)':.028349523125,'livre (lb)':.45359237},
'Volume':{'mL':.001,'cL':.01,'L':1,'m³':1000,'once liquide US':.0295735295625,'pinte US':.473176473,'gallon US':3.785411784,'gallon UK':4.54609},
'Surface':{'cm²':1e-4,'m²':1,'hectare (ha)':1e4,'km²':1e6,'pouce carré':.00064516,'pied carré':.09290304,'acre':4046.8564224},
'Vitesse':{'m/s':1,'km/h':1/3.6,'mph':.44704,'nœud':1852/3600},'Température':{'°C':1,'°F':1,'K':1}};
var c=$('cat'),a=$('from'),b=$('to');Object.keys(U).forEach(function(k){c.add(new Option(k,k))});
function fill(){var us=Object.keys(U[c.value]);[a,b].forEach(function(s){s.innerHTML='';us.forEach(function(u){s.add(new Option(u,u))})});b.selectedIndex=us.length>1?1:0;go()}
function tc(v,u){return u==='°C'?v:u==='°F'?(v-32)*5/9:v-273.15}function fc(v,u){return u==='°C'?v:u==='°F'?v*9/5+32:v+273.15}
function go(){var v=parseFloat($('val').value.replace(/\s/g,'').replace(',','.')),o=$('res');if(isNaN(v)){o.textContent='—';return}
var r=c.value==='Température'?fc(tc(v,a.value),b.value):v*U[c.value][a.value]/U[c.value][b.value];
o.innerHTML='<strong>'+v.toLocaleString('fr-FR',{maximumSignificantDigits:8})+' '+a.value+' = '+r.toLocaleString('fr-FR',{maximumSignificantDigits:8})+' '+b.value+'</strong>'}
c.addEventListener('change',fill);[a,b,$('val')].forEach(function(e){e.addEventListener('input',go)});
$('swap').addEventListener('click',function(){var t=a.value;a.value=b.value;b.value=t;go()});fill()})();