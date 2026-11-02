#!/usr/bin/env python3
"""Génère /en/, /de/, /es/, /it/ à partir des pages françaises et des fichiers i18n/*.json.
Une page n'est publiée dans une langue que si 100 % de ses textes sont traduits (jamais de page mélangée).
Usage : python3 tools/i18n-build.py [--report]"""
import os, re, json, sys, html, shutil
O=os.environ.get('SITE_ROOT') or os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')); NEW='https://sites-pratiques.vercel.app'
LANGS={'en':'en-GB','de':'de-DE','es':'es-ES','it':'it-IT'}; OGL={'en':'en_GB','de':'de_DE','es':'es_ES','it':'it_IT'}
ASSET=re.compile(r'\.(css|js|mjs|jpg|jpeg|png|svg|ico|txt|xml|json|webp|pdf)$',re.I)
rd=lambda p: open(p,encoding='utf8').read()
def wr(p,s): os.makedirs(os.path.dirname(p),exist_ok=True); open(p,'w',encoding='utf8').write(s)
NEUTRAL=set(json.load(open(f'{O}/i18n/neutral.json',encoding='utf8')))
norm=lambda s:' '.join(html.unescape(s).split())
def pages():
    out=[]
    for r,d,fs in os.walk(O):
        d[:]=[x for x in d if x not in('vendor','tools','docs','i18n') and not (r==O and x in LANGS)]
        for f in fs:
            if f.endswith('.html') and f!='404.html': out.append(os.path.relpath(os.path.join(r,f),O))
    return sorted(out)
def url_of(p): return '/'+p[:-10] if p.endswith('index.html') else '/'+p
def page_of(u):
    u=u.split('#')[0].split('?')[0]
    if u.endswith('/'): return u.lstrip('/')+'index.html'
    return u.lstrip('/')
MASK=re.compile(r'(<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>|<textarea\b[^>]*>.*?</textarea>)',re.S|re.I)
def need(s): return bool(re.search(r'[A-Za-zÀ-ÿ]{2}',s)) and s not in NEUTRAL and not re.fullmatch(r'[\d\W_]*',s)
def strings(h):
    """Chaînes à traduire d'une page : (texte, kind)."""
    out=[]
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>',h,re.S):
        for v in re.findall(r'"(?:name|description)":\s*"((?:[^"\\]|\\.)*)"',m.group(1)): out.append(json.loads('"'+v+'"'))
    body=MASK.sub(lambda m:'\0'*len(m.group(0)) if False else '<!--M-->',h)
    for t in re.findall(r'>([^<>]+)<',body):
        n=norm(t)
        if need(n): out.append(n)
    for a,v in re.findall(r'\b(aria-label|placeholder|alt|title|content)="([^"]*)"',body):
        n=norm(v)
        if a=='content' and (len(n)<26 or re.match(r'(width=|#|https?:|index|ca-pub|summary|website|fr_FR|noindex|index,)',n)): continue
        if need(n): out.append(n)
    t=re.search(r'<title>([^<]*)</title>',body)
    if t: out.append(norm(t.group(1)))
    return out
JSLIT=re.compile(r"""'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)\"""")
def js_needs(s):
    if re.search(r'[àâäçéèêëîïôöùûüÿœÀÉ]',s) and re.search(r'[A-Za-zÀ-ÿ]{3}',s): return True
    if re.search(r'^[A-Z][a-zé]{3,}$',s) or re.search(r'[A-Za-zÀ-ÿ]{3,}\s+[A-Za-zÀ-ÿ]{2,}',s):
        return not re.search(r'[{};=]|function|\.js|https?:|image/|application/|px |^#|^\.|rgb|inputmode|querySelector|data-|class=|href=|aria-|sans-serif',s) and not re.fullmatch(r'[a-z0-9 :;.,#%()-]+',s) or bool(re.search(r'<(strong|p|br)',s))
    return False
def js_strings(js):
    out=[]
    for m in JSLIT.finditer(js):
        s=m.group(1) if m.group(1) is not None else m.group(2)
        if s and js_needs(s): out.append(s)
    return out
def load(l):
    p=f'{O}/i18n/{l}.json'; return json.load(open(p,encoding='utf8')) if os.path.exists(p) else {'t':{},'js':{}}
def tool_js(p):
    """Script d'outil lié à la page (/cat/tool/script.js) si présent."""
    d=os.path.dirname(p); f=f'{O}/{d}/script.js'
    return f if d.count('/')==1 and os.path.exists(f) else None
