const nav=document.querySelector('header nav');
if(nav){
 const login=document.createElement('a');login.id='identityLogin';login.className='identityLogin';login.href='./resident-login.html';login.textContent='Sign in';
 const btn=document.createElement('button');btn.id='publicMenuButton';btn.className='publicMenuButton';btn.type='button';btn.setAttribute('aria-label','Open Almora menu');btn.setAttribute('aria-expanded','false');btn.innerHTML='<span class="hamburgerBars"><i></i><i></i><i></i></span><span class="menuWord">Explore</span>';
 const report=nav.querySelector('#reportTop');nav.insertBefore(login,report||null);nav.insertBefore(btn,report||null);
}

const shell=document.createElement('div');
shell.innerHTML=`<div class="publicMenuBackdrop" id="publicMenuBackdrop" hidden></div><aside class="publicMenuDrawer" id="publicMenuDrawer" aria-hidden="true"><div class="publicMenuHead"><div><small>ALMORA.AI</small><h2>Explore Almora</h2></div><button id="publicMenuClose" type="button" aria-label="Close menu">×</button></div><div class="menuIdentity"><a href="./resident-login.html"><span>◎</span><b>Resident</b><small>Profile, jobs & local help</small></a><a href="./business-login.html"><span>▦</span><b>Business</b><small>List and hire locally</small></a><a href="./government-login.html"><span>◇</span><b>Government</b><small>Authorised civic access</small></a></div><div class="publicMenuGrid"><a href="#transport"><b>🚌 Transport</b><span>Bus, taxi, walk and drive</span></a><a href="#directory"><b>⌘ Directory</b><span>Hospitals, offices and services</span></a><a href="#notices"><b>◈ Notices</b><span>Official district updates</span></a><a href="#map-section"><b>◎ Map</b><span>Town map and public signals</span></a><a href="#culture"><b>🎭 Culture</b><span>Festivals and people</span></a><a href="./jobs.html"><b>💼 Jobs</b><span>Local opportunities</span></a><a href="./businesses.html"><b>🏪 Businesses</b><span>Local commerce</span></a><a href="./services.html"><b>🛠 Local help</b><span>Trusted service requests</span></a><a href="./docs.html"><b>⌗ Docs</b><span>How Almora.ai works</span></a></div><div class="publicMenuFoot"><button id="menuReport" type="button">＋ Report a town problem</button></div></aside>`;
document.body.appendChild(shell);

const drawer=document.querySelector('#publicMenuDrawer');
const backdrop=document.querySelector('#publicMenuBackdrop');
const trigger=document.querySelector('#publicMenuButton');
function openMenu(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');backdrop.hidden=false;document.body.classList.add('menuOpen');trigger?.setAttribute('aria-expanded','true')}
function closeMenu(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');backdrop.hidden=true;document.body.classList.remove('menuOpen');trigger?.setAttribute('aria-expanded','false')}
trigger?.addEventListener('click',openMenu);
document.querySelector('#publicMenuClose')?.addEventListener('click',closeMenu);
backdrop?.addEventListener('click',closeMenu);
document.querySelectorAll('#publicMenuDrawer a').forEach(a=>a.addEventListener('click',closeMenu));
document.querySelector('#menuReport')?.addEventListener('click',()=>{closeMenu();document.querySelector('#report')?.click()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
