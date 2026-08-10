const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const HEROES=[
  {url:'./assets/generated/hero-aipan-girl.webp',weight:3,label:{en:'Almora · Aipan heritage',hi:'अल्मोड़ा · ऐपण विरासत',kfy:'अल्माड़ · ऐपण विरासत'}},
  {url:'./assets/hero-top.png',weight:1,label:{en:'Almora · Himalaya',hi:'अल्मोड़ा · हिमालय',kfy:'अल्माड़ · हिमाल'}},
  {url:'./assets/generated/hero-connected-almora.webp',weight:1,label:{en:'Connected Almora',hi:'जुड़ा हुआ अल्मोड़ा',kfy:'जुड़ अल्माड़'}},
  {url:'./assets/generated/hero-founder.webp',weight:1,label:{en:'Built for Almora',hi:'अल्मोड़ा के लिए',kfy:'अल्माड़ खातिर'}},
  {url:'./assets/generated/hero-aipan-sunrise.svg',weight:1,label:{en:'Almora sunrise',hi:'अल्मोड़ा की सुबह',kfy:'अल्माड़ बिहान'}},
  {url:'./assets/generated/almora-sunset.webp',weight:1,label:{en:'Almora golden hour',hi:'अल्मोड़ा की सुनहरी शाम',kfy:'अल्माड़ सुनौल बखत'}},
  {url:'./assets/generated/almora-twilight.webp',weight:1,label:{en:'Almora twilight',hi:'अल्मोड़ा की सांझ',kfy:'अल्माड़ संझ्याव'}}
];
const HERO_SEQUENCE=HEROES.flatMap((item)=>Array(item.weight||1).fill(item));
let heroIndex=0;

const copy={
  en:{local:'Live local desk',time:'Almora time',weather:'Live weather',important:'Important contacts',officials:'Key officials',media:'News & media directory',updated:'Official contacts checked 10 Aug 2026',disaster:'District Disaster Control Room',dm:'District Magistrate',ssp:'Senior Superintendent of Police',cdo:'Chief Development Officer',adm:'Additional District Magistrate',source:'Official district source',openDirectory:'Open full directory →',weatherUnavailable:'Live weather unavailable',aqi:'Air quality',sunrise:'Sunrise',sunset:'Sunset'},
  hi:{local:'लाइव स्थानीय डेस्क',time:'अल्मोड़ा समय',weather:'लाइव मौसम',important:'ज़रूरी संपर्क',officials:'प्रमुख अधिकारी',media:'समाचार व मीडिया डायरेक्टरी',updated:'आधिकारिक संपर्क 10 अगस्त 2026 को जाँचे गए',disaster:'जिला आपदा नियंत्रण कक्ष',dm:'जिलाधिकारी',ssp:'वरिष्ठ पुलिस अधीक्षक',cdo:'मुख्य विकास अधिकारी',adm:'अपर जिलाधिकारी',source:'आधिकारिक जिला स्रोत',openDirectory:'पूरी डायरेक्टरी खोलें →',weatherUnavailable:'लाइव मौसम उपलब्ध नहीं',aqi:'वायु गुणवत्ता',sunrise:'सूर्योदय',sunset:'सूर्यास्त'},
  kfy:{local:'लाइव स्थानीय डेस्क',time:'अल्माड़ को बखत',weather:'लाइव मौसम',important:'जरूरी संपर्क',officials:'मुख्य अधिकारी',media:'खबर अर मीडिया डायरेक्टरी',updated:'सरकारी संपर्क 10 अगस्त 2026 में जांच्या',disaster:'जिला आपदा कंट्रोल रूम',dm:'जिलाधिकारी',ssp:'वरिष्ठ पुलिस अधीक्षक',cdo:'मुख्य विकास अधिकारी',adm:'अपर जिलाधिकारी',source:'सरकारी जिला स्रोत',openDirectory:'पूरि डायरेक्टरी खोलौ →',weatherUnavailable:'लाइव मौसम नि मिलो',aqi:'हवा की गुणवत्ता',sunrise:'सूरज उगण',sunset:'सूरज डूबण'}
};

