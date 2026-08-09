#!/usr/bin/env python3
import json, re, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'/'live-news.json'
UA='AlmoraAI/1.0 (+https://almora.ai)'
QUERIES={
 'innovation':'Almora Uttarakhand innovation startup technology science',
 'jobs':'Almora Uttarakhand jobs recruitment vacancy employment',
 'politics':'Almora Uttarakhand government policy election development politics',
 'education':'Almora Uttarakhand education university college school scholarship research',
 'sports':'Almora Uttarakhand sports athlete badminton cricket tournament',
 'infrastructure':'Almora Uttarakhand road water transport infrastructure project',
 'environment':'Almora Uttarakhand environment wildlife monkey forest climate farming'
}
BASELINE=[
 {'id':'official-district','category':'governance','categoryBasis':'official-anchor','title':'Almora district administration and current public notices','source':'District Almora','published':'','url':'https://almora.nic.in/','summary':'Official district notices, public utilities, tenders, disaster-management and administration updates.'},
 {'id':'official-jobs','category':'jobs','categoryBasis':'official-anchor','title':'Uttarakhand Subordinate Service Selection Commission recruitment updates','source':'UKSSSC','published':'','url':'https://sssc.uk.gov.in/','summary':'Official state recruitment notices and candidate updates.'},
 {'id':'official-sports','category':'sports','categoryBasis':'official-anchor','title':'Uttarakhand Sports Department facilities and sports updates','source':'Uttarakhand Sports Department','published':'','url':'https://sports.uk.gov.in/','summary':'Official sports infrastructure, schemes and department updates.'},
 {'id':'official-education','category':'education','categoryBasis':'official-anchor','title':'Kumaun University academic and student updates','source':'Kumaun University','published':'','url':'https://www.kunainital.ac.in/','summary':'Official university notices and academic information for the Kumaon region.'},
 {'id':'official-incubator','category':'innovation','categoryBasis':'official-anchor','title':'Rural Business Incubator, Hawalbagh supports local entrepreneurship','source':'District Almora','published':'','url':'https://almora.nic.in/','summary':'District-backed entrepreneurship support and rural business-incubation information.'},
 {'id':'monkey-ranikhet','category':'environment','categoryBasis':'curated-evidence','title':'Monkey and langur activity remains a public concern around Ranikhet','source':'Amar Ujala','published':'2026-05-08T23:42:00+05:30','url':'https://www.amarujala.com/uttarakhand/almora/in-the-morning-flocks-of-monkeys-were-seen-in-the-markets-and-streets-leaving-people-in-panic-ranikhet-news-c-232-1-alm1002-143114-2026-05-08','summary':'A local report documented recurring monkey/langur activity in Ranikhet and nearby areas.'}
]
EXCLUDE=re.compile(r'\b(murder|rape|theft|robbery|assault|suicide|minor accident|arrested|एफआईआर|हत्या|चोरी|बलात्कार)\b',re.I)
MAJOR=re.compile(r'\b(state|national|high court|supreme court|policy|government|election|minister|major|मुख्यमंत्री|सरकार|राज्य|राष्ट्रीय)\b',re.I)
TRUSTED=('almora.nic.in','uk.gov.in','sports.uk.gov.in','sssc.uk.gov.in','kunainital.ac.in','amarujala.com','jagran.com','livehindustan.com','timesofindia.indiatimes.com','hindustantimes.com','thehindu.com','indianexpress.com','economictimes.indiatimes.com','indiatoday.in','livemint.com','moneycontrol.com','theprint.in','pti.in')
SOCIAL=('LinkedIn','YouTube','Instagram','X')
# Dynamic feed items must earn their category from the headline. A search query is discovery only;
# it is never evidence that the story belongs in that category.
CATEGORY_RULES=[
 ('jobs',re.compile(r'\b(job|jobs|vacanc(?:y|ies)?|recruit(?:ment|ing)?|hiring|employment|apprentice|ssc|psc|रोजगार|भर्ती|नौकरी)\b',re.I)),
 ('sports',re.compile(r'\b(sport|badminton|cricket|football|athlete|tournament|championship|bwf|olymp|stadium|खेल|खिलाड़ी)\b',re.I)),
 ('science',re.compile(r'\b(science|scientist|laboratory|space|artificial intelligence|\bai\b|research (?:lab|centre|center|project)|scientific|विज्ञान|वैज्ञानिक)\b',re.I)),
 ('innovation',re.compile(r'\b(innovation|innovator|startup|technology|tech\b|prototype|skynex|flying car|drone|electric vehicle|incubator|entrepreneurship|नवाचार|स्टार्टअप|तकनीक)\b',re.I)),
 ('education',re.compile(r'\b(school|college|university|student|education|scholarship|academic|exam|teacher|campus|शिक्षा|विद्यालय|कॉलेज|छात्र|परीक्षा)\b',re.I)),
 ('infrastructure',re.compile(r'\b(road|highway|bridge|water supply|transport|rail|railway|airport|infrastructure|construction|landslide|tunnel|sewer|pipeline|सड़क|पुल|रेल|परिवहन|बुनियादी ढाँचा)\b',re.I)),
 ('environment',re.compile(r'\b(monkey|wildlife|forest|climate|environment|leopard|agriculture|farm|waste|water conservation|biodiversity|बंदर|वन्यजीव|जंगल|पर्यावरण|कृषि)\b',re.I)),
 ('politics',re.compile(r'\b(election|party|congress|bjp|politic|minister|chief minister|cm dhami|cabinet|mla|mp\b|rally|चुनाव|भाजपा|कांग्रेस|मंत्री|मुख्यमंत्री)\b',re.I)),
 ('governance',re.compile(r'\b(government|administration|district magistrate|dm\b|policy|scheme|digitisation|digital governance|sop|public notice|tender|सरकार|प्रशासन|नीति|योजना)\b',re.I))
]
STOP={'almora','uttarakhand','india','today','latest','news','the','from','with','this','that','young','watch','video','in','of','to','a','an','and'}

