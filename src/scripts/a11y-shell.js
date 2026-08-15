const navLabels={en:'Almora navigation',hi:'अल्मोड़ा नेविगेशन',kfy:'अल्माड़ नेविगेशन'};
function currentLanguage(){return document.querySelector('[data-lang].active')?.dataset.lang||localStorage.getItem('almoraLang')||document.documentElement.lang||'en'}
function initAccessibleShell(){
  const sidebar=document.querySelector('#sidebar');
  const triggers=[document.querySelector('#mobileMenu'),document.querySelector('#menuBtn')].filter(Boolean);
  if(!sidebar||!triggers.length)return;
  let lastTrigger=triggers.find(button=>button.offsetParent!==null)||triggers[0];
  const applyLabel=()=>sidebar.setAttribute('aria-label',navLabels[currentLanguage()]||navLabels.en);
  applyLabel();
  triggers.forEach(button=>{
    button.setAttribute('aria-controls','sidebar');
    button.setAttribute('aria-expanded',sidebar.classList.contains('open')?'true':'false');
    button.addEventListener('click',()=>{lastTrigger=button},{capture:true});
  });
  const sync=()=>{
    const open=sidebar.classList.contains('open');
    triggers.forEach(button=>button.setAttribute('aria-expanded',open?'true':'false'));
  };
  const observer=new MutationObserver(sync);
  observer.observe(sidebar,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&sidebar.classList.contains('open')){
      sidebar.classList.remove('open');
      lastTrigger?.focus();
    }
  });
  sidebar.addEventListener('click',event=>{
    if(event.target.closest('a')&&matchMedia('(max-width:860px)').matches)queueMicrotask(sync);
  });
  window.addEventListener('almora:language',applyLabel);
  sync();
}
export{initAccessibleShell};
