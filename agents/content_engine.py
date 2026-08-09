#!/usr/bin/env python3
import json,re
from datetime import datetime,timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/'data';OUT=DATA/'content-feed.json'
def read(name,default):
    try:return json.loads((DATA/name).read_text())
    except Exception:return default
news=read('live-news.json',{'items':[]}).get('items',[]);people=read('people.json',{'people':[]}).get('people',[]);monkeys=read('monkey-hotspots.json',{'hotspots':[]}).get('hotspots',[]);routes=read('routes.json',{'routes':[]}).get('routes',[]);learning=read('agent-learning.json',{'lessons':[]}).get('lessons',[])
priority={'governance':9,'infrastructure':9,'jobs':9,'education':8,'science':8,'innovation':8,'sports':7,'environment':7,'politics':7,'health':9,'business':6}
def clean(s):return re.sub(r'\s+',' ',str(s or '')).strip()
def item(i,kind,category,title,summary,url='',score=0,reason=''):
    return{'id':i,'kind':kind,'category':category,'title':clean(title),'summary':clean(summary),'url':url,'score':score,'reason':reason}
rows=[]
for idx,n in enumerate(news):
    cat=n.get('category','update');score=priority.get(cat,5)+(3 if 'almora' in n.get('title','').lower() else 0)
    rows.append(item(f'news-{idx}','news',cat,n.get('title'),n.get('summary') or f"{n.get('source','News')} update",n.get('url',''),score,'Fresh public-interest news'))
for p in people:
    if not p.get('featured'):continue
    rows.append(item(f"person-{p.get('id')}",'person','people',p.get('name'),p.get('connection') or p.get('description'),p.get('url',''),7,'Featured person with meaningful Almora connection'))
for h in monkeys:
    level=int(h.get('activityIndex',0));rows.append(item(f"monkey-{h.get('locality')}",'problem','wildlife',f"Monkey Watch · {h.get('locality')}",f"Reported activity {level}/4. Evidence date {h.get('evidenceDate','')}. This is not a population census.",h.get('sourceUrl',''),5+level,'Local problem signal'))
for r in routes:
    rows.append(item(f"route-{r.get('id')}",'route','transport',f"Almora → {r.get('name')}",f"Approx {r.get('distanceKm')} km · {r.get('time')} · {r.get('via')}",r.get('map',''),5,'Useful intercity planning'))
rows=sorted(rows,key=lambda x:(x['score'],x['title']),reverse=True)
# Preserve category diversity in the front page of the feed.
front=[];seen={}
for x in rows:
    cap=3 if x['kind']=='news' else 2
    key=f"{x['kind']}:{x['category']}"
    if seen.get(key,0)>=cap:continue
    seen[key]=seen.get(key,0)+1;front.append(x)
    if len(front)>=40:break
agent_topics={
 'town-concierge':['governance','infrastructure','jobs','education','health','transport','wildlife'],
 'monkey-wildlife':['wildlife','environment'],'farm-watch':['wildlife','environment'],'local-jobs':['jobs','education','business'],'rural-education':['education','jobs','science'],'water-watch':['infrastructure','environment','health'],'route-intelligence':['transport','infrastructure'],'tourism':['transport','environment','people'],'government-navigator':['governance','politics'],'civic-watch':['governance','infrastructure','environment'],'health-navigator':['health','transport'],'app-bridge':['transport','business'],'hill-life':['health','transport','infrastructure','education','wildlife']
}
index={a:[x['id'] for x in front if x['category'] in cats][:10] for a,cats in agent_topics.items()}
payload={'updatedAt':datetime.now(timezone.utc).isoformat(),'editorialPolicy':'Rank current, useful and source-linked Almora public-interest content. Routine sensational crime is not promoted. Resident/problem signals remain explicitly unverified or evidence-scoped.','count':len(front),'items':front,'agentIndex':index,'sharedLessonCount':len(learning)}
OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2));print(json.dumps({'contentItems':len(front),'agentIndexes':len(index)}))
