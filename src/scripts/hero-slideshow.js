const slides=[
 {src:'./assets/hero-top.png',label:'Almora · Hamara Pahad',kind:'Almora.ai'},
 {src:'https://s7ap1.scene7.com/is/image/incredibleindia/2-kasar-devi-temple-almorah-uttarakhand-attr-hero?qlt=82&ts=1726646942358',label:'Kasar Devi · Almora',kind:'Heritage'},
 {src:'https://s7ap1.scene7.com/is/image/incredibleindia/2-jageshwar-temple-almorah-uttarakhand-attr-hero?qlt=82&ts=1726646689920',label:'Jageshwar · Almora district',kind:'Sacred landscape'},
 {src:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=82',label:'Himalayan horizons',kind:'Mountains'},
 {src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=82',label:'Kumaon · forest and light',kind:'Nature'},
 {src:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=82',label:'Explore the hills',kind:'Travel'}
];
function mountHeroSlideshow(){
 const hero=document.querySelector('.hero');const base=document.querySelector('.heroPhoto');if(!hero||!base)return;
 base.style.backgroundImage=`url('${slides[0].src}')`;base.dataset.slide='0';
 const controls=document.createElement('div');controls.className='heroSlides';controls.innerHTML=`<button class="heroArrow prev" aria-label="Previous hero">‹</button><div class="heroDots">${slides.map((s,i)=>`<button aria-label="${s.label}" data-slide="${i}" class="${i===0?'active':''}"></button>`).join('')}</div><div class="heroCaption"><b>${slides[0].label}</b><small>${slides[0].kind}</small></div><button class="heroArrow next" aria-label="Next hero">›</button>`;hero.appendChild(controls);
 let index=0,timer=null,paused=false,dragX=null;
 const dots=[...controls.querySelectorAll('[data-slide]')],caption=controls.querySelector('.heroCaption');
 function show(next){index=(next+slides.length)%slides.length;const s=slides[index];base.classList.add('changing');const probe=new Image();probe.onload=()=>{base.style.backgroundImage=`url('${s.src}')`;base.dataset.slide=String(index);caption.innerHTML=`<b>${s.label}</b><small>${s.kind}</small>`;dots.forEach((d,i)=>d.classList.toggle('active',i===index));requestAnimationFrame(()=>base.classList.remove('changing'))};probe.onerror=()=>{base.classList.remove('changing');if(next!==0)show(0)};probe.src=s.src}
 function start(){clearInterval(timer);if(!paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show(index+1),7500)}
 controls.querySelector('.prev').onclick=()=>{show(index-1);start()};controls.querySelector('.next').onclick=()=>{show(index+1);start()};dots.forEach(d=>d.onclick=()=>{show(Number(d.dataset.slide));start()});
 hero.addEventListener('pointerenter',()=>{paused=true;clearInterval(timer)});hero.addEventListener('pointerleave',()=>{paused=false;start()});hero.addEventListener('touchstart',e=>dragX=e.touches[0]?.clientX,{passive:true});hero.addEventListener('touchend',e=>{if(dragX==null)return;const dx=(e.changedTouches[0]?.clientX||dragX)-dragX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1));dragX=null;start()},{passive:true});start();
}
export{mountHeroSlideshow,slides};
