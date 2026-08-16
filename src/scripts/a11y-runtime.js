const $=(s,r=document)=>r.querySelector(s);
const copy={
  en:{header:'Ask Almora AI',ask:'Ask Almora AI a question',report:'Report or suggest something',menu:'Menu',openMenu:'Open navigation menu',voice:'Voice input',profile:'Profile',submit:'Ask Almora AI',closeResults:'Close AI results',closeDialog:'Close report dialog'},
  hi:{header:'अल्मोड़ा AI से पूछें',ask:'अल्मोड़ा AI से प्रश्न पूछें',report:'रिपोर्ट या सुझाव दें',menu:'मेन्यू',openMenu:'नेविगेशन मेन्यू खोलें',voice:'आवाज़ से पूछें',profile:'प्रोफ़ाइल',submit:'अल्मोड़ा AI से पूछें',closeResults:'AI परिणाम बंद करें',closeDialog:'रिपोर्ट डायलॉग बंद करें'},
  kfy:{header:'अल्माड़ AI स्यूं पूछौ',ask:'अल्माड़ AI स्यूं सवाल पूछौ',report:'रिपोर्ट या सुझाव द्यौ',menu:'मेन्यू',openMenu:'नेविगेशन मेन्यू खोलौ',voice:'आवाज स्यूं पूछौ',profile:'प्रोफाइल',submit:'अल्माड़ AI स्यूं पूछौ',closeResults:'AI नतीजा बंद करौ',closeDialog:'रिपोर्ट डायलॉग बंद करौ'}
};
function language(){return $('[data-lang].active')?.dataset.lang||localStorage.getItem('almoraLang')||document.documentElement.lang||'en'}
function apply(){
  const text=copy[language()]||copy.en;
  const header=$('#headerQuery'),ask=$('#askInput'),dialog=$('#reportDialog'),title=dialog?.querySelector('.reportHead h2'),status=$('#reportStatus');
  if(header)header.setAttribute('aria-label',text.header);
  if(ask)ask.setAttribute('aria-label',text.ask);
  const labels=[
    ['#menuBtn',text.menu],
    ['#mobileMenu',text.openMenu],
    ['.topSearch button',text.voice],
    ['#profileLink',text.profile],
    ['#askSubmit',text.submit],
    ['#closeResults',text.closeResults],
    ['#reportDialog .reportHead button',text.closeDialog]
  ];
  labels.forEach(([selector,label])=>$(selector)?.setAttribute('aria-label',label));
  if(dialog&&title){if(!title.id)title.id='reportDialogTitle';dialog.setAttribute('aria-labelledby',title.id)}
  if(status){status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('almora:language',apply);
