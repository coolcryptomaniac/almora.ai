#!/usr/bin/env python3
"""AETHERHOME scheduled research agent.
Uses public sources + an optional OpenAI-compatible LLM hook. Falls back to deterministic reporting.
No secret is required for crawling. Scheduled ChatGPT automation performs the primary AI synthesis layer.
"""
from __future__ import annotations
import argparse, datetime as dt, html, json, os, re, ssl, sys, urllib.request, urllib.error
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'data'/'intelligence'; HIST=DATA/'history'; REPORTS=ROOT/'reports'; SOURCES=ROOT/'agents'/'sources.json'
UA='AETHERHOME-Research-Agent/1.0 (+https://coolcryptomaniac.github.io/almora.ai/aetherhome/)'

def fetch(url, timeout=20):
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'text/html,application/xml,application/rss+xml,application/atom+xml,*/*'})
    with urllib.request.urlopen(req,timeout=timeout,context=ssl.create_default_context()) as r:return r.read(900_000).decode('utf-8','ignore')

def textify(s):
    s=re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>',' ',s,flags=re.I);s=re.sub(r'<[^>]+>',' ',s);s=html.unescape(s);return re.sub(r'\s+',' ',s).strip()

def parse_feed(raw, limit=12):
    out=[]
    try:
        root=ET.fromstring(raw)
        ns={'a':'http://www.w3.org/2005/Atom'}
        entries=root.findall('.//a:entry',ns) or root.findall('.//item')
        for e in entries[:limit]:
            def get(tag):
                x=e.find(tag,ns) if tag.startswith('a:') else e.find(tag);return (x.text or '').strip() if x is not None else ''
            title=get('a:title') or get('title'); summary=get('a:summary') or get('description'); link=''
            lx=e.find('a:link',ns)
            if lx is not None: link=lx.attrib.get('href','')
            if not link: link=get('link')
            out.append({'title':textify(title)[:220],'summary':textify(summary)[:700],'url':link})
    except Exception: pass
    return out

def collect():
    cfg=json.loads(SOURCES.read_text()); corpus=[]; ledger=[]
    for src in cfg['feeds']+cfg['pages']:
        try:
            raw=fetch(src['url']); ledger.append({'title':src['name'],'url':src['url'],'kind':src['kind'],'ok':True})
            if src in cfg['feeds']:
                for item in parse_feed(raw): corpus.append({'source':src['name'],'kind':src['kind'],**item})
            else:
                t=textify(raw)[:6000]; corpus.append({'source':src['name'],'kind':src['kind'],'title':src['name'],'summary':t,'url':src['url']})
        except Exception as e:
            ledger.append({'title':src['name'],'url':src['url'],'kind':src['kind'],'ok':False,'error':str(e)[:180]})
    return corpus,ledger

def optional_llm(corpus, mode):
    """Optional OpenAI-compatible inference hook. Scheduled ChatGPT automation is the primary AI synthesis layer."""
    endpoint=os.getenv('AETHERHOME_LLM_ENDPOINT','').strip()
    key=os.getenv('AETHERHOME_LLM_KEY','').strip()
    model=os.getenv('AETHERHOME_LLM_MODEL','').strip()
    if not (endpoint and key and model): return None
    compact=json.dumps(corpus[:35],ensure_ascii=False)[:42000]
    schema="""Return ONLY valid JSON with keys summary (string), signals (array of 4-8 objects: category, headline, impact), cost_watch (object: gpu,talent,prototype), roadmap_updates (array of strings). Be conservative. Separate facts from inference. Never invent prices or funding."""
    prompt=f"You are AETHERHOME's {mode} physical-AI research analyst. Analyze this public-source corpus for humanoid robotics, embodied AI, autonomy, GPU economics, talent/cost signals and implications for an autonomous living vehicle. {schema}\nCORPUS:\n{compact}"
    body=json.dumps({'model':model,'messages':[{'role':'system','content':'You are a rigorous robotics program analyst. Cite uncertainty and avoid hype.'},{'role':'user','content':prompt}],'temperature':0.2}).encode()
    req=urllib.request.Request(endpoint,data=body,headers={'Authorization':'Bearer '+key,'Content-Type':'application/json','Accept':'application/json'})
    try:
        with urllib.request.urlopen(req,timeout=60) as r: data=json.load(r)
        content=data['choices'][0]['message']['content']; content=re.sub(r'^```(?:json)?|```$','',content.strip(),flags=re.M).strip(); return json.loads(content),model
    except Exception as e:
        print('Optional LLM fallback:',e,file=sys.stderr);return None