function lang(){return $('[data-lang].active')?.dataset.lang||document.documentElement.lang||'en'}
function tr(k){return copy[lang()]?.[k]||copy.en[k]||k}

function rotateHero(){
  const photo=$('.heroPhoto'); if(!photo)return;
  const item=HERO_SEQUENCE[heroIndex%HERO_SEQUENCE.length];
  const probe=new Image();
  probe.onload=()=>{photo.style.opacity='.25';setTimeout(()=>{photo.style.backgroundImage=`url("${item.url}")`;photo.style.opacity='1';const lab=$('#heroArtLabel');if(lab)lab.textContent=item.label[lang()]||item.label.en},160)};
  probe.onerror=()=>{};
  probe.src=item.url;
  heroIndex=(heroIndex+1)%HERO_SEQUENCE.length;
}

function tick(){
  const now=new Date();
  const time=new Intl.DateTimeFormat(lang()==='en'?'en-IN':'hi-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(now);
  const date=new Intl.DateTimeFormat(lang()==='en'?'en-IN':'hi-IN',{timeZone:'Asia/Kolkata',weekday:'short',day:'numeric',month:'short'}).format(now);
  if($('#liveClock'))$('#liveClock').textContent=time;
  if($('#liveDate'))$('#liveDate').textContent=date+' · IST';
}

async function liveWeather(){
  try{
    const [wr,ar]=await Promise.all([
      fetch('https://api.open-meteo.com/v1/forecast?latitude=29.5892&longitude=79.6467&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=Asia%2FKolkata&forecast_days=1'),
      fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=29.5892&longitude=79.6467&current=us_aqi&timezone=Asia%2FKolkata')
    ]);
    if(!wr.ok)throw new Error('weather');
    const w=await wr.json(); const a=ar.ok?await ar.json():null;
    const n=Math.round(w.current.temperature_2m);
    if($('#topTemp'))$('#topTemp').textContent=`${n}°C`;
    if($('#bigTemp'))$('#bigTemp').textContent=`${n}°C`;
    const sr=w.daily?.sunrise?.[0]?.split('T')[1]||'—'; const ss=w.daily?.sunset?.[0]?.split('T')[1]||'—';
    const sun=$$('.sunGrid b'); if(sun[0])sun[0].textContent=sr; if(sun[1])sun[1].textContent=ss;
    const aqi=a?.current?.us_aqi;
    if($('.aqi'))$('.aqi').textContent=Number.isFinite(aqi)?`AQI ${Math.round(aqi)} · live`:'AQI · live source unavailable';
    if($('#weatherLine'))$('#weatherLine').textContent=`${n}°C · ${tr('sunrise')} ${sr} · ${tr('sunset')} ${ss}`;
    if($('#aqiLine'))$('#aqiLine').textContent=Number.isFinite(aqi)?`${tr('aqi')}: ${Math.round(aqi)} (US AQI)`:tr('weatherUnavailable');
  }catch{
    if($('.aqi'))$('.aqi').textContent='AQI · unavailable';
    if($('#weatherLine'))$('#weatherLine').textContent=tr('weatherUnavailable');
  }
}

function localize(){
  $$('[data-local-key]').forEach(el=>{el.textContent=tr(el.dataset.localKey)});
  const item=HERO_SEQUENCE[(heroIndex+HERO_SEQUENCE.length-1)%HERO_SEQUENCE.length]; if($('#heroArtLabel'))$('#heroArtLabel').textContent=item.label[lang()]||item.label.en;
  tick();
}

document.addEventListener('DOMContentLoaded',()=>{
  localize(); tick(); liveWeather(); rotateHero();
  setInterval(tick,1000); setInterval(rotateHero,9000); setInterval(liveWeather,10*60*1000);
  window.addEventListener('almora:language',localize);
});
