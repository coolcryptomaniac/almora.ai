import {directory,culture,figures,officialLinks,emergency,liveNotices} from './data/almora-knowledge.js';

const perf=document.createElement('style');
perf.textContent=`html,body{overflow-x:hidden!important;overscroll-behavior-y:auto}.reveal,.reveal.in{opacity:1!important;transform:none!important;transition:none!important}.aurora{display:none!important}.quickDock,.publicMenuBackdrop,.publicMenuDrawer,header{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}.glassPanel:before{display:none!important}@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`;
document.head.appendChild(perf);document.body?.classList.remove('menuOpen');

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const dirUrl=q=>`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
const categories={all:'All',health:'Health',education:'Education',government:'Gov',utility:'Utilities',transport:'Transport',shopping:'Shops'};
let activeCategory='all';

function renderDirectory(){
 const root=$('#directoryGrid');if(!root)return;
 const q=($('#directorySearch')?.value||'').toLowerCase();
 const rows=directory.filter(x=>(activeCategory==='all'||x.category===activeCategory)&&`${x.name} ${x.area} ${x.category}`.toLowerCase().includes(q));
 root.innerHTML=rows.map(x=>`<article class="placeCard"><span class="trustBadge ${x.trust==='official'?'official':''}">${x.trust==='official'?'● Official source':'◌ Directory listing'}</span><h3>${x.name}</h3><p>${x.area}${x.phone?`<br><b>${x.phone}</b>`:''}</p><div class="actions"><a href="${dirUrl(x.query)}" target="_blank" rel="noopener">Navigate ↗</a>${x.phone?`<a href="tel:${x.phone.replace(/[^0-9+]/g,'')}">Call</a>`:''}${x.sourceUrl?`<a href="${x.sourceUrl}" target="_blank" rel="noopener">Source</a>`:''}</div></article>`).join('')||'<article class="placeCard"><h3>No match</h3><p>Try another search or ask Almora AI.</p></article>';
}
function buildDirectory(){
 const filters=$('#directoryFilters');if(!filters)return;
 filters.innerHTML=Object.entries(categories).map(([k,v])=>`<button type="button" data-cat="${k}" class="${k==='all'?'active':''}">${v}</button>`).join('');
 filters.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;activeCategory=b.dataset.cat;$$('#directoryFilters button').forEach(x=>x.classList.toggle('active',x===b));renderDirectory()});
 $('#directorySearch')?.addEventListener('input',renderDirectory);renderDirectory();
}

const modeInfo={
 bus:{title:'Public bus',desc:'Start with Almora Bus Terminal and verify the latest departure information.',dest:'Almora Bus Terminal',prompt:'Help me travel by public bus from Almora. Ask my destination and give verified-first options.'},
 taxi:{title:'Shared / private taxi',desc:'Use Dharanaula as a common transport starting point and confirm price before travel.',dest:'Taxi Services Dharanaula Almora',prompt:'Help me find a taxi or shared taxi from Almora.'},
 walk:{title:'Walk / local',desc:'Use live navigation and account for steep terrain, stairs and weather.',dest:'Almora Uttarakhand',prompt:'Help me plan a safe walking route in Almora.'},
 drive:{title:'Private vehicle',desc:'Use live navigation and verify road access before longer hill-road travel.',dest:'Almora Uttarakhand',prompt:'Help me plan a private vehicle route from Almora.'}
};
function setMode(mode){const x=modeInfo[mode];if(!x)return;$$('.modeBtn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));if($('#routeTitle'))$('#routeTitle').textContent=x.title;if($('#routeDesc'))$('#routeDesc').textContent=x.desc;if($('#routeNavigate'))$('#routeNavigate').href=dirUrl(x.dest);if($('#routeAsk'))$('#routeAsk').dataset.q=x.prompt;}
function buildTransport(){
 $$('.modeBtn').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));setMode('bus');
 $('#routeAsk')?.addEventListener('click',()=>{const p=$('#prompt');if(!p)return;p.value=$('#routeAsk').dataset.q;window.scrollTo({top:0,behavior:'auto'});setTimeout(()=>$('#ask')?.click(),40)});
}
function renderCulture(){
 if($('#calendarList'))$('#calendarList').innerHTML=culture.map(x=>`<div class="calendarItem"><div class="dateTile">${x.when.split('·')[0].trim()}</div><div><h4>${x.name}</h4><p>${x.type} · ${x.detail}</p>${x.sourceUrl?`<a href="${x.sourceUrl}" target="_blank" rel="noopener">Official context ↗</a>`:''}</div></div>`).join('');
 if($('#figureList'))$('#figureList').innerHTML=figures.map(x=>`<div class="figureItem"><div class="monogram">${x.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><h4>${x.name}</h4><p><b>${x.relation}</b> · ${x.tag}<br>${x.detail}</p>${x.sourceUrl?`<a href="${x.sourceUrl}" target="_blank" rel="noopener">Source ↗</a>`:''}</div></div>`).join('');
}
function renderSources(){
 if($('#sourceWall'))$('#sourceWall').innerHTML=officialLinks.map(x=>`<a href="${x.url}" target="_blank" rel="noopener"><b>${x.label} ↗</b><span>${x.detail}</span></a>`).join('');
 if($('#emergencyStrip'))$('#emergencyStrip').innerHTML=emergency.map(x=>`<a href="tel:${x.phone}"><small>${x.label}</small><b>${x.phone}</b></a>`).join('');
}
function renderNotices(){
 if(!$('#noticeGrid'))return;
 $('#noticeGrid').innerHTML=liveNotices.map(x=>`<article class="placeCard"><span class="trustBadge official">● ${x.status}</span><h3>${x.title}</h3><p>${x.summary}</p><small>${x.start} → ${x.end}</small><div class="actions"><a href="${x.url}" target="_blank" rel="noopener">Official notice ↗</a></div></article>`).join('');
}
function bindQuickActions(){
 document.addEventListener('click',e=>{const b=e.target.closest('[data-target]');if(!b)return;const target=$(b.dataset.target);if(target){e.preventDefault();target.scrollIntoView({behavior:'auto',block:'start'});}});
}
function updateToday(){const d=new Date();if($('#todayDate'))$('#todayDate').textContent=new Intl.DateTimeFormat('en-IN',{weekday:'long',day:'numeric',month:'long'}).format(d);const h=d.getHours();if($('#dayGreeting'))$('#dayGreeting').textContent=h<12?'Good morning, Almora.':h<17?'Good afternoon, Almora.':'Good evening, Almora.';}
async function loadMenu(){
 if(document.querySelector('#publicMenuDrawer'))return;
 let link=document.querySelector('link[href="./public-menu.css"]');
 if(!link){link=document.createElement('link');link.rel='stylesheet';link.href='./public-menu.css';document.head.appendChild(link);await new Promise(r=>{link.onload=r;link.onerror=r;setTimeout(r,1200)});}
 await import('./public-menu.js');
}

try{buildDirectory();buildTransport();renderCulture();renderSources();renderNotices();bindQuickActions();updateToday();loadMenu().catch(console.error);}catch(e){console.error('Almora UI init failed',e)}