def fallback(corpus):
    by={}
    for x in corpus:by.setdefault(x['kind'],[]).append(x)
    def lead(kind,label):
        arr=by.get(kind,[]); return (arr[0]['title'] if arr else f'No fresh {label} source parsed this run')
    signals=[
      {'category':'PHYSICAL AI','headline':lead('physical-ai','physical-AI'),'impact':'Re-test which cabin manipulation tasks can move from teleoperation to autonomous execution.'},
      {'category':'RESEARCH','headline':lead('research','research'),'impact':'Track advances that improve robot planning, manipulation and evaluation rather than benchmark novelty alone.'},
      {'category':'AUTONOMY','headline':lead('autonomy','autonomy'),'impact':'Keep the vehicle interface modular; do not assume AETHERHOME must invent the base driving stack.'},
      {'category':'GPU ECONOMICS','headline':lead('gpu-cost','GPU pricing'),'impact':'Prefer rented inference/simulation bursts and measured edge compute over premature frontier-model training.'}
    ]
    return {'summary':'Automated source scan completed without an LLM synthesis layer; headlines are source-derived and implications are conservative program heuristics.','signals':signals,'cost_watch':{'gpu':'Public pricing pages scanned; use vendor quotes before budgeting.','talent':'No reliable salary feed configured; hiring cost remains a planning assumption.','prototype':'Use the staged cost bands in journey.json and replace them with quotes as vendors engage.'},'roadmap_updates':['Maintain teleoperation fallback as a first-class product capability.','Benchmark useful cabin tasks before expanding humanoid scope.']},'deterministic-fallback'

def report_md(data):
    lines=[f"# AETHERHOME {data['mode'].title()} Intelligence — {data['generated_at'][:10]}",'',data['summary'],'','## Signals']
    for s in data['signals']:lines+= [f"### {s['category']}: {s['headline']}",s['impact'],'']
    lines+=['## Cost watch',f"- GPU: {data['cost_watch'].get('gpu','')}",f"- Talent: {data['cost_watch'].get('talent','')}",f"- Prototype: {data['cost_watch'].get('prototype','')}",'','## Sources']
    for s in data['sources']:lines.append(f"- [{s['title']}]({s['url']}) — {s['kind']}" + ('' if s.get('ok') else ' (fetch failed)'))
    return '\n'.join(lines)+'\n'

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--mode',choices=['weekly','monthly'],default='weekly');args=ap.parse_args();now=dt.datetime.now(dt.timezone.utc).replace(microsecond=0);corpus,ledger=collect();llm=optional_llm(corpus,args.mode)
    if llm: synthesis,model=llm
    else:synthesis,model=fallback(corpus)
    data={'generated_at':now.isoformat().replace('+00:00','Z'),'mode':args.mode,'summary':synthesis.get('summary',''),'signals':synthesis.get('signals',[]),'cost_watch':synthesis.get('cost_watch',{}),'roadmap_updates':synthesis.get('roadmap_updates',[]),'sources':ledger,'model':model}
    DATA.mkdir(parents=True,exist_ok=True);HIST.mkdir(parents=True,exist_ok=True);REPORTS.mkdir(parents=True,exist_ok=True);(DATA/'latest.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n');(HIST/(now.date().isoformat()+'.json')).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
    if args.mode=='monthly':(REPORTS/(now.strftime('%Y-%m')+'.md')).write_text(report_md(data))
    print(json.dumps({'mode':args.mode,'sources':len(ledger),'signals':len(data['signals']),'model':model}))
if __name__=='__main__':main()
