const menu=document.createElement('div');
menu.innerHTML=`<button class="publicMenuButton" id="publicMenuButton" aria-label="Open Almora features">☰ <span>Explore</span></button><div class="publicMenuBackdrop" id="publicMenuBackdrop" hidden></div><aside class="publicMenuDrawer" id="publicMenuDrawer" aria-hidden="true"><div class="publicMenuHead"><div><small>ALMORA.AI</small><h2>Everything in Almora</h2></div><button id="publicMenuClose" aria-label="Close menu">×</button></div><div class="publicMenuGrid">
<a href="#"><b>✦ Ask Almora AI</b><span>Town-wide AI concierge</span></a>
<a href="#news"><b>⚡ Almora Now</b><span>Important innovation, policy, jobs and civic news</span></a>
<a href="#sports"><b>🏸 Sports + fitness</b><span>Athletes, gyms and sports infrastructure</span></a>
<a href="#transport"><b>🚌 Transport</b><span>Bus, taxi, walk, driving</span></a>
<a href="#directory"><b>⌘ Directory</b><span>Hospitals, offices, colleges, shops</span></a>
<a href="#map-section"><b>◎ Live map</b><span>Issues, facilities and routes</span></a>
<a href="#live-intelligence"><b>☁ Live intelligence</b><span>Weather, traffic and hotspots</span></a>
<a href="#discover"><b>✺ Explore Almora</b><span>Temples, places, people and visual stories</span></a>
<a href="#videos"><b>▶ Watch Almora</b><span>Playable local and aerial videos</span></a>
<a href="#culture"><b>🎭 Culture</b><span>Festivals, calendar and heritage</span></a>
<a href="#notices"><b>◈ Official notices</b><span>District administration updates</span></a>
<a href="./jobs.html"><b>💼 Jobs</b><span>Find and post local work</span></a>
<a href="./businesses.html"><b>🏪 Businesses</b><span>Local commerce and onboarding</span></a>
<a href="./services.html"><b>🛠 Local help</b><span>Electrician, plumber, cook, driver, delivery</span></a>
<a href="#action-hubs"><b>✚ Health & civic help</b><span>Care, government and integrity routes</span></a>
<a href="#app-coverage"><b>▦ Apps in Almora</b><span>Food, mobility and delivery coverage</span></a>
<a href="./docs.html"><b>⌗ Docs</b><span>How Almora.ai works, data trust and agent architecture</span></a>
<a href="#about-founder"><b>आ About + support</b><span>Founder, mission and transparent support</span></a>
</div><div class="publicMenuFoot"><button id="menuReport">＋ Report a town problem</button><small>Admin and private moderation tools are intentionally not listed here.</small></div></aside>`;
document.body.appendChild(menu);
const drawer=document.querySelector('#publicMenuDrawer'),backdrop=document.querySelector('#publicMenuBackdrop');
function openMenu(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');backdrop.hidden=false;document.body.classList.add('menuOpen')}
function closeMenu(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');backdrop.hidden=true;document.body.classList.remove('menuOpen')}
document.querySelector('#publicMenuButton')?.addEventListener('click',openMenu);document.querySelector('#publicMenuClose')?.addEventListener('click',closeMenu);backdrop?.addEventListener('click',closeMenu);document.querySelectorAll('#publicMenuDrawer a').forEach(a=>a.addEventListener('click',closeMenu));document.querySelector('#menuReport')?.addEventListener('click',()=>{closeMenu();document.querySelector('#report')?.click()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open'))closeMenu()});
import('./personality-images.js').catch(console.error);
