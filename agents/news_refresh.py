#!/usr/bin/env python3
import json, re, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'/'live-news.json'
UA='AlmoraAI/1.0 (+https://almora.ai)'
QUERIES={
 'innovation':'Almora Uttarakhand innovation OR startup OR technology OR science',
 'jobs':'Almora Uttarakhand jobs OR recruitment OR vacancy OR रोजगार',
 'politics':'Almora Uttarakhand government policy politics development',
 'education':'Almora Uttarakhand education university school scholarship',
 'sports':'Almora Uttarakhand sports athlete badminton cricket',
 'infrastructure':'Almora Uttarakhand road water transport infrastructure',
 'environment':'Almora Uttarakhand environment wildlife monkey forest climate'
}
EXCLUDE=re.compile(r'\b(murder|rape|theft|robbery|assault|suicide|accident|arrested|एफआईआर|हत्या|चोरी|बलात्कार)\b',re.I)
MAJOR=re.compile(r'\b(state|national|high court|supreme court|policy|government|election|minister|मुख्यमंत्री|सरकार|राज्य|राष्ट्रीय)\b',re.I)
TRUSTED=('almora.nic.in','uk.gov.in','sports.uk.gov.in','sssc.uk.gov.in','amarujala.com','jagran.com','livehindustan.com','timesofindia.indiatimes.com','hindustantimes.com','thehindu.com','indianexpress.com','economictimes.indiatimes.com')

def text(node,name):
    x=node.find(name); return (x.text or '').strip() if x is not None else ''

def fetch(category,q):
    url='https://news.google.com/rss/search?'+urllib.parse.urlencode({'q':q,'hl':'en-IN','gl':'IN','ceid':'IN:en'})
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=20) as r: root=ET.fromstring(r.read())
    rows=[]
    for it in root.findall('./channel/item')[:20]:
        title=text(it,'title'); link=text(it,'link'); pub=text(it,'pubDate')
        source_node=it.find('source'); source=(source_node.text or '').strip() if source_node is not None else 'News'
        source_url=source_node.attrib.get('url','') if source_node is not None else ''
        hay=f'{title} {source} {source_url}'
        if EXCLUDE.search(hay) and not MAJOR.search(hay): continue
        if source_url and not any(d in source_url for d in TRUSTED):
            # Keep unknown sources only when the headline is strongly Almora-specific.
            if 'almora' not in title.lower() and 'अल्मो' not in title: continue
        rows.append({'category':category,'title':title,'source':source,'published':pub,'url':link,'summary':''})
    return rows

def main():
    existing={'items':[]}
    if OUT.exists():
        try: existing=json.loads(OUT.read_text())
        except Exception: pass
    items=[]
    try:
        for cat,q in QUERIES.items(): items.extend(fetch(cat,q))
    except Exception as e:
        print('news refresh warning:',e)
    if not items:
        print('No fresh feed; preserving existing data')
        return
    seen=set(); clean=[]
    for x in items:
        key=re.sub(r'\W+',' ',x['title'].lower()).strip()
        if key in seen: continue
        seen.add(key); x['id']=f"{x['category']}-{abs(hash(key))}"; clean.append(x)
    clean=clean[:48]
    OUT.write_text(json.dumps({'updatedAt':datetime.now(timezone.utc).isoformat(),'editorialPolicy':'High-value Almora/Uttarakhand innovation, jobs, politics/policy, infrastructure, education, sports, science/technology and major public-interest developments. Routine crime is filtered unless major state/national relevance is detected.','items':clean},ensure_ascii=False,indent=2))
    print('wrote',len(clean),'news items')
if __name__=='__main__': main()
