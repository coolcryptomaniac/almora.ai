import {directory,culture,figures,officialLinks,emergency} from './data/almora-knowledge.js';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const promptBox=$('#prompt'),answer=$('#answer'),dialog=$('#reportDialog'),askButton=$('#ask');
const intents=[
 [/monkey|bandar|wildlife|animal/i,'Wildlife & monkey response','I can help organise a wildlife-conflict report, identify repeat hotspots and route it for humane, accountable review.'],
 [/job|employment|work|vacancy|hire/i,'Local jobs','I can help find verified Almora-area vacancies and match them with an opted-in resident profile.'],
 [/farm|crop|agri|kheti|boar/i,'Farm intelligence','I can combine crop context, weather and verified local support information without guessing live conditions.'],
 [/road|pothole|blocked|landslide|access/i,'Road & access','I can help document a road issue and route it through a verified-first workflow.'],
 [/bus|taxi|transport|route|travel/i,'Transport','I can help with bus, taxi, walking and driving options using verified information where available.'],
 [/doctor|hospital|health|medical|medicine/i,'Health navigator','I can help locate verified healthcare facilities and transport. I do not diagnose.'],
 [/school|education|student|college|scholarship/i,'Education','I can connect students and families to verified colleges, education services and opportunities.'],
 [/price|scam|fraud|bribe|corruption|overcharg/i,'Consumer & integrity','I can help organise evidence and route concerns without presenting allegations as proven facts.'],
 [/tour|visit|trip|hotel|trek|culture|festival/i,'Responsible tourism','I can help plan Almora travel using places, culture, weather and transport context.']
];
function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function fallback(q){const hit=intents.find(x=>x[0].test(q));return {title:hit?hit[1]:'Town concierge',body:hit?hit[2]:'Tell me what you need in Almora and the broad area if location matters.'}}
function context(){return `OFFICIAL STATIC ALMORA DATA:\nDirectory: ${JSON.stringify(directory.filter(x=>x.trust==='official').slice(0,30))}\nCulture: ${JSON.stringify(culture)}\nFigures: ${JSON.stringify(figures)}\nEmergency: ${JSON.stringify(emergency)}\nSources: ${JSON.stringify(officialLinks.map(x=>x.label))}`}
async function ask(q=promptBox?.value||''){
 q=q.trim();if(!q||!answer||!askButton)return;
 answer.hidden=false;askButton.disabled=true;askButton.textContent='Thinking…';
 const fast=fallback(q);answer.innerHTML=`<b>✦ ${esc(fast.title)}</b><p>${esc(fast.body)}</p><small>Fast local response · checking AI enhancement…</small>`;
 try{
  const ai=await import('./ai-client.js');
  if(ai.aiReady){const result=await ai.askAlmoraAI(q,context());answer.innerHTML=`<b>✦ Almora AI</b><p>${esc(result.text).replace(/\n/g,'<br>')}</p><small>${esc(result.agent||'town-concierge')} · AI enhanced</small>`;}
 }catch(e){console.info('AI enhancement unavailable; fast response retained.',e)}
 finally{askButton.disabled=false;askButton.textContent='Ask AI ↑';}
}
askButton?.addEventListener('click',()=>ask());
promptBox?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask()}});
$$('[data-q]').forEach(el=>el.addEventListener('click',()=>{if(promptBox)promptBox.value=el.dataset.q;ask(el.dataset.q)}));

const map=$('#map');
if(map){map.innerHTML=`<iframe title="OpenStreetMap of Almora" loading="lazy" referrerpolicy="no-referrer" src="https://www.openstreetmap.org/export/embed.html?bbox=79.60%2C29.55%2C79.69%2C29.63&layer=mapnik&marker=29.5892%2C79.6467" style="border:0;width:100%;height:100%;min-height:420px"></iframe>`;}
$$('.mapFilters button').forEach(b=>b.addEventListener('click',()=>{$$('.mapFilters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const note=$('.mapNote');if(note)note.textContent=b.dataset.layer==='all'?'● Lightweight map · open detailed layers as needed':`● ${b.textContent.trim()} selected · detailed live markers load on demand`;}));
$('#locate')?.addEventListener('click',()=>{if(!navigator.geolocation){alert('Geolocation is not supported.');return}navigator.geolocation.getCurrentPosition(p=>window.open(`https://www.openstreetmap.org/?mlat=${p.coords.latitude}&mlon=${p.coords.longitude}#map=16/${p.coords.latitude}/${p.coords.longitude}`,'_blank'),()=>alert('Location permission was not available.'))});

fetch('https://api.open-meteo.com/v1/forecast?latitude=29.5892&longitude=79.6467&current=temperature_2m&timezone=Asia%2FKolkata',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if($('#weather'))$('#weather').textContent=`${Math.round(d.current.temperature_2m)}°C · live`}).catch(()=>{if($('#weather'))$('#weather').textContent='Weather available on request'});

function openReport(){if(dialog&&!dialog.open)dialog.showModal()}
$('#report')?.addEventListener('click',openReport);$('#reportTop')?.addEventListener('click',openReport);
$('#submitReport')?.addEventListener('click',async e=>{
 e.preventDefault();const status=$('#reportStatus');const payload={category:$('#category')?.value||'Other',location:$('#reportLocation')?.value.trim()||'',description:$('#reportText')?.value.trim()||'',status:'new',source:'resident',createdAt:new Date().toISOString()};
 if(!payload.location||!payload.description){if(status)status.textContent='Please add a broad location and description.';return}
 if(status)status.textContent='Saving…';
 try{const fb=await import('./firebase-client.js');if(fb.firebaseReady){await fb.addTownReport(payload);if(status)status.textContent='Report submitted for moderation.';}else throw new Error('firebase-unavailable')}
 catch(err){const rows=JSON.parse(localStorage.getItem('almora_reports')||'[]');rows.push(payload);localStorage.setItem('almora_reports',JSON.stringify(rows));if(status)status.textContent='Saved safely on this device; online sync is temporarily unavailable.';}
 setTimeout(()=>dialog?.close(),900);
});
