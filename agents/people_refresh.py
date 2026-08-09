#!/usr/bin/env python3
import json, re, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'/'people.json'
API='https://en.wikipedia.org/w/api.php'
UA='AlmoraAI/1.0 (+https://almora.ai; public civic knowledge project)'
SOURCE_PAGES=['List of Kumaoni people','Almora']
SKIP={
 'Kumaon','Kumaoni people','Kumaoni language','Almora','Uttarakhand','India','Kumaon Regiment',
 'Kumaoni cuisine','Kumaoni Holi','Maneaters of Kumaon','Kumaon Kingdom','List of Kumaoni people',
 'Garhwali people','Khas people','Hinduism','Buddhism','Indian National Army','Indian Rebellion of 1857'
}
FEATURED={'Lakshya Sen','Ekta Bisht','Mohan Upreti','Govind Ballabh Pant','Uday Shankar','Sumitranandan Pant','Tripti Bhatt','Chirag Sen','Ravi Tamta'}

def get(params):
    url=API+'?'+urllib.parse.urlencode(params)
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'application/json'})
    with urllib.request.urlopen(req,timeout=25) as r:return json.load(r)

def links(title):
    names=[];cont={}
    while True:
        params={'action':'query','format':'json','prop':'links','titles':title,'plnamespace':'0','pllimit':'max',**cont}
        data=get(params)
        for page in data.get('query',{}).get('pages',{}).values():
            names.extend(x['title'] for x in page.get('links',[]) if x.get('title'))
        if 'continue' not in data:break
        cont=data['continue']
    return names

def details(titles):
    rows=[]
    for i in range(0,len(titles),40):
        batch=titles[i:i+40]
        data=get({'action':'query','format':'json','redirects':'1','prop':'extracts|pageimages|pageprops','exintro':'1','explaintext':'1','exsentences':'3','piprop':'thumbnail','pithumbsize':'600','titles':'|'.join(batch)})
        for p in data.get('query',{}).get('pages',{}).values():
            if p.get('missing') is not None:continue
            title=p.get('title','').strip();extract=re.sub(r'\s+',' ',p.get('extract','')).strip()
            if not title or title in SKIP or len(extract)<35:continue
            # A notable-person list should resolve mainly to biographies. Remove obvious non-person articles.
            low=extract.lower()
            if any(x in low[:180] for x in [' is a district',' is a language',' is a region',' is a village',' is a town',' is a regiment',' is a cuisine',' is a festival',' is a list of']):continue
            rows.append({'name':title,'description':extract[:420],'image':p.get('thumbnail',{}).get('source',''),'url':'https://en.wikipedia.org/wiki/'+urllib.parse.quote(title.replace(' ','_')),'wikibase':p.get('pageprops',{}).get('wikibase_item','')})
    return rows

def infer_occupation(text):
    low=text.lower()
    rules=[('Sports',r'badminton|cricket|football|boxer|mountaineer|athlete|wrestler|sport'),('Public service',r'minister|politician|officer|civil servant|admiral|general|army|navy|air force|judge|governor'),('Culture',r'poet|writer|author|singer|musician|actor|actress|dancer|choreographer|theatre|artist|filmmaker'),('Science & education',r'scientist|professor|academic|historian|researcher|engineer|educator'),('Business & social impact',r'entrepreneur|business|executive|philanthrop|activist|social worker')]
    for label,pat in rules:
        if re.search(pat,low):return label
    return 'Public figure'

def main():
    try:
        names=[]
        for source in SOURCE_PAGES:names.extend(links(source))
        # Stable de-duplication, keeping the list-page order before Almora's broader historical associations.
        unique=[];seen=set()
        for n in names:
            if n not in seen and n not in SKIP:seen.add(n);unique.append(n)
        bios=details(unique[:260])
    except Exception as e:
        raise SystemExit(f'people refresh failed: {e}')

    founder={'id':'mohit-pandey-almora-ai','name':'Mohit Pandey','description':'Founder of Almora.ai, building an open civic-tech and local-intelligence platform for Almora.','birthPlace':'Almora / Kumaon connection','occupation':'Civic-tech builder','image':'https://avatars.githubusercontent.com/u/33383333?v=4','url':'https://github.com/coolcryptomaniac','source':'Founder profile','featured':True}
    manual={
      'Tripti Bhatt':{'description':'Indian Police Service officer from Almora.','birthPlace':'Almora','occupation':'Public service','image':'https://static.langimg.com/nbt/thumb/125504199/success-story-of-ips-tripti-bhatt.jpg?height=394&imgsize=1463247&resizemode=75&width=700','url':'https://sad.uk.gov.in/tripti-bhatt/'},
      'Ravi Tamta':{'description':'Almora innovator associated with the HAPIDA SKYNeX personal-air-mobility prototype.','birthPlace':'Almora','occupation':'Science & innovation','image':'','url':'https://economictimes.indiatimes.com/news/new-updates/this-uttarakhand-youth-built-a-flying-car-watch-it-take-off-in-almora/articleshow/133027113.cms'}
    }
    rows=[founder];seen={'mohit pandey'}
    for b in bios:
        n=b['name'];key=n.lower()
        if key in seen:continue
        seen.add(key)
        rows.append({'id':b['wikibase'] or re.sub(r'[^a-z0-9]+','-',key).strip('-'),'name':n,'description':b['description'],'birthPlace':'Kumaon / Almora documented connection','occupation':infer_occupation(b['description']),'image':b['image'],'url':b['url'],'source':'Wikipedia / Wikimedia','featured':n in FEATURED})
    for n,m in manual.items():
        if n.lower() in seen:continue
        seen.add(n.lower());rows.append({'id':re.sub(r'[^a-z0-9]+','-',n.lower()).strip('-'),'name':n,'source':'Public profile','featured':True,**m})
    rows=rows[:200]
    if len(rows)<35:
        raise SystemExit(f'people refresh produced only {len(rows)} profiles; preserving existing atlas instead of publishing an unexpectedly small set')
    OUT.write_text(json.dumps({'updatedAt':datetime.now(timezone.utc).isoformat(),'method':'Public figures linked from Wikipedia’s List of Kumaoni people plus Almora’s notable-person references, enriched from Wikipedia/Wikimedia. Founder/public-profile additions are maintained separately. Inclusion means documented regional connection, not endorsement.','count':len(rows),'people':rows},ensure_ascii=False,indent=2))
    print('wrote',len(rows),'people')
if __name__=='__main__':main()
