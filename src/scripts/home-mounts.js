// Compatibility mounts for optional homepage modules. Keep DOM assumptions out of data/render code.
function ensureMount(id, hostSelector, heading, subheading){
  if(document.getElementById(id)) return;
  const host=document.querySelector(hostSelector);
  if(!host) return;
  const block=document.createElement('section');
  block.className='optionalModule';
  block.innerHTML=`<div class="sectionHead"><div><h3>${heading}</h3><p>${subheading}</p></div></div><div id="${id}" class="radioList"></div>`;
  host.append(block);
}
ensureMount('radioList','#culture','Kumaoni Radio','Curated cultural listening');
