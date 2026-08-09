const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const translations={
en:{
"nav.everyday":"Everyday","nav.home":"Home","nav.now":"Almora Now","nav.transport":"Transport","nav.health":"Health & wellness","nav.directory":"Market & directory","nav.opportunity":"Opportunity","nav.jobs":"Jobs & skills","nav.business":"Business hub","nav.education":"Education","nav.farming":"Farming & wildlife","nav.explore":"Culture & explore","nav.culture":"Culture & songs","nav.tourism":"Tourism & treks","nav.sports":"Sports & fitness","nav.events":"Events & festivals","nav.civic":"Civic & safety","nav.civicHelp":"Local services","nav.safety":"Safety & alerts","nav.map":"Maps & places",
"access.title":"Access","access.citizen":"Citizen","access.citizenSub":"Profile, jobs & local help","access.business":"Business","access.businessSub":"List, hire & connect","access.localAdmin":"Local administration","access.localAdminSub":"Verified staff access","access.choose":"Choose your role.",
"action.report":"Report / suggest","action.reportShort":"Report","location.almora":"Almora, Uttarakhand",
"hero.eyebrow":"ALMORA · SMART · LOCAL · HUMAN","hero.title":"What can Almora help you with?","hero.subtitle":"One beautiful place for local help, travel, jobs, culture, health, businesses and everyday life.","hero.placeholder":"Ask Almora AI anything…","hero.ask":"Ask AI",
"quick.hospital":"Hospital","quick.transport":"Transport","quick.jobs":"Jobs","quick.culture":"Culture","quick.wildlife":"Wildlife","quick.explore":"Explore",
"today.title":"ALMORA TODAY","today.clear":"Clear sky","today.good":"Good","today.sunrise":"Sunrise","today.sunset":"Sunset","today.updates":"Live updates","today.roads":"Roads: check before long hill travel","today.weather":"Weather: live","today.help":"Town help: available",
"services.issue":"Report an issue","services.issueSub":"Road, waste, wildlife, service","services.jobs":"Jobs near you","services.jobsSub":"Local work & skills","services.health":"Health","services.healthSub":"Hospitals & navigation","services.move":"Move","services.moveSub":"Bus, taxi, walk, drive","services.explore":"Explore","services.exploreSub":"Places, temples & trails",
"news.kicker":"ALMORA NOW","news.title":"Important news. No noise.","news.subtitle":"Innovation, jobs, policy, infrastructure, education and major local developments.","news.all":"Top stories","news.innovation":"Innovation","news.jobs":"Jobs","news.policy":"Policy","news.sports":"Sports",
"places.kicker":"EXPERIENCE ALMORA","places.title":"Places worth stepping into.",
"culture.kicker":"KUMAONI CULTURE","culture.title":"Listen to the mountains.","culture.subtitle":"Songs, stories, festivals, food, craft and living traditions of Kumaon.","radio.title":"KUMAONI RADIO","radio.subtitle":"Curated cultural listening","radio.more":"Explore more music ↗","culture.festivals":"Festivals","culture.festivalsSub":"Nanda Devi, Harela, Dussehra and local fairs.","culture.aipan":"Aipan & craft","culture.aipanSub":"Living visual traditions and local making.","culture.food":"Food","culture.foodSub":"Bal Mithai, Singauri, Bhatt, Madua and more.","culture.stories":"Stories","culture.storiesSub":"Oral histories, legends and community memory.",
"sports.kicker":"SPORTS & FITNESS","sports.title":"Train where champions began.","sports.lakshya":"Olympian and world-class badminton player born in Almora.","sports.ekta":"India cricketer and one of Uttarakhand's pioneering international players.","sports.tripti":"Distinguished public-service leader from Almora.",
"directory.kicker":"LOCAL DIRECTORY","directory.title":"Find what matters.","directory.placeholder":"Search hospitals, gyms, offices, shops…","transport.kicker":"MOVE AROUND","transport.title":"Choose how you want to go.","transport.bus":"Bus","transport.taxi":"Taxi","transport.walk":"Walk","transport.drive":"Drive",
"map.kicker":"ALMORA MAP","map.title":"See the town spatially.","map.overlay":"Almora town map","map.open":"Open full map ↗",
"agents.kicker":"WORKING FOR YOU","agents.title":"Local helpers behind the scenes.","agents.subtitle":"Specialised assistants route questions to the right local workflow.","agents.road":"Road & transport","agents.health":"Health","agents.jobs":"Jobs & skills","agents.education":"Education","agents.farm":"Farm & wildlife","agents.tourism":"Tourism","agents.safety":"Safety","agents.local":"Local services",
"footer.line":"Smart local help. Kumaoni heart.","common.viewAll":"View all →",
"dock.home":"Home","dock.now":"Now","dock.map":"Map","dock.more":"More",
"report.kicker":"HELP IMPROVE ALMORA","report.title":"Report or suggest something.","report.road":"Road","report.wildlife":"Wildlife","report.transport":"Transport","report.health":"Health","report.waste":"Waste","report.other":"Other","report.location":"Area or landmark","report.locationPlaceholder":"e.g. Dharanaula, Khatyari…","report.details":"What happened?","report.detailsPlaceholder":"Describe the issue or suggestion…","report.privacy":"Please do not add Aadhaar numbers, medical records or unnecessary personal details.","report.submit":"Save report"
},
hi:{
"nav.everyday":"रोज़मर्रा","nav.home":"होम","nav.now":"अल्मोड़ा अभी","nav.transport":"यातायात","nav.health":"स्वास्थ्य","nav.directory":"बाज़ार व डायरेक्टरी","nav.opportunity":"अवसर","nav.jobs":"रोज़गार व कौशल","nav.business":"व्यवसाय","nav.education":"शिक्षा","nav.farming":"खेती व वन्यजीव","nav.explore":"संस्कृति व घूमना","nav.culture":"संस्कृति व गीत","nav.tourism":"पर्यटन व ट्रेक","nav.sports":"खेल व फिटनेस","nav.events":"कार्यक्रम व मेले","nav.civic":"स्थानीय सेवाएँ","nav.civicHelp":"शहर की सेवाएँ","nav.safety":"सुरक्षा व अलर्ट","nav.map":"नक्शा व स्थान",
"access.title":"लॉगिन","access.citizen":"नागरिक","access.citizenSub":"प्रोफ़ाइल, रोज़गार व स्थानीय मदद","access.business":"व्यवसाय","access.businessSub":"लिस्ट करें, भर्ती करें, जुड़ें","access.localAdmin":"स्थानीय प्रशासन","access.localAdminSub":"सत्यापित स्टाफ प्रवेश","access.choose":"अपनी भूमिका चुनें।",
"action.report":"रिपोर्ट / सुझाव","action.reportShort":"रिपोर्ट","location.almora":"अल्मोड़ा, उत्तराखण्ड",
"hero.eyebrow":"अल्मोड़ा · स्मार्ट · स्थानीय · मानवीय","hero.title":"अल्मोड़ा आपकी कैसे मदद कर सकता है?","hero.subtitle":"स्थानीय मदद, यात्रा, रोज़गार, संस्कृति, स्वास्थ्य, व्यवसाय और रोज़मर्रा की ज़िंदगी — सब एक खूबसूरत जगह।","hero.placeholder":"अल्मोड़ा के बारे में कुछ भी पूछें…","hero.ask":"AI से पूछें",
"quick.hospital":"अस्पताल","quick.transport":"यातायात","quick.jobs":"रोज़गार","quick.culture":"संस्कृति","quick.wildlife":"वन्यजीव","quick.explore":"घूमें",
"today.title":"आज का अल्मोड़ा","today.clear":"साफ़ मौसम","today.good":"अच्छा","today.sunrise":"सूर्योदय","today.sunset":"सूर्यास्त","today.updates":"ताज़ा अपडेट","today.roads":"लंबी पहाड़ी यात्रा से पहले सड़क जाँचें","today.weather":"मौसम: लाइव","today.help":"स्थानीय मदद: उपलब्ध",
"services.issue":"समस्या बताएँ","services.issueSub":"सड़क, कचरा, वन्यजीव, सेवा","services.jobs":"पास के रोज़गार","services.jobsSub":"स्थानीय काम व कौशल","services.health":"स्वास्थ्य","services.healthSub":"अस्पताल व रास्ता","services.move":"यात्रा","services.moveSub":"बस, टैक्सी, पैदल, गाड़ी","services.explore":"घूमें","services.exploreSub":"स्थान, मंदिर व ट्रेल",
"news.kicker":"अल्मोड़ा अभी","news.title":"ज़रूरी खबरें। बिना शोर के।","news.subtitle":"नवाचार, रोज़गार, नीति, बुनियादी ढाँचा, शिक्षा और बड़ी स्थानीय खबरें।","news.all":"मुख्य खबरें","news.innovation":"नवाचार","news.jobs":"रोज़गार","news.policy":"नीति","news.sports":"खेल",
"places.kicker":"अल्मोड़ा का अनुभव","places.title":"वे जगहें जहाँ जाना बनता है।",
"culture.kicker":"कुमाऊँनी संस्कृति","culture.title":"पहाड़ों को सुनिए।","culture.subtitle":"कुमाऊँ के गीत, कहानियाँ, त्योहार, भोजन, कला और जीवित परंपराएँ।","radio.title":"कुमाऊँनी रेडियो","radio.subtitle":"चुना हुआ सांस्कृतिक संगीत","radio.more":"और संगीत सुनें ↗","culture.festivals":"त्योहार","culture.festivalsSub":"नंदा देवी, हरेला, दशहरा और स्थानीय मेले।","culture.aipan":"ऐपण व शिल्प","culture.aipanSub":"जीवित दृश्य परंपराएँ और स्थानीय कारीगरी।","culture.food":"भोजन","culture.foodSub":"बाल मिठाई, सिंगौरी, भट्ट, मडुआ और बहुत कुछ।","culture.stories":"कहानियाँ","culture.storiesSub":"लोककथाएँ, स्मृतियाँ और मौखिक इतिहास।",
"sports.kicker":"खेल व फिटनेस","sports.title":"जहाँ चैंपियन शुरू हुए, वहीं से ट्रेन करें।","sports.lakshya":"अल्मोड़ा में जन्मे ओलंपियन और विश्व स्तरीय बैडमिंटन खिलाड़ी।","sports.ekta":"भारत की क्रिकेटर और उत्तराखण्ड की अग्रणी अंतरराष्ट्रीय खिलाड़ियों में से एक।","sports.tripti":"अल्मोड़ा से प्रतिष्ठित सार्वजनिक सेवा नेतृत्व।",
"directory.kicker":"स्थानीय डायरेक्टरी","directory.title":"ज़रूरी चीज़ जल्दी खोजें।","directory.placeholder":"अस्पताल, जिम, दफ्तर, दुकान खोजें…","transport.kicker":"आना-जाना","transport.title":"अपना सफर चुनें।","transport.bus":"बस","transport.taxi":"टैक्सी","transport.walk":"पैदल","transport.drive":"गाड़ी",
"map.kicker":"अल्मोड़ा नक्शा","map.title":"नक्शे पर शहर देखें।","map.overlay":"अल्मोड़ा शहर का नक्शा","map.open":"पूरा नक्शा खोलें ↗",
"agents.kicker":"आपके लिए काम कर रहे","agents.title":"पीछे काम करते स्थानीय सहायक।","agents.subtitle":"विशेष सहायक आपकी बात को सही स्थानीय सेवा तक पहुँचाते हैं।","agents.road":"सड़क व यातायात","agents.health":"स्वास्थ्य","agents.jobs":"रोज़गार व कौशल","agents.education":"शिक्षा","agents.farm":"खेती व वन्यजीव","agents.tourism":"पर्यटन","agents.safety":"सुरक्षा","agents.local":"स्थानीय सेवाएँ",
"footer.line":"स्मार्ट स्थानीय मदद। कुमाऊँनी दिल।","common.viewAll":"सब देखें →",
"dock.home":"होम","dock.now":"अभी","dock.map":"नक्शा","dock.more":"और",
"report.kicker":"अल्मोड़ा बेहतर बनाइए","report.title":"रिपोर्ट या सुझाव दें।","report.road":"सड़क","report.wildlife":"वन्यजीव","report.transport":"यातायात","report.health":"स्वास्थ्य","report.waste":"कचरा","report.other":"अन्य","report.location":"क्षेत्र या पहचान","report.locationPlaceholder":"जैसे धारानौला, खत्याड़ी…","report.details":"क्या हुआ?","report.detailsPlaceholder":"समस्या या सुझाव लिखें…","report.privacy":"कृपया आधार नंबर, मेडिकल रिकॉर्ड या अनावश्यक निजी जानकारी न लिखें।","report.submit":"रिपोर्ट सेव करें"
},
kfy:{
"nav.everyday":"रोज का काम","nav.home":"घर","nav.now":"अल्माड़ अभी","nav.transport":"सफर","nav.health":"इलाज-स्वास्थ्य","nav.directory":"बजार अर ठौर","nav.opportunity":"मौका","nav.jobs":"रोजगार अर हुनर","nav.business":"कारोबार","nav.education":"पढ़ाई","nav.farming":"खेती अर जंगली जानवर","nav.explore":"संस्कृति अर घूमण","nav.culture":"संस्कृति अर गीत","nav.tourism":"घूमण-फिरण","nav.sports":"खेल अर फिटनेस","nav.events":"मेळा अर कार्यक्रम","nav.civic":"नगर सेवा","nav.civicHelp":"स्थानीय मदद","nav.safety":"सुरक्षा अर खबर","nav.map":"नक्शा अर ठौर",
"access.title":"पहचान","access.citizen":"निवासी","access.citizenSub":"प्रोफाइल, रोजगार अर स्थानीय मदद","access.business":"कारोबार","access.businessSub":"दुकान जोड़ौ, काम द्यौ","access.localAdmin":"स्थानीय प्रशासन","access.localAdminSub":"सत्यापित कर्मचारी प्रवेश","access.choose":"अपणो रूप चुनौ।",
"action.report":"दिक्कत / सुझाव","action.reportShort":"बतौ","location.almora":"अल्माड़, उत्तराखण्ड",
"hero.eyebrow":"अल्माड़ · स्मार्ट · स्थानीय · हमार","hero.title":"अल्माड़ कसिक मदद कर सकूं?","hero.subtitle":"स्थानीय मदद, सफर, रोजगार, संस्कृति, इलाज, कारोबार अर रोजमर्रा की जिंदगी — सब एकै ठौर।","hero.placeholder":"अल्माड़ का बारे में कै बात पुछौ…","hero.ask":"AI लै पुछौ",
"quick.hospital":"अस्पताल","quick.transport":"सफर","quick.jobs":"रोजगार","quick.culture":"संस्कृति","quick.wildlife":"जंगली जानवर","quick.explore":"घूमौ",
"today.title":"आज को अल्माड़","today.clear":"साफ मौसम","today.good":"ठीक","today.sunrise":"सूरज उगण","today.sunset":"सूरज डूबण","today.updates":"ताजा खबर","today.roads":"लाम सफर पैल सड़क देख लियो","today.weather":"मौसम: लाइव","today.help":"स्थानीय मदद: मिलि रै",
"services.issue":"दिक्कत बतौ","services.issueSub":"सड़क, कूड़, जानवर, सेवा","services.jobs":"नजदीक रोजगार","services.jobsSub":"स्थानीय काम अर हुनर","services.health":"इलाज","services.healthSub":"अस्पताल अर रास्तो","services.move":"सफर","services.moveSub":"बस, टैक्सी, पैदल, गाड़ी","services.explore":"घूमौ","services.exploreSub":"ठौर, मंदिर अर बाट",
"news.kicker":"अल्माड़ अभी","news.title":"जरूरी खबर। फालतू शोर बिना।","news.subtitle":"नई खोज, रोजगार, नीति, सड़क-सुविधा, पढ़ाई अर बड़ी स्थानीय बात।","news.all":"मुख्य खबर","news.innovation":"नई खोज","news.jobs":"रोजगार","news.policy":"नीति","news.sports":"खेल",
"places.kicker":"अल्माड़ देखौ","places.title":"जां जरूर जाणा चाही।",
"culture.kicker":"कुमाऊँनी संस्कृति","culture.title":"पहाड़न लै सुनौ।","culture.subtitle":"कुमाऊँ का गीत, कथा, त्योहार, खान-पान, कला अर जिंदा परंपरा।","radio.title":"कुमाऊँनी रेडियो","radio.subtitle":"चुना हुआ लोक संगीत","radio.more":"और गीत सुनौ ↗","culture.festivals":"त्योहार","culture.festivalsSub":"नंदा देवी, हरेला, दशहरा अर स्थानीय मेळा।","culture.aipan":"ऐपण अर शिल्प","culture.aipanSub":"हमर दृश्य परंपरा अर स्थानीय कारीगरी।","culture.food":"खाण-पिण","culture.foodSub":"बाल मिठाई, सिंगौरी, भट्ट, मडुवा अर भौत कुछ।","culture.stories":"कथा","culture.storiesSub":"लोककथा, याद अर पुराणि बात।",
"sports.kicker":"खेल अर फिटनेस","sports.title":"जां चैंपियन शुरू भया, वैं खेलौ।","sports.lakshya":"अल्माड़ में जन्म्या ओलंपियन अर विश्व स्तर का बैडमिंटन खिलाड़ी।","sports.ekta":"भारत की क्रिकेट खिलाड़ी अर उत्तराखण्ड की अग्रणी खिलाड़ी।","sports.tripti":"अल्माड़ की प्रतिष्ठित लोक सेवा हस्ती।",
"directory.kicker":"स्थानीय ठौर","directory.title":"जरूरी चीज जल्दी खोजौ।","directory.placeholder":"अस्पताल, जिम, दफ्तर, दुकान खोजौ…","transport.kicker":"सफर","transport.title":"कसिक जाणा छ, चुनौ।","transport.bus":"बस","transport.taxi":"टैक्सी","transport.walk":"पैदल","transport.drive":"गाड़ी",
"map.kicker":"अल्माड़ नक्शा","map.title":"नक्शा में नगर देखौ।","map.overlay":"अल्माड़ नगर को नक्शा","map.open":"पूरो नक्शा खोलौ ↗",
"agents.kicker":"तुमर खातिर काम में","agents.title":"पीछे काम करण स्थानीय सहायक।","agents.subtitle":"अलग-अलग सहायक बात सही सेवा तक लै जांछ।","agents.road":"सड़क अर सफर","agents.health":"इलाज","agents.jobs":"रोजगार अर हुनर","agents.education":"पढ़ाई","agents.farm":"खेती अर जानवर","agents.tourism":"घूमण","agents.safety":"सुरक्षा","agents.local":"स्थानीय सेवा",
"footer.line":"स्मार्ट स्थानीय मदद। कुमाऊँनी दिल।","common.viewAll":"सब देखौ →",
"dock.home":"घर","dock.now":"अभी","dock.map":"नक्शा","dock.more":"और",
"report.kicker":"अल्माड़ भल बनौ","report.title":"दिक्कत या सुझाव बतौ।","report.road":"सड़क","report.wildlife":"जंगली जानवर","report.transport":"सफर","report.health":"इलाज","report.waste":"कूड़","report.other":"और","report.location":"ठौर या निशान","report.locationPlaceholder":"जै धारानौला, खत्याड़ी…","report.details":"कै भै?","report.detailsPlaceholder":"दिक्कत या सुझाव लिखौ…","report.privacy":"आधार नंबर, मेडिकल कागज या बेकार निजी जानकारी न लिखौ।","report.submit":"रिपोर्ट बचौ"
}
};

