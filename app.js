import { db, firebaseReady, addTownReport } from './firebase-client.js';

const ALMORA=[29.5892,79.6467];
const promptBox=document.querySelector('#prompt');
const answer=document.querySelector('#answer');
const dialog=document.querySelector('#reportDialog');

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
function ask(q=promptBox.value){q=q.trim();if(!q)return;promptBox.value=q;const hit=intents.find(x=>x[0].test(q));const data=hit||['','Town concierge','I can route this to the right Almora workflow. Include the broad location, what happened and what outcome you need.'];const title=hit?data[1]:data[1],body=hit?data[2]:data[2];answer.hidden=false;answer.innerHTML=`<b>✦ ${title}</b><p>${body}</p><small>${firebaseReady?'Firebase adapter configured.':'Prototype response · add Firebase web config to activate database writes.'}</small>`;answer.scrollIntoView({behavior:'smooth',block:'nearest'});}
document.querySelector('#ask').onclick=()=>ask();document.querySelectorAll('[data-q]').forEach(el=>el.onclick=()=>ask(el.dataset.q));

const map=L.map('map',{zoomControl:false}).setView(ALMORA,13);L.control.zoom({position:'bottomright'}).addTo(map);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
const seed=[
 {type:'road',p:[29.594,79.642],title:'Road report demo',status:'Seed marker · not live'},
 {type:'wildlife',p:[29.603,79.655],title:'Wildlife report demo',status:'Seed marker · not live'},
 {type:'health',p:[29.586,79.651],title:'Health layer demo',status:'Seed marker · verify before use'},
 {type:'jobs',p:[29.579,79.639],title:'Jobs layer demo',status:'Seed marker · not a vacancy'},
 {type:'transport',p:[29.591,79.648],title:'Transport layer demo',status:'Seed marker · not live'}
];
const markers=[];seed.forEach(x=>{const m=L.circleMarker(x.p,{radius:8,weight:2,fillOpacity:.75}).addTo(map).bindPopup(`<b>${x.title}</b><br>${x.status}`);m.kind=x.type;markers.push(m)});
document.querySelectorAll('.mapFilters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mapFilters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const kind=b.dataset.layer;markers.forEach(m=>kind==='all'||m.kind===kind?m.addTo(map):map.removeLayer(m));});
document.querySelector('#locate').onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{const ll=[p.coords.latitude,p.coords.longitude];map.setView(ll,15);L.circleMarker(ll,{radius:8,fillOpacity:1}).addTo(map).bindPopup('Your approximate location').openPopup()},()=>alert('Location permission was not available.')):alert('Geolocation is not supported.');

async function weather(){try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.5892&longitude=79.6467&current=temperature_2m,weather_code&timezone=Asia%2FKolkata');const d=await r.json();document.querySelector('#weather').textContent=`${Math.round(d.current.temperature_2m)}°C · live`;}catch{document.querySelector('#weather').textContent='Weather unavailable';}}weather();

function openReport(){dialog.showModal()}document.querySelector('#report').onclick=openReport;document.querySelector('#reportTop').onclick=openReport;
document.querySelector('#submitReport').onclick=async(e)=>{e.preventDefault();const payload={category:document.querySelector('#category').value,location:document.querySelector('#reportLocation').value.trim(),description:document.querySelector('#reportText').value.trim(),status:'new',source:'resident',createdAt:new Date().toISOString()};if(!payload.location||!payload.description){document.querySelector('#reportStatus').textContent='Please add a broad location and description.';return}try{if(firebaseReady){await addTownReport(payload);document.querySelector('#reportStatus').textContent='Report saved to Firebase for review.';}else{const local=JSON.parse(localStorage.getItem('almora_reports')||'[]');local.push(payload);localStorage.setItem('almora_reports',JSON.stringify(local));document.querySelector('#reportStatus').textContent='Saved locally in prototype mode. Configure Firebase to sync town-wide.';}setTimeout(()=>dialog.close(),1200)}catch(err){document.querySelector('#reportStatus').textContent='Could not save report. Please try again.';console.error(err)}};