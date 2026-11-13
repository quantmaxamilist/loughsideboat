# Copy integrity: every text line from the old pages' main content must appear in dist/ (normalised).
import re, os, glob, html
from html.parser import HTMLParser
class T(HTMLParser):
    def __init__(s): super().__init__(); s.out=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in('script','style','noscript','svg','nav','header','footer'): s.skip+=1
        if t in('p','div','h1','h2','h3','h4','li','br','a','span','button','dd','dt','label','legend','option'): s.out.append('\n')
    def handle_endtag(s,t):
        if t in('script','style','noscript','svg','nav','header','footer'): s.skip-=1
    def handle_data(s,d):
        if s.skip==0: s.out.append(d)
def norm(x):
    x=html.unescape(x).replace('’',"'").replace('‘',"'").replace('–','-').replace('—','-').replace(' ',' ').replace('​','')
    x=re.sub(r'^[·•\s]+','',x); x=re.sub(r'\s+',' ',x).strip().lower(); return x
def text(f, main=True):
    h=open(f,encoding='utf-8',errors='ignore').read()
    if main:
        m=re.search(r'<div id="et-main-area">(.*?)<footer',h,re.S); h=m.group(1) if m else h
    t=T(); t.feed(h); return ''.join(t.out)
new=' '.join(norm(l) for f in glob.glob('dist/**/*.html',recursive=True) if 'wow-' not in f for l in text(f,False).split('\n'))
new=re.sub(r'\s+',' ',new)
old_pages=['home','boats-for-sale','brokerage','detailing','serviceinhg','about','contact','2025_12_08_2007-bayliner-192','2025_12_09_2005-glastron-gs279-sports-cruiser']
tot=hit=0; miss=[]
seen=set()
for p in old_pages:
    for line in text(f'_src/old/{p}.html').split('\n'):
        l=norm(line)
        if len(l)<3 or l in seen or l in ('read more',): continue
        seen.add(l); tot+=1
        if l in new: hit+=1
        else: miss.append((p,line.strip()[:110]))
print(f'{hit}/{tot} old text lines present in dist')
for p,l in miss: print(' MISS',p,'|',l)