const news=[
{cat:"innovation",date:"8 Aug 2026",title:"Almora innovation takes to the sky",body:"A local electric aerial-vehicle prototype put Almora innovation in the national spotlight.",source:"Economic Times",url:"https://economictimes.indiatimes.com/news/new-updates/this-uttarakhand-youth-built-a-flying-car-watch-it-take-off-in-almora/articleshow/133027113.cms",featured:true},
{cat:"jobs",date:"Aug 2026",title:"New Uttarakhand recruitment opportunities",body:"Official recruitment notices remain one of the highest-value updates for local job seekers.",source:"UKSSSC",url:"https://sssc.uk.gov.in/"},
{cat:"policy",date:"Aug 2026",title:"Long-term Uttarakhand development roadmap",body:"Infrastructure, education, clean energy, tourism and public services shape the next phase of hill development.",source:"State updates",url:"https://uk.gov.in/"}
];
const places=[
["Kasar Devi","https://s7ap1.scene7.com/is/image/incredibleindia/2-kasar-devi-temple-almorah-uttarakhand-attr-hero?qlt=82&ts=1726646942358"],
["Jageshwar Dham","https://s7ap1.scene7.com/is/image/incredibleindia/2-jageshwar-temple-almorah-uttarakhand-attr-hero?qlt=82&ts=1726646689920"],
["Binsar Wildlife","https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=72"],
["Bright End Corner","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=72"],
["Ranikhet","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=700&q=72"],
["Zero Point","https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=700&q=72"]
];
const radio=[
["♫","Bedu Pako","Kumaoni folk tradition","https://www.youtube.com/results?search_query=Bedu+Pako+Kumaoni"],
["◉","Nyoli","Traditional Kumaoni singing","https://www.youtube.com/results?search_query=Kumaoni+Nyoli"],
["♬","Hudkiya Bol","Work-song tradition","https://www.youtube.com/results?search_query=Hudkiya+Bol+Kumaoni"],
["✦","Jhora / Chanchari","Community song & dance","https://www.youtube.com/results?search_query=Kumaoni+Jhora+Chanchari"]
];
const directory=[
["District Hospital Almora","Health","https://www.google.com/maps/search/?api=1&query=District+Hospital+Almora"],
["H.N. Bahuguna Stadium","Sports","https://www.google.com/maps/search/?api=1&query=H.N.+Bahuguna+Stadium+Almora"],
["Almora Bus Station","Transport","https://www.google.com/maps/search/?api=1&query=Almora+Bus+Station"],
["Lala Bazaar","Market","https://www.google.com/maps/search/?api=1&query=Lala+Bazaar+Almora"],
["Kasar Devi","Culture","https://www.google.com/maps/search/?api=1&query=Kasar+Devi+Almora"]
];

