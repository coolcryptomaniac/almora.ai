#!/usr/bin/env python3
import json, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'/'people.json'
ENDPOINT='https://query.wikidata.org/sparql'
UA='AlmoraAI/1.0 (+https://almora.ai; public civic knowledge project)'
QUERY='''
SELECT DISTINCT ?person ?personLabel ?personDescription ?birthPlaceLabel ?image ?article ?occupationLabel WHERE {
  VALUES ?region { wd:Q1805066 wd:Q2299057 }
  ?person wdt:P31 wd:Q5; wdt:P19 ?birthPlace.
  ?birthPlace wdt:P131* ?region.
  OPTIONAL { ?person wdt:P18 ?image. }
  OPTIONAL { ?person wdt:P106 ?occupation. }
  OPTIONAL { ?article schema:about ?person; schema:isPartOf <https://en.wikipedia.org/>. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,hi". }
}
LIMIT 220
'''

def main():
    url=ENDPOINT+'?'+urllib.parse.urlencode({'query':QUERY,'format':'json'})
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'application/sparql-results+json'})
    try:
        with urllib.request.urlopen(req,timeout=35) as r: data=json.load(r)
    except Exception as e:
        print('people refresh warning:',e); return
    rows=[]; seen=set()
    founder={
      'id':'mohit-pandey-almora-ai','name':'Mohit Pandey','description':'Founder of Almora.ai','birthPlace':'Almora / Kumaon connection','occupation':'Civic-tech builder','image':'https://avatars.githubusercontent.com/u/33383333?v=4','url':'https://github.com/coolcryptomaniac','source':'Founder profile','featured':True
    }
    rows.append(founder); seen.add(founder['name'].lower())
    for b in data.get('results',{}).get('bindings',[]):
        name=b.get('personLabel',{}).get('value','').strip()
        if not name or name.lower() in seen or name.startswith('Q'): continue
        seen.add(name.lower())
        rows.append({
          'id':b.get('person',{}).get('value','').rsplit('/',1)[-1],
          'name':name,
          'description':b.get('personDescription',{}).get('value','Person connected to Kumaon'),
          'birthPlace':b.get('birthPlaceLabel',{}).get('value','Kumaon'),
          'occupation':b.get('occupationLabel',{}).get('value',''),
          'image':b.get('image',{}).get('value',''),
          'url':b.get('article',{}).get('value') or b.get('person',{}).get('value',''),
          'source':'Wikidata / Wikimedia',
          'featured':False
        })
    rows=rows[:200]
    OUT.write_text(json.dumps({'updatedAt':datetime.now(timezone.utc).isoformat(),'method':'People born in places administratively within Almora district or Kumaon division, sourced from Wikidata; founder entry is maintained by Almora.ai. Inclusion means regional connection, not endorsement.','count':len(rows),'people':rows},ensure_ascii=False,indent=2))
    print('wrote',len(rows),'people')
if __name__=='__main__': main()