def render(h,p,l,T,G,gen):
    S={}
    def tr(s): return T['t'].get(norm(s))
    def tx(m):
        raw=m.group(1);n=norm(raw)
        if n in T['t']:
            lead=re.match(r'\s*',raw).group(0);tail=re.search(r'\s*$',raw).group(0)
            return '>'+lead+html.escape(T['t'][n],quote=False)+tail+'<'
        return m.group(0)
    parts=MASK.split(h); out=[]
    for i,seg in enumerate(parts):
        if i%2: out.append(seg); continue
        # retrait des cartes / éléments pointant vers des pages non disponibles
        def drop(m):
            hr=m.group(2)
            if hr.startswith('/') and not ASSET.search(hr) and page_of(hr) not in G and page_of(hr) in gen: return ''
            return m.group(0)
        seg=re.sub(r'(<li>)?(<a class="category-card" href=")([^"]+)(">.*?</a>)(</li>)?',lambda m:'' if (m.group(3).startswith('/') and not ASSET.search(m.group(3)) and page_of(m.group(3)) in gen and page_of(m.group(3)) not in G) else m.group(0),seg,flags=re.S)
        seg=re.sub(r'<li><a href="(/[^"]*)">[^<]*</a></li>',lambda m:'' if (not ASSET.search(m.group(1)) and page_of(m.group(1)) in gen and page_of(m.group(1)) not in G and 'next-links' in seg) else m.group(0),seg)
        seg=re.sub(r'>([^<>]+)<',tx,seg)
        out.append(seg)
    h=''.join(out)
    def at(m):
        n=norm(m.group(2))
        return f'{m.group(1)}="{html.escape(T["t"][n],quote=True)}"' if n in T['t'] else m.group(0)
    h=re.sub(r'\b(aria-label|placeholder|alt|title|content)="([^"]*)"',at,h)
    h=re.sub(r'<title>([^<]*)</title>',lambda m:'<title>'+html.escape(T['t'].get(norm(m.group(1)),m.group(1)),quote=False)+'</title>',h)
    def ldj(m):
        b=m.group(1)
        b=re.sub(r'("(?:name|description)":\s*)"((?:[^"\\]|\\.)*)"',lambda k:k.group(1)+json.dumps(T['t'].get(norm(json.loads('"'+k.group(2)+'"')),json.loads('"'+k.group(2)+'"')),ensure_ascii=False),b)
        b=b.replace('"inLanguage": "fr-FR"',f'"inLanguage": "{LANGS[l]}"')
        return '<script type="application/ld+json">'+b+'</script>'
    h=re.sub(r'<script type="application/ld\+json">(.*?)</script>',ldj,h,flags=re.S)
    # URLs internes
    def fixurl(u,always=False):
        if u=='/' : return f'/{l}/'
        if not u.startswith('/') or ASSET.search(u): return u
        base=u.split('#')[0]; frag=u[len(base):]
        if always or page_of(base) in G: return f'/{l}'+base+frag
        return u
    h=re.sub(r'(<a\b[^>]*\bhref=")(/[^"]*)"',lambda m:m.group(1)+fixurl(m.group(2))+'"',h)
    h=re.sub(r'(<link rel="canonical" href=")'+re.escape(NEW)+r'([^"]*)"',lambda m:m.group(1)+NEW+f'/{l}'+(m.group(2) if m.group(2)!='/' else '/')+'"',h)
    h=re.sub(r'(<meta property="og:url" content=")'+re.escape(NEW)+r'([^"]*)"',lambda m:m.group(1)+NEW+f'/{l}'+m.group(2)+'"',h)
    def ldu(m):
        u=m.group(1)
        return NEW+(f'/{l}'+u if (u=='/' or not ASSET.search(u)) else u)
    # JSON-LD : URLs
    def ldurls(m):
        b=m.group(1)
        b=re.sub(r'"((?:url|@id|item))":\s*"'+re.escape(NEW)+r'(/[^"]*)"',lambda k:f'"{k.group(1)}": "{NEW}/{l}{k.group(2)}"' if not ASSET.search(k.group(2).split('#')[0]) else k.group(0),b)
        return '<script type="application/ld+json">'+b+'</script>'
    h=re.sub(r'<script type="application/ld\+json">(.*?)</script>',ldurls,h,flags=re.S)
    h=h.replace('<html lang="fr">',f'<html lang="{l}">').replace('content="fr_FR"',f'content="{OGL[l]}"')
    # scripts d'outil traduits
    d=os.path.dirname(p)
    if tool_js(p): h=h.replace(f'src="/{d}/script.js"',f'src="/{l}/{d}/script.js"')
    return h
def render_js(js,T,l):
    for a,b in T.get('code',[]): js=js.replace(a,b)
    def rep(m):
        q=m.group(0)[0]; s=m.group(1) if m.group(1) is not None else m.group(2)
        if s in T['js']:
            t=T['js'][s].replace('\\','\\\\').replace('\n','\\n').replace(q,'\\'+q); return q+t+q
        return m.group(0)
    js=JSLIT.sub(rep,js)
    return js.replace("'fr-FR'",f"'{LANGS[l]}'").replace("'fr'",f"'{l}'")
def covered(p,G,T,gen):
    r=render(rd(f'{O}/{p}'),p,T['_l'],T,G,gen)
    vals=set(T['t'].values())
    miss=[x for x in dict.fromkeys(strings(r)) if x not in vals and x not in NEUTRAL and need(x)]
    jf=tool_js(p); jm=[x for x in dict.fromkeys(js_strings(rd(jf))) if x not in T['js']] if jf else []
    return miss,jm
def main():
    report='--report' in sys.argv; P=pages(); gen=set(P)
    for l in LANGS:
        T=load(l); T['_l']=l; G=set(); info={}
        for _ in range(12):
            info={p:covered(p,G,T,gen) for p in P}
            new={p for p in P if not info[p][0] and not info[p][1]}
            if new==G: break
            G=G|new if len(new-G)>0 and not (G-new) else new
        # contrôle final : on retire toute page qui ne serait plus couverte avec le G final
        while True:
            bad={p for p in G if any(covered(p,G,T,gen))}
            if not bad: break
            G-=bad
        if report:
            json.dump({p:{'html':v[0],'js':v[1]} for p,v in info.items() if p in P and (v[0] or v[1])},open(f'/tmp/missing_{l}.json','w'),ensure_ascii=False,indent=1)
            print(l,'publiables:',len(G),'/',len(P)); continue
        shutil.rmtree(f'{O}/{l}',ignore_errors=True)
        for p in sorted(G):
            wr(f'{O}/{l}/{p}',render(rd(f'{O}/{p}'),p,l,T,G,gen))
            jf=tool_js(p)
            if jf: wr(f'{O}/{l}/{os.path.dirname(p)}/script.js',render_js(rd(jf),T,l))
        json.dump(sorted(G),open(f'/tmp/gen_{l}.json','w'))
        print(l,len(G),'pages générées')
main()