function renderNews(filter="all"){
 const root=$("#newsGrid"); if(!root)return;
 root.innerHTML=news.filter(n=>filter==="all"||n.cat===filter).map(n=>`<article class="newsCard ${n.featured?"featured":""}"><div class="meta"><span>${n.cat}</span><span>${n.date}</span></div><h3>${n.title}</h3><p>${n.body}</p><a href="${n.url}" target="_blank" rel="noopener">Read at ${n.source} ↗</a></article>`).join("");
}
function renderPlaces(){ $("#placeRail").innerHTML=places.map(p=>`<a class="placeCard" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p[0]+" Almora")}" target="_blank"><img src="${p[1]}" loading="lazy" decoding="async" alt="${p[0]}"><b>${p[0]}</b></a>`).join("")}
function renderRadio(){ $("#radioList").innerHTML=radio.map(r=>`<div class="radioTrack"><span>${r[0]}</span><div><b>${r[1]}</b><small>${r[2]}</small></div><a href="${r[3]}" target="_blank" rel="noopener" aria-label="Listen to ${r[1]}">▶</a></div>`).join("")}
function renderDirectory(q=""){
 const rows=directory.filter(x=>`${x[0]} ${x[1]}`.toLowerCase().includes(q.toLowerCase()));
 $("#directoryMini").innerHTML=rows.map(x=>`<a href="${x[2]}" target="_blank"><span><b>${x[0]}</b><br><small>${x[1]}</small></span><span>↗</span></a>`).join("") || "<small>No match yet — ask Almora AI.</small>";
}

