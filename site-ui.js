/* Sites Pratiques — thème clair/sombre et sélecteur de langue (liens hreflang de la page). */
(function(){'use strict';
var LB={fr:['Langue','Passer en mode sombre','Passer en mode clair'],en:['Language','Switch to dark mode','Switch to light mode'],de:['Sprache','Zum dunklen Modus wechseln','Zum hellen Modus wechseln'],es:['Idioma','Cambiar a modo oscuro','Cambiar a modo claro'],it:['Lingua','Passa alla modalità scura','Passa alla modalità chiara']},
NM={fr:'Français',en:'English',de:'Deutsch',es:'Español',it:'Italiano'},L=(document.documentElement.lang||'fr').slice(0,2);if(!LB[L])L='fr';
function g(k){try{return localStorage.getItem(k)}catch(e){return null}}function s(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function sys(){return window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
function theme(){var t=g('sp-theme');return t==='dark'||t==='light'?t:sys()}
function setTheme(t){document.documentElement.setAttribute('data-theme',t)}
function btn(){var b=document.getElementById('theme-btn');if(!b)return;var d=document.documentElement.getAttribute('data-theme')==='dark';b.textContent=d?'☀':'☾';b.setAttribute('aria-label',LB[L][d?2:1])}
function ctl(){var h=document.querySelector('.site-header');if(!h||h.querySelector('.site-tools'))return;var d=document.createElement('div');d.className='site-tools';
 var al={};Array.prototype.forEach.call(document.querySelectorAll('link[rel="alternate"][hreflang]'),function(l){var c=l.getAttribute('hreflang');if(NM[c])al[c]=l.getAttribute('href')});
 var ks=Object.keys(NM).filter(function(k){return al[k]});
 if(ks.length>1){var se=document.createElement('select');se.id='lang-sel';se.setAttribute('aria-label',LB[L][0]);ks.forEach(function(k){se.add(new Option(NM[k],k))});se.value=L;se.addEventListener('change',function(){var u=al[se.value];if(u){try{u=new URL(u,location.href).pathname}catch(e){}location.href=u}});d.appendChild(se)}
 var b=document.createElement('button');b.type='button';b.id='theme-btn';d.appendChild(b);h.appendChild(d);
 b.addEventListener('click',function(){var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';s('sp-theme',t);setTheme(t);btn()})}
function init(){setTheme(theme());ctl();btn();if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(!g('sp-theme')){setTheme(sys());btn()}})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
