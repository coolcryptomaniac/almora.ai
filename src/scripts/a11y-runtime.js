const $=(s,r=document)=>r.querySelector(s);
const copy={
  en:{header:'Ask Almora AI',ask:'Ask Almora AI a question',report:'Report or suggest something'},
  hi:{header:'अल्मोड़ा AI से पूछें',ask:'अल्मोड़ा AI से प्रश्न पूछें',report:'रिपोर्ट या सुझाव दें'},
  kfy:{header:'अल्माड़ AI स्यूं पूछौ',ask:'अल्माड़ AI स्यूं सवाल पूछौ',report:'रिपोर्ट या सुझाव द्यौ'}
};
function language(){return $('[data-lang].active')?.dataset.lang||localStorage.getItem('almoraLang')||document.documentElement.lang||'en'}
function apply(){const text=copy[language()]||copy.en;const header=$('#headerQuery'),ask=$('#askInput'),dialog=$('#reportDialog'),title=dialog?.querySelector('.reportHead h2'),status=$('#reportStatus');if(header)header.setAttribute('aria-label',text.header);if(ask)ask.setAttribute('aria-label',text.ask);if(dialog&&title){if(!title.id)title.id='reportDialogTitle';dialog.setAttribute('aria-labelledby',title.id)}if(status){status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true')}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('almora:language',apply);