let lang=localStorage.getItem("almoraLang")||"en";
function applyLang(){
 const t=translations[lang]||translations.en;
 $$("[data-i18n]").forEach(el=>{const v=t[el.dataset.i18n];if(v)el.textContent=v});
 $$("[data-i18n-placeholder]").forEach(el=>{const v=t[el.dataset.i18nPlaceholder];if(v)el.placeholder=v});
 $("#langSwitch").textContent=lang==="en"?"EN":lang==="hi"?"हिं":"कुम";
 document.documentElement.lang=lang==="kfy"?"kfy":lang;
}
$("#langSwitch").onclick=()=>{const order=["en","hi","kfy"];lang=order[(order.indexOf(lang)+1)%3];localStorage.setItem("almoraLang",lang);applyLang()};

let theme=localStorage.getItem("almoraTheme")||"modern";
function applyTheme(){document.documentElement.dataset.theme=theme;$("#themeSwitch b").textContent=theme==="modern"?"Modern":"Heritage";localStorage.setItem("almoraTheme",theme)}
$("#themeSwitch").onclick=()=>{theme=theme==="modern"?"heritage":"modern";applyTheme()};

function openSide(){ $("#sideNav").classList.add("open"); document.body.style.overflow="hidden" }
function closeSide(){ $("#sideNav").classList.remove("open"); document.body.style.overflow="" }
$("#hamburger").onclick=openSide;$("#mobileMore").onclick=openSide;$("#sideClose").onclick=closeSide;
$$(".sideNav a").forEach(a=>a.onclick=()=>{if(innerWidth<861)closeSide()});

