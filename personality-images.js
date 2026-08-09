const portraits={
  'Lakshya Sen':{img:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lakshya%20Sen%20in%202018.jpg?width=900',source:'Wikimedia Commons'},
  'Ekta Bisht':{img:'https://static.toiimg.com/thumb/msid-59433482,width-900,height-700,resizemode-4/59433482.jpg',source:'Times of India'},
  'Chirag Sen':{img:'https://thebridge.in/h-upload/2023/12/26/51864-untitled-design.jpg',source:'The Bridge'},
  'Mohan Upreti':{img:'https://www.uttarakhandi.com/wp-content/uploads/MOHAN_UPRETI-min.png',source:'Uttarakhandi'},
  'Govind Ballabh Pant':{img:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pandit%20Govind%20Ballabh%20Pant.jpg?width=700',source:'Wikimedia Commons / Photo Division'},
  'Uday Shankar':{img:'https://www.jiyobangla.com/upload/1/news/1638940839_udayasankar-750x438.jpg',source:'Jiyo Bangla'}
};

function safeImg(url,alt,cls='personalityPhoto'){
  const img=document.createElement('img');img.src=url;img.alt=alt;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.className=cls;img.onerror=()=>img.remove();return img;
}
function upgradeFigures(root=document){
  root.querySelectorAll('.figureItem').forEach(card=>{const name=card.querySelector('h4')?.textContent?.trim();const p=portraits[name];const mono=card.querySelector('.monogram');if(!p||!mono||mono.dataset.upgraded)return;const img=safeImg(p.img,name);img.title=`Photo source: ${p.source}`;mono.replaceWith(img);img.dataset.upgraded='1';});
  root.querySelectorAll('.experienceCard').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const p=portraits[name];const media=card.querySelector('.mediaImage.generative,.mediaImage.portrait');if(!p||!media||media.dataset.upgraded)return;media.innerHTML='';const img=safeImg(p.img,name,'personalityPhotoLarge');img.title=`Photo source: ${p.source}`;media.appendChild(img);media.dataset.upgraded='1';});
  root.querySelectorAll('.athleteCard').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const p=portraits[name];const fallback=card.querySelector('.athleteFallback');if(!p||!fallback)return;const visual=document.createElement('div');visual.className='athleteVisual';visual.style.backgroundImage=`url("${p.img}")`;visual.title=`Photo source: ${p.source}`;fallback.replaceWith(visual);});
}

upgradeFigures();
const observer=new MutationObserver(mutations=>{for(const m of mutations){for(const n of m.addedNodes){if(n.nodeType===1)upgradeFigures(n)}}});
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(()=>upgradeFigures(),600);setTimeout(()=>upgradeFigures(),1800);
