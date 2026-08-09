#!/usr/bin/env python3
import json, re, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'/'people.json'
WIKI='https://en.wikipedia.org/w/api.php';WIKIDATA='https://www.wikidata.org/w/api.php'
UA='AlmoraAI/1.0 (+https://almora.ai; public civic knowledge project)'
SOURCE_PAGES=['List of Kumaoni people']
SOURCE_CATEGORIES=['Category:People from Almora','Category:People from Almora district']
FEATURED={'Lakshya Sen','Ekta Bisht','Mohan Upreti','Govind Ballabh Pant','Uday Shankar','Tripti Bhatt','Chirag Sen','Ravi Tamta','B. D. Pande'}

def api(base,params,timeout=25):
    url=base+'?'+urllib.parse.urlencode(params);req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'application/json'})
    with urllib.request.urlopen(req,timeout=timeout) as r:return json.load(r)
def page_links(title):
    names=[];cont={}
    while True:
        data=api(WIKI,{'action':'query','format':'json','prop':'links','titles':title,'plnamespace':'0','pllimit':'max',**cont})
        for page in data.get('query',{}).get('pages',{}).values():names.extend(x['title'] for x in page.get('links',[]) if x.get('title'))
        if 'continue' not in data:break
        cont=data['continue']
    return names
def category_members(category):
    names=[];cont={}
    while True:
        data=api(WIKI,{'action':'query','format':'json','list':'categorymembers','cmtitle':category,'cmnamespace':'0','cmtype':'page','cmlimit':'max',**cont})
        names.extend(x['title'] for x in data.get('query',{}).get('categorymembers',[]) if x.get('title'))
        if 'continue' not in data:break
        cont=data['continue']
    return names
def details(titles):
    rows=[]
    for i in range(0,len(titles),40):
        data=api(WIKI,{'action':'query','format':'json','redirects':'1','prop':'extracts|pageimages|pageprops','exintro':'1','explaintext':'1','exsentences':'4','piprop':'thumbnail','pithumbsize':'600','titles':'|'.join(titles[i:i+40])})
        for p in data.get('query',{}).get('pages',{}).values():
            if p.get('missing') is not None:continue
            title=p.get('title','').strip();extract=re.sub(r'\s+',' ',p.get('extract','')).strip();qid=p.get('pageprops',{}).get('wikibase_item','')
            if title and len(extract)>=35 and qid:rows.append({'name':title,'description':extract[:560],'image':p.get('thumbnail',{}).get('source',''),'url':'https://en.wikipedia.org/wiki/'+urllib.parse.quote(title.replace(' ','_')),'wikibase':qid})
    return rows
def human_qids(qids):
    humans=set()
    for i in range(0,len(qids),50):
        data=api(WIKIDATA,{'action':'wbgetentities','format':'json','ids':'|'.join(qids[i:i+50]),'props':'claims'},timeout=25)
        for qid,e in data.get('entities',{}).items():
            for claim in e.get('claims',{}).get('P31',[]):
                value=claim.get('mainsnak',{}).get('datavalue',{}).get('value',{})
                if isinstance(value,dict) and value.get('id')=='Q5':humans.add(qid);break
    return humans
def infer_occupation(text):
    low=text.lower();rules=[('Sports',r'badminton|cricket|football|boxer|mountaineer|athlete|wrestler|sport'),('Public service',r'minister|politician|officer|civil servant|admiral|general|army|navy|air force|judge|governor'),('Culture',r'poet|writer|author|singer|musician|actor|actress|dancer|choreographer|theatre|artist|filmmaker'),('Science & education',r'scientist|professor|academic|historian|researcher|engineer|educator|physician|doctor'),('Business & social impact',r'entrepreneur|business|executive|philanthrop|activist|social worker')]
    for label,pat in rules:
        if re.search(pat,low):return label
    return 'Public figure'

def main():
    almora_category=set();names=[]
    try:
        for category in SOURCE_CATEGORIES:
            members=category_members(category);almora_category.update(x.casefold() for x in members);names.extend(members)
        for source in SOURCE_PAGES:names.extend(page_links(source))
        unique=[];seen=set()
        for n in names:
            k=n.casefold()
            if k not in seen:seen.add(k);unique.append(n)
        bios=details(unique[:500]);humans=human_qids([b['wikibase'] for b in bios]);bios=[b for b in bios if b['wikibase'] in humans]
    except Exception as e:raise SystemExit(f'people refresh failed: {e}')

    founder={'id':'mohit-pandey-almora-ai','name':'Mohit Pandey','description':'Founder of Almora.ai, building an open civic-tech and local-intelligence platform for Almora.','connection':'Founder of an Almora-focused civic-tech project','occupation':'Civic-tech builder','image':'https://avatars.githubusercontent.com/u/33383333?v=4','url':'./mohit-pandey.html','source':'Founder profile','featured':True,'verification':'self-maintained public profile'}
    manual={
      'Tripti Bhatt':{'description':'Indian Police Service officer publicly profiled as being from Almora.','connection':'From Almora','occupation':'Public service','image':'https://static.langimg.com/nbt/thumb/125504199/success-story-of-ips-tripti-bhatt.jpg?height=394&imgsize=1463247&resizemode=75&width=700','url':'https://sad.uk.gov.in/tripti-bhatt/','verification':'official/public profile'},
      'Ravi Tamta':{'description':'Almora innovator associated with the HAPIDA SKYNeX personal-air-mobility prototype demonstrated in Almora.','connection':'Innovation work in Almora','occupation':'Science & innovation','image':'','url':'https://economictimes.indiatimes.com/news/new-updates/this-uttarakhand-youth-built-a-flying-car-watch-it-take-off-in-almora/articleshow/133027113.cms','verification':'published public profile'},
      'Uday Shankar':{'description':'Dancer and choreographer who established the Uday Shankar India Cultural Centre in Almora, making the town central to a major modern Indian arts experiment.','connection':'Founded major cultural centre in Almora','occupation':'Culture','image':'','url':'https://en.wikipedia.org/wiki/Uday_Shankar','verification':'documented cultural connection'}
    }
    rows=[founder];seen={'mohit pandey'}
    for b in bios:
        n=b['name'];k=n.casefold();text=b['description']
        explicit=('almora' in text.casefold()) or (k in almora_category)
        if not explicit or k in seen:continue
        seen.add(k);rows.append({'id':b['wikibase'],'name':n,'description':text,'connection':'Explicit Almora / Almora district connection in public source','occupation':infer_occupation(text),'image':b['image'],'url':b['url'],'source':'Wikipedia / Wikimedia + Wikidata human validation','featured':n in FEATURED,'verification':'Wikidata human + explicit Almora connection'})
    for n,m in manual.items():
        if n.casefold() in seen:continue
        seen.add(n.casefold());rows.append({'id':re.sub(r'[^a-z0-9]+','-',n.lower()).strip('-'),'name':n,'source':'Public profile','featured':True,**m})
    rows=sorted(rows,key=lambda x:(not x.get('featured',False),x['name'].casefold()))[:200]
    OUT.write_text(json.dumps({'updatedAt':datetime.now(timezone.utc).isoformat(),'method':'Strict Almora atlas: public figures require an explicit Almora/Almora-district connection in source text/category or a manually documented deep connection through substantial work, education, institution-building or cultural contribution. Regional Kumaon-only association is not enough.','count':len(rows),'people':rows},ensure_ascii=False,indent=2))
    print('wrote',len(rows),'Almora-connected public profiles')
if __name__=='__main__':main()
