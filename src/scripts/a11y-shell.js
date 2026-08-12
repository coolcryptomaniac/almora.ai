function initAccessibleShell(){
  const sidebar=document.querySelector('#sidebar');
  const triggers=[document.querySelector('#mobileMenu'),document.querySelector('#menuBtn')].filter(Boolean);
  if(!sidebar||!triggers.length)return;
  sidebar.setAttribute('aria-label','Almora navigation');
  triggers.forEach(button=>{
    button.setAttribute('aria-controls','sidebar');
    button.setAttribute('aria-expanded',sidebar.classList.contains('open')?'true':'false');
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
      triggers[0]?.focus();
    }
  });
  sidebar.addEventListener('click',event=>{
    if(event.target.closest('a')&&matchMedia('(max-width:860px)').matches)queueMicrotask(sync);
  });
  sync();
}
export{initAccessibleShell};
