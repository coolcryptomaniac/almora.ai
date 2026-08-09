#!/usr/bin/env python3
import json, pathlib, urllib.request, datetime

ROOT = pathlib.Path(__file__).resolve().parents[1]
registry = json.loads((ROOT / 'data/source-registry.json').read_text())
rows=[]
for src in registry['sources']:
    req=urllib.request.Request(src['url'], headers={'User-Agent':'AlmoraAI-SourceWatch/1.0 (+https://almora.ai)'})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            rows.append({**src,'ok':200 <= r.status < 400,'status':r.status})
    except Exception as e:
        rows.append({**src,'ok':False,'status':'error','error':str(e)[:180]})

out={
  'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
  'summary': {'total':len(rows),'healthy':sum(1 for r in rows if r['ok'])},
  'sources': rows
}
(ROOT / 'data/source-health.json').write_text(json.dumps(out, indent=2)+"\n")
print(json.dumps(out['summary']))
if not all(r['ok'] for r in rows):
    raise SystemExit('One or more official sources failed health check')
