const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const yt=q=>`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
const cultureSource='https://www.incredibleindia.gov.in/en/uttarakhand/almora';
const nandaSource='https://www.prod.incredibleindia.gov.in/content/incredible-india-v2/en/destinations/nainital/nanda-devi-mela.html';
const storyCards='https://ssa.uk.gov.in/forms/';
const items={
 music:[
  {icon:'🎶',name:'Bedu Pako',type:'Folk song tradition',desc:'One of the best-known songs associated with Kumaon and a gateway into the region’s modern folk-music identity.',listen:'Bedu Pako Kumaoni folk song'},
  {icon:'🪕',name:'Nyoli',type:'Folk singing form',desc:'A lyrical Kumaoni singing tradition often associated with longing, nature and mountain life.',listen:'Kumaoni Nyoli folk songs'},
  {icon:'🥁',name:'Hudkiya Bol',type:'Work-song tradition',desc:'Rhythmic singing associated with agricultural work and the hudka drum, linking music directly with community labour.',listen:'Hudkiya Bol Kumaoni'},
  {icon:'🌸',name:'Kumaoni Holi',type:'Seasonal singing',desc:'A rich sung Holi tradition with sitting and standing performance styles heard across Kumaon.',listen:'Kumaoni Baithaki Holi Khadi Holi'},
  {icon:'💃',name:'Jhora',type:'Group song + dance',desc:'A communal circular song-and-dance form performed at fairs, festivals and social gatherings.',listen:'Kumaoni Jhora folk dance song'},
  {icon:'🕺',name:'Chanchari',type:'Folk song + dance',desc:'A lively community performance tradition related to seasonal celebration and collective dance.',listen:'Kumaoni Chanchari folk song'},
  {icon:'🎤',name:'Chhapeli',type:'Duet tradition',desc:'A popular Kumaoni song-and-dance form traditionally performed as a male-female duet.',listen:'Kumaoni Chhapeli folk song'},
  {icon:'🪔',name:'Mangal',type:'Ceremonial songs',desc:'A family of auspicious songs connected with weddings and important life-cycle ceremonies.',listen:'Kumaoni Mangal geet'},
  {icon:'🌾',name:'Shakun Aakhar',type:'Ritual / auspicious singing',desc:'Traditional auspicious verses and songs used around ceremonies and important household occasions.',listen:'Kumaoni Shakun Aakhar'},
  {icon:'📖',name:'Rajula–Malushahi',type:'Oral epic / ballad',desc:'One of Kumaon’s enduring oral love epics, carried through storytelling, ballad singing and performance.',listen:'Rajula Malushahi Kumaoni folk ballad'}
 ],
 festivals:[
  {icon:'👑',name:'Nanda Devi Mela',type:'Almora festival',desc:'A major September celebration around Nanda Devi with procession, folk song, folk dance, craft and market life.',source:nandaSource},
  {icon:'🔥',name:'Almora Dussehra',type:'Town celebration',desc:'A distinctive Almora celebration known for its community-made effigies and lively public processions.',listen:'Almora Dussehra festival'},
  {icon:'🌱',name:'Harela',type:'Seasonal festival',desc:'A Kumaoni festival marking greenery, agricultural cycles and the monsoon season.',listen:'Harela festival Kumaon'},
  {icon:'🐦',name:'Ghughutiya / Kale Kauva',type:'Winter tradition',desc:'A Makar Sankranti-linked Kumaoni household tradition involving special sweets and calls to birds.',listen:'Ghughutiya Kale Kauva Kumaon'},
  {icon:'🎨',name:'Nanda Devi cultural performances',type:'Song + dance',desc:'Festival stages and neighbourhood gatherings are important spaces for folk songs, dance and local performers.',source:nandaSource}
 ],
 arts:[
  {icon:'🔴',name:'Aipan',type:'Ritual visual art',desc:'Geometric floor and wall designs created for auspicious occasions; a defining visual tradition of Kumaon.',listen:'Kumaoni Aipan art'},
  {icon:'🥁',name:'Hudka',type:'Instrument',desc:'A small hourglass drum strongly associated with Kumaoni folk performance and Hudkiya Bol.',listen:'Hudka Kumaoni instrument'},
  {icon:'📯',name:'Ransingha & local brass traditions',type:'Ceremonial instruments',desc:'Curved brass and other wind instruments feature in processions, ritual and mountain ceremonial music.',listen:'Kumaoni traditional instruments ransingha'},
  {icon:'🧺',name:'Ringal & local craft',type:'Handcraft',desc:'Bamboo and fibre craft traditions remain part of the wider Kumaoni material culture and local livelihoods.',listen:'Kumaon ringal craft'},
  {icon:'🎭',name:'Folk theatre & community stage',type:'Performance',desc:'Almora’s cultural history includes music, theatre and dance institutions, with figures such as Mohan Upreti and Uday Shankar closely associated with the town.',source:cultureSource}
 ],
 food:[
  {icon:'🍬',name:'Bal Mithai',type:'Almora sweet',desc:'A signature brown milk sweet coated with tiny sugar balls and strongly associated with Almora.',listen:'Almora Bal Mithai'},
  {icon:'🌿',name:'Singauri',type:'Traditional sweet',desc:'A milk-based sweet traditionally wrapped in maalu leaves and closely associated with Kumaon.',listen:'Singauri Almora Kumaon'},
  {icon:'🥔',name:'Aloo ke Gutke',type:'Kumaoni food',desc:'Spiced potatoes commonly served as a simple and recognisable Kumaoni snack or side dish.',listen:'Kumaoni Aloo ke Gutke'},
  {icon:'🫘',name:'Bhatt ki Churkani',type:'Kumaoni food',desc:'A traditional black-soybean preparation found across Kumaoni homes and kitchens.',listen:'Bhatt ki Churkani Kumaoni'},
  {icon:'🌾',name:'Madua & mountain grains',type:'Everyday food heritage',desc:'Finger millet and other hill grains remain central to resilient mountain food traditions.',listen:'Kumaoni madua food'}
 ],
 stories:[
  {icon:'📚',name:'Kumaoni story cards',type:'Language + children',desc:'Uttarakhand Samagra Shiksha publishes Kumaoni local-language story cards that can support reading and language preservation.',source:storyCards},
  {icon:'🏔️',name:'Mountain oral history',type:'Memory',desc:'Songs, sayings, place stories, migration memories and family histories are living cultural records worth preserving with consent.',listen:'Kumaoni oral history folk stories'},
  {icon:'🎼',name:'Mohan Upreti legacy',type:'Music + theatre',desc:'Singer, composer and theatre personality strongly associated with Kumaoni folk music and Almora’s modern cultural life.',listen:'Mohan Upreti Kumaoni songs'},
  {icon:'💃',name:'Uday Shankar legacy',type:'Dance',desc:'Almora is associated with Uday Shankar’s pioneering dance centre and remains home to the Uday Shankar Academy of Music and Dance.',source:cultureSource}
 ]
};
const labels={en:{eyebrow:'KUMAONI CULTURE LIBRARY',title:'Hear, see and remember Kumaon.',intro:'A growing cultural library for songs, dance, festivals, food, art, instruments and oral memory. We link to listening sources rather than copying lyrics.',tabs:['Songs & music','Festivals','Art & instruments','Food','Stories'],listen:'Listen / search ↗',learn:'Learn more ↗',note:'This is a growing archive, not a claim to contain every song or tradition. Local artists, elders and cultural organisations should be able to suggest additions and corrections.'},hi:{eyebrow:'कुमाऊँनी संस्कृति',title:'कुमाऊँ को सुनिए, देखिए और याद रखिए।',intro:'लोकगीत, नृत्य, मेले, भोजन, कला, वाद्य और मौखिक परंपराओं की बढ़ती हुई सांस्कृतिक लाइब्रेरी। गीतों के बोल कॉपी करने के बजाय हम सुनने के स्रोत देते हैं।',tabs:['गीत और संगीत','मेले-त्योहार','कला और वाद्य','भोजन','कहानियाँ'],listen:'सुनें / खोजें ↗',learn:'और जानें ↗',note:'यह एक बढ़ता हुआ संग्रह है, हर गीत या परंपरा की पूर्ण सूची होने का दावा नहीं। स्थानीय कलाकार, बुज़ुर्ग और सांस्कृतिक संस्थाएँ इसमें सुधार और नई चीज़ें जोड़ सकेंगी।'},kfy:{eyebrow:'कुमाऊँनी संस्कार अर संस्कृति',title:'कुमाऊँ लै सुणौ, देखौ अर याद राखौ।',intro:'लोकगीत, नाच, कौतिक, खान-पान, कला, बाजा अर लोक-कथा को बढ़त संग्रह। गीतन का बोल नकल नि करां, सुणण-बूझण का स्रोत दियां।',tabs:['गीत-संगीत','कौतिक-त्यार','कला-बाजा','खाण-पिण','कथा-किस्सा'],listen:'सुणौ / खोजौ ↗',learn:'और जाणौ ↗',note:'यो बढ़त संग्रह छ, हर गीत अर परंपरा की पूरी सूची बताण को दावा नै। स्थानीय कलाकार, बुजुर्ग अर संस्था सुधार अर नई चीज जोड़ सकनी।'}};
const sec=document.createElement('section');sec.id='kumaoni-culture';sec.className='section cultureLibrary';sec.innerHTML=`<div class="sectionHead"><div><span id="cultureEyebrow">KUMAONI CULTURE LIBRARY</span><h2 id="cultureTitle">Hear, see and remember Kumaon.</h2><p class="cultureIntro" id="cultureIntro"></p></div></div><div class="cultureNav" id="cultureNav"></div><div class="heritageGrid" id="heritageGrid"></div><div class="cultureNote" id="cultureNote"></div>`;
(document.querySelector('#culture')||document.querySelector('#services'))?.parentNode?.insertBefore(sec,document.querySelector('#culture')||document.querySelector('#services'));
let tab='music';
function lang(){return localStorage.getItem('almoraLang')||'en'}
function render(){const l=labels[lang()]||labels.en;$('#cultureEyebrow').textContent=l.eyebrow;$('#cultureTitle').textContent=l.title;$('#cultureIntro').textContent=l.intro;$('#cultureNote').textContent=l.note;const keys=['music','festivals','arts','food','stories'];$('#cultureNav').innerHTML=keys.map((k,i)=>`<button class="${k===tab?'active':''}" data-cultural-tab="${k}">${l.tabs[i]}</button>`).join('');$('#heritageGrid').innerHTML=items[tab].map(x=>`<article class="heritageCard"><div class="heritageVisual"><span>${x.icon}</span></div><div class="heritageBody"><small>${x.type}</small><h3>${x.name}</h3><p>${x.desc}</p><div class="heritageActions">${x.listen?`<a class="primary" href="${yt(x.listen)}" target="_blank" rel="noopener">${l.listen}</a>`:''}${x.source?`<a href="${x.source}" target="_blank" rel="noopener">${l.learn}</a>`:''}</div></div></article>`).join('')}
$('#cultureNav').addEventListener('click',e=>{const b=e.target.closest('[data-cultural-tab]');if(!b)return;tab=b.dataset.culturalTab;render()});
window.addEventListener('almora:language',render);render();
