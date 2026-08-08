import { firebaseReady, appCheckReady, addTownReport, watchCollection } from './firebase-client.js';
import { aiReady, askAlmoraAI } from './ai-client.js';

const ALMORA=[29.5892,79.6467];
const promptBox=document.querySelector('#prompt');
const answer=document.querySelector('#answer');
const dialog=document.querySelector('#reportDialog');
const askButton=document.querySelector('#ask');
const publicSnapshots={publicIssues:[],facilities:[],jobs:[],transport:[],businesses:[]};

const intents=[
 [/monkey|bandar|wildlife|animal/i,'Wildlife & monkey response','I can organize a wildlife-conflict report by location and time, identify repeat hotspots, surface verified humane guidance, and route the case for accountable review. I will not recommend harming or poisoning wildlife.'],
 [/job|employment|work|vacancy|hire/i,'Local jobs','I can match verified Almora-area vacancies with opted-in candidates using skills, preferred location and availability while keeping candidate information private.'],
 [/farm|crop|agri|kheti|boar/i,'Farm intelligence','I can combine crop context, current weather and wildlife reports to surface source-backed risk information and relevant local support.'],
 [/road|pothole|blocked|landslide|access/i,'Road & access','I can turn this into a location-tagged road report, collect evidence, verify its status and track it from ownership through resolution.'],
 [/bus|taxi|transport|route|travel/i,'Transport','I can combine road conditions with verified bus/shared-taxi information to find viable local routes and disruptions.'],
 [/doctor|hospital|health|medical|medicine/i,'Health navigator','I can help find appropriate verified healthcare facilities and transport. I do not diagnose; emergencies should be escalated to appropriate emergency services.'],
 [/school|education|student|college|scholarship/i,'Education','I can connect students and families to verified schools, scholarships, courses and local opportunities.'],
 [/price|scam|fraud|bribe|corruption|overcharg/i,'Consumer & integrity','I can organize evidence and compare verifiable price/service information. Suspicious patterns should go to human review; allegations are never presented as facts without evidence.'],
 [/tour|visit|trip|hotel|trek/i,'Responsible tourism','I can combine weather, roads, places, transport and local commerce to plan a lower-friction, responsible Almora visit.']
];

function fallback(q){const hit=intents.find(x=>x[0].test(q));return {title:hit?hit[1]:'Town concierge',body:hit?hit[2]:'I can route this to the right Almora workflow. Include the broad location, what happened and what outcome you need.'}}
function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function compact(item){const out={};['id','title','name','role','employer','category','location','description','status','route','payRange','contact','source'].forEach(k=>{if(item?.[k]!==undefined&&item?.[k]!==null&&String(item[k]).length<500)out[k]=item[k]});return out}
function buildVerifiedContext(){const sections=[];for(const [name,rows] of Object.entries(publicSnapshots)){if(rows.length)sections.push(`${name}: ${JSON.stringify(rows.slice(0,20).map(compact))}`)}return sections.length?`VERIFIED PUBLIC DATA FROM ALMORA FIRESTORE:\n${sections.join('\n')}`:'VERIFIED PUBLIC DATA: No verified records are currently available in the relevant public collections.'}

async function ask(q=promptBox.value){q=q.trim();if(!q)return;promptBox.value=q;answer.hidden=false;askButton.disabled=true;askButton.textContent='Thinking…';answer.innerHTML='<b>✦ Almora AI</b><p>Checking the town network…</p>';try{if(aiReady){const result=await askAlmoraAI(q,buildVerifiedContext());answer.innerHTML=`<b>✦ Almora AI</b><p>${esc(result.text).replace(/\n/g,'<br>')}</p><small>${esc(result.agent)} · Gemini 3.6 Flash · App Check ${appCheckReady?'active':'not initialized'}</small>`;}else{throw new Error('AI unavailable')}}catch(e){const f=fallback(q);answer.innerHTML=`<b>✦ ${f.title}</b><p>${f.body}</p><small>${firebaseReady?'Connected to Almora Firestore.':'Prototype mode · Firebase unavailable.'} AI fallback active.</small>`;console.warn('AI request fell back',e)}finally{askButton.disabled=false;askButton.textContent='Ask AI ↑';answer.scrollIntoView({behavior:'smooth',block:'nearest'});}}
askButton.onclick=()=>ask();promptBox.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask()}});document.querySelectorAll('[data-q]').forEach(el=>el.onclick=()=>ask(el.dataset.q));

