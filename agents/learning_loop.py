#!/usr/bin/env python3
"""Build shared, evidence-bound lessons that agents can reuse.

This is not model retraining. It converts fresh public signals and existing agent
collaborations into short reusable coordination rules with provenance and expiry.
"""
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/'data';OUT=DATA/'agent-learning.json'
def read(name,default):
    try:return json.loads((DATA/name).read_text())
    except Exception:return default
news=read('live-news.json',{'items':[]}).get('items',[]);monkeys=read('monkey-hotspots.json',{'hotspots':[]}).get('hotspots',[]);status=read('agent-status.json',{'collaborations':[]});routes=read('routes.json',{'routes':[]}).get('routes',[]);apps=read('apps.json',{'apps':[]}).get('apps',[])
now=datetime.now(timezone.utc);expires=(now+timedelta(days=7)).isoformat();lessons=[]
def add(key,from_agents,to_agents,rule,evidence,confidence='medium',ttl=expires):
    evidence=[x for x in evidence if x][:5]
    if not evidence:return
    lessons.append({'id':key,'fromAgents':from_agents,'toAgents':to_agents,'rule':rule,'evidence':evidence,'confidence':confidence,'createdAt':now.isoformat(),'expiresAt':ttl})
# Wildlife -> farming/civic: use reported activity, never invent population counts.
hot=[h for h in monkeys if int(h.get('activityIndex',0))>=3]
add('wildlife-hotspot-handoff',['monkey-wildlife'],['farm-watch','civic-watch','hill-life'],'When a locality has high reported monkey activity, surface humane safety, waste/food-attractant prevention and farm-protection guidance together. Call it reported activity, not population density.',[f"{h.get('locality')}: activity {h.get('activityIndex')}/4; {h.get('sourceUrl','')}" for h in hot],'high')
# Infrastructure -> routes/tourism.
infra=[n for n in news if n.get('category') in {'infrastructure','transport','environment'}]
add('access-before-travel',['road-access','civic-watch'],['route-intelligence','tourism','transport-watch'],'Before giving hill-route or tourism advice, check current access/infrastructure signals and hand off to a live map for the final route.',[f"{n.get('title')} — {n.get('url','')}" for n in infra],'high')
# Jobs <-> education.
career=[n for n in news if n.get('category') in {'jobs','education','science','technology'}]
add('learn-to-earn',['education','rural-education'],['local-jobs'],'When education or skill guidance is requested, connect it to current local opportunity signals when available; do not invent vacancies.',[f"{n.get('title')} — {n.get('url','')}" for n in career],'medium')
add('jobs-to-skills',['local-jobs'],['education','rural-education'],'When a job requires missing skills, return a learning pathway instead of ending at the vacancy card.',[f"{n.get('title')} — {n.get('url','')}" for n in career],'medium')
# App bridge -> local fallback.
add('external-app-fallback',['app-bridge'],['transport-watch','commerce','local-task-router'],'Never assume an external app serves Almora. Open the provider for live availability and show a local taxi, business or task fallback in the same answer.',[f"{a.get('name')}: {a.get('url')}" for a in apps if a.get('kind') in {'mobility','commerce','tasks','integrations'}] or [f"{len(apps)} internal apps in manifest"],'high')
# Hill life -> multi-agent sequence.
collabs=status.get('collaborations',[])
add('cross-service-sequencing',['hill-life'],['health-navigator','transport-watch','road-access','water-watch','rural-education','local-task-router'],'For compound hill-town problems, produce an ordered action sequence and assign each step to the most relevant specialist; do not dump unrelated links.',[f"{' + '.join(c.get('agents',[]))}: {c.get('reason','')}" for c in collabs],'high')
# Public information discipline.
public=[n for n in news if n.get('category') in {'governance','politics'}]
add('public-source-discipline',['government-navigator','civic-watch'],['town-concierge'],'For government/political/current-affairs questions, distinguish official information, reported news and resident allegation. Prefer source links and timestamps.',[f"{n.get('title')} — {n.get('source','')}" for n in public],'high')
# Route catalog is approximate.
add('route-distance-discipline',['route-intelligence'],['town-concierge','tourism'],'Treat catalog distances and drive windows as planning estimates; route users to the live map before departure because hill conditions change.',[f"Almora → {r.get('name')}: approx {r.get('distanceKm')} km" for r in routes],'high')
payload={'updatedAt':now.isoformat(),'mode':'shared-evidence-memory-not-model-training','explanation':'These short-lived lessons are derived from verified/public signals and agent handoffs. They improve coordination context without retraining or autonomously modifying the underlying language model.','count':len(lessons),'lessons':lessons}
OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2));print(json.dumps({'lessons':len(lessons)}))