$$("[data-focus-ai]").forEach(b=>b.onclick=()=>{scrollTo({top:0,behavior:"smooth"});setTimeout(()=>$("#prompt").focus(),350)});
$("#topPrompt").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("#prompt").value=e.currentTarget.value;askAI()}});
$$("[data-q]").forEach(b=>b.onclick=()=>{const q=b.dataset.q;$("#prompt").value=q;askAI()});
$("#ask").onclick=askAI;
$("#prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();askAI()}});

function askAI(){
 const q=$("#prompt").value.trim(); if(!q)return;
 const a=$("#answer");a.hidden=false;
 const l=lang;
 let msg;
 if(/job|काम|रोजगार/i.test(q)) msg=l==="hi"?"मैं आपको स्थानीय नौकरियों, कौशल और आधिकारिक भर्ती स्रोतों तक पहुँचाने में मदद कर सकता हूँ।":l==="kfy"?"मैं स्थानीय रोजगार, हुनर अर भर्ती की जानकारी तक लै जां सकूं।":"I can help you find local jobs, skills and official recruitment sources.";
 else if(/hospital|health|doctor|अस्पताल|इलाज/i.test(q)) msg=l==="hi"?"मैं पास के स्वास्थ्य केंद्र, अस्पताल और वहाँ पहुँचने का रास्ता ढूँढने में मदद कर सकता हूँ।":l==="kfy"?"मैं नजदीक अस्पताल, इलाज अर रास्तो खोजण में मदद कर सकूं।":"I can help find nearby healthcare, hospitals and the route there.";
 else if(/culture|song|गीत|संस्कृति/i.test(q)) msg=l==="hi"?"कुमाऊँनी संस्कृति में लोकगीत, न्योली, हुड़किया बोल, झोड़ा, ऐपण, मेले और समृद्ध मौखिक परंपराएँ शामिल हैं। नीचे कुमाऊँनी रेडियो देखें।":l==="kfy"?"कुमाऊँनी संस्कृति में गीत, न्योली, हुड़किया बोल, झोड़ा, ऐपण अर मेळा सब छन। नीचे कुमाऊँनी रेडियो देखौ।":"Kumaoni culture includes folk music, Nyoli, Hudkiya Bol, Jhora, Aipan, fairs and rich oral traditions. See Kumaoni Radio below.";
 else msg=l==="hi"?"मैं आपकी बात को सही स्थानीय सेवा, जगह या जानकारी तक पहुँचाने में मदद करूँगा। थोड़ा और बताइए कि आपको क्या चाहिए।":l==="kfy"?"मैं तुमर बात सही स्थानीय सेवा या जानकारी तक लै जां सकूं। कै चाही, जरा और बतौ।":"I’ll route this to the right local service, place or information. Tell me a little more about what you need.";
 a.innerHTML=`<b>✦ Almora AI</b><div style="margin-top:6px">${msg}</div>`;
}

$$("[data-news-filter]").forEach(b=>b.onclick=()=>{$$("[data-news-filter]").forEach(x=>x.classList.toggle("active",x===b));renderNews(b.dataset.newsFilter)});
$("#directoryInput").addEventListener("input",e=>renderDirectory(e.target.value));

const dialog=$("#reportDialog");
$$("[data-open-report]").forEach(b=>b.onclick=()=>dialog.showModal());
$$("[data-report-category]").forEach(b=>b.onclick=()=>{$$("[data-report-category]").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#reportCategory").value=b.dataset.reportCategory});
$("#reportForm").addEventListener("submit",e=>{
 e.preventDefault();
 const item={category:$("#reportCategory").value,location:$("#reportLocation").value.trim(),description:$("#reportText").value.trim(),createdAt:new Date().toISOString()};
 if(!item.location||!item.description)return;
 const list=JSON.parse(localStorage.getItem("almoraReports")||"[]");list.push(item);localStorage.setItem("almoraReports",JSON.stringify(list));
 $("#reportStatus").textContent=lang==="hi"?"रिपोर्ट सुरक्षित हुई। धन्यवाद।":lang==="kfy"?"रिपोर्ट बचि गै। धन्यवाद।":"Report saved. Thank you.";
 setTimeout(()=>dialog.close(),900);
});

async function weather(){
 try{
  const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude=29.5892&longitude=79.6467&current=temperature_2m&timezone=Asia%2FKolkata");
  const d=await r.json();const temp=Math.round(d.current.temperature_2m);
  $("#topTemp").textContent=temp+"°";$("#weatherNow").textContent=temp+"°";
 }catch{}
}
renderNews();renderPlaces();renderRadio();renderDirectory();applyLang();applyTheme();weather();
window.AlmoraThemeV3={setTheme(v){theme=v;applyTheme()},setLanguage(v){lang=v;applyLang()}};
