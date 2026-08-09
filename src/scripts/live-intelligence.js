const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon={innovation:'🚀',jobs:'💼',politics:'🏛️',governance:'🏛️',education:'🎓',sports:'🏅',science:'🔬',infrastructure:'🛣️',environment:'🌿',health:'❤️',business:'🏪'};
const palette={innovation:'#4bd6ff',jobs:'#ffab4b',politics:'#af8cff',governance:'#af8cff',education:'#5ea8ff',sports:'#ffdd58',science:'#63e6be',infrastructure:'#ff7b62',environment:'#76df76'};
let cache=null;
async function getLiveNews(){if(cache)return cache;try{const r=await fetch('./data/live-news.json?ts='+Math.floor(Date.now()/3600000));if(!r.ok)throw new Error('news');cache=await r.json();return cache}catch{return{items:[]}}}
function fmtDate(v){const d=new Date(v);return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(d)}
async function mountLiveNews(){
 const section=document.querySelector('#news');if(!section)return;const data=await getLiveNews();if(!data.items?.length)return;
 const tabs=section.querySelector('.tabs');const grid=section.querySelector('#newsGrid');const head=section.querySelector('.sectionHead p');
 if(head)head.textContent=`Live public-interest feed · refreshed ${fmtDate(data.updatedAt)} · innovation, jobs, policy, education, sports, science and infrastructure`;
 const cats=['all',...new Set(data.items.map(x=>x.category))];if(tabs){tabs.innerHTML=cats.slice(0,8).map((c,i)=>`<button data-live-news="${escapeHtml(c)}" class="${i===0?'active':''}">${c==='all'?'Top stories':c[0].toUpperCase()+c.slice(1)}</button>`).join('')}
 const render=(cat='all')=>{const rows=data.items.filter(x=>cat==='all'||x.category===cat).slice(0,12);grid.innerHTML=rows.map(n=>`<a class="newsCard liveNewsCard" href="${escapeHtml(n.url)}" target="_blank" rel="noopener"><div class="newsIcon" style="--news-accent:${palette[n.category]||'#57df76'}"><span>${icon[n.category]||'◉'}</span><small>${escapeHtml(n.category||'update')}</small></div><div class="newsBody"><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.source||'Source')} · ${escapeHtml(fmtDate(n.published))}</p>${n.summary?`<small class="newsSummary">${escapeHtml(n.summary)}</small>`:''}</div></a>`).join('')};render();
 tabs?.querySelectorAll('[data-live-news]').forEach(b=>b.onclick=()=>{tabs.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render(b.dataset.liveNews)});
}
export{mountLiveNews,getLiveNews};
