#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

root=Path(__file__).resolve().parents[1]
registry=json.loads((root/'agents/registry.json').read_text())
workflows={p.name for p in (root/'.github/workflows').glob('*.yml')}
status=[]
for agent in registry['agents']:
    state='configured'
    evidence=[]
    aid=agent['id']
    if aid in {'town-concierge','health-navigator','government-navigator','tourism','transport-watch','road-access'}:
        evidence.append('interactive routing available')
    if aid in {'civic-watch','tourism','road-access'} and 'source-watch.yml' in workflows:
        evidence.append('official source health watch available')
    if aid in {'town-concierge','tourism','commerce','local-jobs'} and 'daily-news.yml' in workflows:
        evidence.append('daily high-signal news refresh available')
    if aid=='admin-coordinator': evidence.append('private coordination policy configured')
    if aid=='culture-preservation': evidence.append('Kumaoni culture library configured')
    status.append({'id':aid,'state':state,'evidence':evidence,'autonomous_learning':False})

out={'generated_at':datetime.now(timezone.utc).isoformat(),'agent_count':len(status),'meaning':'configured means code/policy exists; it does not mean the agent is independently running or learning','agents':status}
(root/'data/agent-status.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'agents':len(status),'with_execution_evidence':sum(bool(x['evidence']) for x in status)}))