def text(node,name):
    x=node.find(name);return (x.text or '').strip() if x is not None else ''
def classify(title):
    for cat,rule in CATEGORY_RULES:
        if rule.search(title):return cat
    return None
def published_ts(pub):
    try:return parsedate_to_datetime(pub).timestamp()
    except Exception:
        try:return datetime.fromisoformat(pub).timestamp()
        except Exception:return 0
def event_signature(title):
    low=title.lower()
    if 'skynex' in low or 'flying car' in low:return 'skynex-flying-car'
    words=[w for w in re.findall(r'[a-z0-9]+',low) if len(w)>3 and w not in STOP]
    return '-'.join(sorted(w for w,_ in Counter(words).most_common(6)))[:180]
def score(row):
    title=row['title'];s=0;low=title.lower()
    if 'almora' in low or 'अल्मो' in title:s+=6
    if any(d in row.get('sourceUrl','') for d in TRUSTED):s+=4
    if row['source'] in SOCIAL:s+=1
    if row['category'] in {'jobs','education','science','innovation','infrastructure','governance','sports'}:s+=2
    ts=published_ts(row.get('published',''));age=max(0,(datetime.now(timezone.utc).timestamp()-ts)/86400) if ts else 999
    if age<=2:s+=5
    elif age<=7:s+=3
    elif age<=30:s+=2
    elif age<=180:s+=1
    return s
def fetch(query_category,q):
    url='https://news.google.com/rss/search?'+urllib.parse.urlencode({'q':q,'hl':'en-IN','gl':'IN','ceid':'IN:en'});req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=12) as r:root=ET.fromstring(r.read())
    rows=[]
    for it in root.findall('./channel/item')[:30]:
        title=text(it,'title');link=text(it,'link');pub=text(it,'pubDate');source_node=it.find('source');source=(source_node.text or '').strip() if source_node is not None else 'News';source_url=source_node.attrib.get('url','') if source_node is not None else ''
        hay=f'{title} {source} {source_url}'
        if EXCLUDE.search(hay) and not MAJOR.search(hay):continue
        local=('almora' in title.lower() or 'अल्मो' in title or 'uttarakhand' in title.lower());trusted=any(d in source_url for d in TRUSTED) if source_url else False;social=source in SOCIAL
        if not (trusted or (social and local) or ('almora' in title.lower() or 'अल्मो' in title)):continue
        detected=classify(title)
        if not detected:
            # Prevent Google RSS discovery spillover: a jobs search may surface a celebrity visit,
            # or an education search may surface a generic career feature. Such items must not
            # become agent evidence merely because of the query that found them.
            continue
        row={'category':detected,'categoryBasis':'headline-keyword','discoveredBy':query_category,'title':title,'source':source,'sourceUrl':source_url,'published':pub,'url':link,'summary':''};row['_score']=score(row);row['_event']=event_signature(title);rows.append(row)
    return rows

def main():
    fetched=[];errors=[]
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures={pool.submit(fetch,cat,q):cat for cat,q in QUERIES.items()}
        for f in as_completed(futures):
            cat=futures[f]
            try:fetched.extend(f.result())
            except Exception as e:errors.append(f'{cat}: {e}')
    fetched.sort(key=lambda x:(x['_score'],published_ts(x.get('published',''))),reverse=True)
    events=set();per_cat=defaultdict(int);clean=[]
    for x in fetched:
        if x['_event'] in events or per_cat[x['category']]>=5:continue
        events.add(x['_event']);per_cat[x['category']]+=1;x.pop('_score',None);x.pop('_event',None);x.pop('sourceUrl',None);key=re.sub(r'\W+',' ',x['title'].lower()).strip();x['id']=f"{x['category']}-{abs(hash(key))}";clean.append(x)
        if len(clean)>=36:break
    used_urls={x['url'] for x in clean};used_titles={event_signature(x['title']) for x in clean}
    for x in BASELINE:
        sig=event_signature(x['title'])
        if x['url'] in used_urls and sig in used_titles:continue
        clean.append(dict(x));used_urls.add(x['url']);used_titles.add(sig)
    if not clean:raise SystemExit('news refresh failed: '+'; '.join(errors or ['no usable items']))
    categories={x['category'] for x in clean}
    if len(clean)<8 or len(categories)<4:raise SystemExit(f'news refresh quality too low: items={len(clean)}, categories={sorted(categories)}')
    OUT.write_text(json.dumps({'updatedAt':datetime.now(timezone.utc).isoformat(),'editorialPolicy':'High-value Almora/Uttarakhand innovation, jobs, politics/policy, governance, infrastructure, education, sports, science/technology and major public-interest developments. Dynamic stories must be categorised from their headline/content signal; the search query that discovered a story is never enough to label it. Routine crime is filtered unless major state/national relevance is detected. Public social-media items may appear when surfaced through a news feed and strongly Almora-relevant. Official update hubs are retained as stable anchors when live feeds are thin.','items':clean[:42]},ensure_ascii=False,indent=2))
    print('wrote',min(len(clean),42),'news items across',len(categories),'categories; category-qualified fresh=',len(fetched))
    if errors:print('partial feed warnings:',*errors,sep='\n- ')
if __name__=='__main__':main()
