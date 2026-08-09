#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data'
OUT=DATA/'agent-status.json'

def read(name, default):
    try:return json.loads((DATA/name).read_text())
    except Exception:return default

news=read('live-news.json',{'items':[]}).get('items',[])
monkeys=read('monkey-hotspots.json',{'hotspots':[]}).get('hotspots',[])
people=read('people.json',{'people':[]}).get('people',[])

AGENTS={
 'town-concierge': {'label':'Citizen Support','domains':{'all'}},
 'civic-watch': {'label':'Civic & Safety','domains':{'governance','politics','infrastructure','environment'}},
 'monkey-wildlife': {'label':'Monkey & Wildlife','domains':{'environment','wildlife'}},
 'local-jobs': {'label':'Jobs & Skills','domains':{'jobs','business'}},
 'farm-watch': {'label':'Farming & Wildlife','domains':{'environment','agriculture','wildlife'}},
 'health-navigator': {'label':'Health & Wellness','domains':{'health'}},
 'transport-watch': {'label':'Transport','domains':{'transport','infrastructure'}},
 'road-access': {'label':'Road Access','domains':{'infrastructure','transport'}},
 'education': {'label':'Education','domains':{'education','jobs','science'}},
 'traffic': {'label':'Traffic','domains':{'transport','infrastructure'}},
 'price-scam-watch': {'label':'Price Watch','domains':{'business','consumer'}},
 'government-navigator': {'label':'Government Navigator','domains':{'governance','politics'}},
 'tourism': {'label':'Tourism Planner','domains':{'tourism','environment','infrastructure','culture'}},
 'commerce': {'label':'Local Commerce','domains':{'business','jobs'}},
 'local-task-router': {'label':'Clean Almora & Local Tasks','domains':{'environment','infrastructure'}}
}

def relevant(agent):
    domains=agent['domains']
    if 'all' in domains:return news[:5]
    return [n for n in news if n.get('category') in domains][:5]

statuses=[]
for aid,meta in AGENTS.items():
    signals=relevant(meta)
    if aid in {'monkey-wildlife','farm-watch'}:
        signals=([{'title':f"{h['locality']}: reported monkey activity level {h['activityIndex']}/4",'category':'wildlife','url':h.get('sourceUrl','')} for h in monkeys[:4]]+signals)[:6]
    statuses.append({'id':aid,'label':meta['label'],'state':'ready','signalCount':len(signals),'signals':signals})

collaborations=[]
def add(a,b,reason,items):
    if items:collaborations.append({'agents':[a,b],'reason':reason,'signals':[x.get('title','') for x in items[:3]]})
add('monkey-wildlife','farm-watch','Wildlife conflict affects homes, crops and farm decisions',[{'title':h['locality']} for h in monkeys])
add('road-access','transport-watch','Road and infrastructure updates change viable travel routes',[n for n in news if n.get('category')=='infrastructure'])
add('local-jobs','education','Jobs and education signals should connect vacancies to skills',[n for n in news if n.get('category') in {'jobs','education'}])
add('government-navigator','civic-watch','Policy and government updates need clear citizen-facing explanations',[n for n in news if n.get('category') in {'governance','politics'}])
add('tourism','road-access','Tourism planning should account for access and infrastructure',[n for n in news if n.get('category')=='infrastructure'])

payload={
 'updatedAt':datetime.now(timezone.utc).isoformat(),
 'mode':'coordination-not-self-training',
 'explanation':'Agents consume refreshed public signals and coordinate workflows. They do not retrain or self-modify the underlying language model.',
 'metrics':{'newsSignals':len(news),'monkeyHotspots':len(monkeys),'peopleProfiles':len(people),'agentCount':len(statuses),'collaborationCount':len(collaborations)},
 'agents':statuses,'collaborations':collaborations
}
OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2))
print(json.dumps(payload['metrics']))