const map=L.map('map',{zoomControl:false}).setView(ALMORA,13);L.control.zoom({position:'bottomright'}).addTo(map);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
const seed=[
 {type:'road',p:[29.594,79.642],title:'Road report demo',status:'Seed marker · not live'},
 {type:'wildlife',p:[29.603,79.655],title:'Wildlife report demo',status:'Seed marker · not live'},
 {type:'health',p:[29.586,79.651],title:'Health layer demo',status:'Seed marker · verify before use'},
 {type:'jobs',p:[29.579,79.639],title:'Jobs layer demo',status:'Seed marker · not a vacancy'},
 {type:'transport',p:[29.591,79.648],title:'Transport layer demo',status:'Seed marker · not live'}
];
const seedMarkers=[];const liveMarkers=[];let activeLayer='all';
function visible(m){return activeLayer==='all'||m.kind===activeLayer}
function applyFilter(){[...seedMarkers,...liveMarkers].forEach(m=>visible(m)?m.addTo(map):map.removeLayer(m))}
seed.forEach(x=>{const m=L.circleMarker(x.p,{radius:8,weight:2,fillOpacity:.7,dashArray:'4 4'}).addTo(map).bindPopup(`<b>${x.title}</b><br>${x.status}`);m.kind=x.type;seedMarkers.push(m)});
document.querySelectorAll('.mapFilters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mapFilters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLayer=b.dataset.layer;applyFilter();});
document.querySelector('#locate').onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{const ll=[p.coords.latitude,p.coords.longitude];map.setView(ll,15);L.circleMarker(ll,{radius:8,fillOpacity:1}).addTo(map).bindPopup('Your approximate location').openPopup()},()=>alert('Location permission was not available.')):alert('Geolocation is not supported.');
function clearLive(){while(liveMarkers.length){const m=liveMarkers.pop();map.removeLayer(m)}}
function addLiveMarker(kind,item,label){const lat=Number(item.lat??item.latitude??item.location?.lat),lng=Number(item.lng??item.longitude??item.location?.lng);if(!Number.isFinite(lat)||!Number.isFinite(lng))return;const title=item.title||item.name||item.role||label;const status=item.description||item.route||item.status||'Verified public record';const m=L.circleMarker([lat,lng],{radius:9,weight:2,fillOpacity:.9}).bindPopup(`<b>${esc(title)}</b><br>${esc(status)}<br><small>Firestore · verified/public collection</small>`);m.kind=kind;liveMarkers.push(m);if(visible(m))m.addTo(map)}
if(firebaseReady){const stores={publicIssues:'road',facilities:'health',jobs:'jobs',transport:'transport',businesses:'business'};Object.entries(stores).forEach(([name,kind])=>watchCollection(name,rows=>{publicSnapshots[name]=rows;clearLive();Object.entries(stores).forEach(([collectionName,k])=>(publicSnapshots[collectionName]||[]).forEach(item=>addLiveMarker(k,item,collectionName)));if(liveMarkers.length){seedMarkers.forEach(m=>map.removeLayer(m));document.querySelector('.mapNote').textContent='● Live map & weather   ● Firestore verified/public data';}else{applyFilter();}},err=>console.warn(`Could not read ${name}`,err)));}
async function weather(){try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.5892&longitude=79.6467&current=temperature_2m,weather_code&timezone=Asia%2FKolkata');const d=await r.json();document.querySelector('#weather').textContent=`${Math.round(d.current.temperature_2m)}°C · live`;}catch{document.querySelector('#weather').textContent='Weather unavailable';}}weather();
function openReport(){dialog.showModal()}document.querySelector('#report').onclick=openReport;document.querySelector('#reportTop').onclick=openReport;
document.querySelector('#submitReport').onclick=async(e)=>{e.preventDefault();const payload={category:document.querySelector('#category').value,location:document.querySelector('#reportLocation').value.trim(),description:document.querySelector('#reportText').value.trim(),status:'new',source:'resident',createdAt:new Date().toISOString()};if(!payload.location||!payload.description){document.querySelector('#reportStatus').textContent='Please add a broad location and description.';return}try{await addTownReport(payload);document.querySelector('#reportStatus').textContent='Report submitted to Almora Firestore for moderation.';setTimeout(()=>dialog.close(),1400)}catch(err){document.querySelector('#reportStatus').textContent='Could not submit. Keep App Check enforcement off until valid requests appear in Firebase metrics, and confirm Firestore rules are published.';console.error(err)}};
