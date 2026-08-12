const ROUTES={
 '#transport':'./travel.html',
 '#health':'./services.html#health',
 '#education':'./education-rural.html',
 '#farming':'./wildlife.html',
 '#governance':'./local-directory.html',
 '#safety':'./local-directory.html',
 '#sports':'./people.html',
 '#events':'#culture',
 '#directory':'./local-directory.html',
 '#clean':'#clean'
};
function closeSidebar(){document.querySelector('#sidebar')?.classList.remove('open')}
function goHash(hash){const target=document.querySelector(hash);if(!target)return false;target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});history.replaceState(null,'',hash);return true}
function mountNavRouter(){document.querySelectorAll('.sidebar .navItem').forEach(link=>{link.addEventListener('click',e=>{const raw=link.getAttribute('href')||'';if(!raw.startsWith('#')){closeSidebar();return}const route=ROUTES[raw]||raw;e.preventDefault();closeSidebar();document.querySelectorAll('.sidebar .navItem').forEach(x=>x.classList.toggle('active',x===link));if(route.startsWith('#')){if(!goHash(route)&&raw!==route)goHash(raw);return}location.href=route})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountNavRouter,{once:true});else mountNavRouter();
export{mountNavRouter,ROUTES};
