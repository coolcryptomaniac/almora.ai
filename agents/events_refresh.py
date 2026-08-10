#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'data'/'events.json'
NOW=datetime.now(timezone.utc)
# Curated anchors are deliberately conservative. A precise future date requires a current organizer/official source.
EVENTS=[
 {"id":"almora-literature-festival-2026","name":"Almora Literature Festival 2026","category":"books-literature","start":"2026-10-30","end":"2026-11-01","venue":"Malla Mahal, Almora","locality":"Almora town","status":"confirmed","join":"Free entry; organizer registration opens with programme","source":"Almora Literature Festival","sourceUrl":"https://www.almoraliteraturefestival.org/","description":"Three days of literature, music, conversation and Himalayan arts at Malla Mahal.","theme":"aipan","featured":True},
 {"id":"nanda-devi-festival","name":"Nanda Devi Festival","category":"fair-festival","month":9,"venue":"Nanda Devi Temple / Almora town","locality":"Almora town","status":"recurring-verify-date","join":"Public fair; verify current-year programme","source":"District Almora, Government of Uttarakhand","sourceUrl":"https://almora.nic.in/fairs-festivals/","description":"Historic Almora fair centred on the Nanda Devi temple; the district describes it as a major September festival.","theme":"pichoda","featured":True},
 {"id":"ghughutiya-community","name":"Ghughutiya / Kale Kauwa community season","category":"culture-community","month":1,"venue":"Homes and neighbourhoods across Kumaon","locality":"Almora / Kumaon","status":"seasonal-cultural","join":"Community tradition; local activities vary","source":"Almora.ai cultural calendar","sourceUrl":"./culture.html","description":"Seasonal cultural window used to surface verified local Ghughutiya/Kale Kauwa activities when submitted or published.","theme":"kaale-kowa","featured":False},
 {"id":"hnb-stadium-sports-hub","name":"HNB Stadium sports & fitness hub","category":"sports-running","venue":"Hemwati Nandan Bahuguna Sports Stadium, Almora","locality":"Almora town","status":"venue-hub","join":"Check current association/stadium programme","source":"Public sports venue / event hub","sourceUrl":"https://www.google.com/maps/search/?api=1&query=Hemwati+Nandan+Bahuguna+Stadium+Almora","description":"A discovery hub for public running, badminton, football, boxing and other sports events when current organizers publish them.","theme":"aipan","featured":False},
 {"id":"malla-mahal-community-hub","name":"Malla Mahal culture & community hub","category":"music-social","venue":"Malla Mahal, Almora","locality":"Almora town","status":"venue-hub","join":"Check current organizer listing","source":"Public cultural venue","sourceUrl":"https://www.google.com/maps/search/?api=1&query=Malla+Mahal+Almora","description":"A discovery hub for literature, music, exhibitions, open mics and community gatherings at the historic venue.","theme":"aipan","featured":False}
]
def classify(e):
    if e.get('start'):
        try:
            start=datetime.fromisoformat(e['start']).replace(tzinfo=timezone.utc)
            e['upcoming']=start>=NOW
        except Exception:e['upcoming']=False
    else:e['upcoming']=False
    e['verifiedDate']=bool(e.get('start') and e.get('status')=='confirmed')
    return e
payload={"updatedAt":NOW.isoformat(),"policy":"Dates are shown as confirmed only when a current organizer or official source publishes them. Recurring fairs and venue hubs require current-year verification. User submissions remain unverified until moderation.","categories":["fair-festival","books-literature","music-social","sports-running","culture-community","summit-community"],"events":[classify(dict(x)) for x in EVENTS]}
payload['count']=len(payload['events']);OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2));print('wrote',payload['count'],'event/community anchors')
