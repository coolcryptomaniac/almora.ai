
const langs = {
  en: {
    askPlaceholder: "How can I help you today?",
    interactiveResults: "Interactive results",
    reportSaved: "Report saved successfully.",
    fallbackIntro: "Here are the most useful Almora options for your request."
  },
  hi: {
    askPlaceholder: "आज मैं आपकी कैसे मदद करूँ?",
    interactiveResults: "इंटरैक्टिव परिणाम",
    reportSaved: "रिपोर्ट सफलतापूर्वक सुरक्षित हुई।",
    fallbackIntro: "आपकी ज़रूरत के लिए ये सबसे उपयोगी अल्मोड़ा विकल्प हैं।"
  },
  kfy: {
    askPlaceholder: "आज मैं कसिक मदद करूं?",
    interactiveResults: "इंटरैक्टिव नतीजा",
    reportSaved: "रिपोर्ट बचि गै।",
    fallbackIntro: "तुमर सवाल खातिर ये काम की अल्मोड़ा चीज छन।"
  }
};
let currentLang = localStorage.getItem('almora_lang') || 'en';
document.querySelectorAll('.langBtn').forEach(btn=>{
  btn.classList.toggle('active', btn.dataset.lang === currentLang);
  btn.addEventListener('click', ()=>{
    currentLang = btn.dataset.lang;
    localStorage.setItem('almora_lang', currentLang);
    document.querySelectorAll('.langBtn').forEach(b=>b.classList.toggle('active', b===btn));
    const t = langs[currentLang];
    document.getElementById('askInput').placeholder = t.askPlaceholder;
    document.getElementById('headerQuery').placeholder = currentLang==='hi' ? 'अल्मोड़ा AI से कुछ भी पूछें...' : currentLang==='kfy' ? 'अल्मोड़ा AI लै कछु भी पुछौ...' : 'Ask Almora AI anything...';
  });
});
document.querySelector('.langBtn[data-lang="'+currentLang+'"]')?.click();

document.getElementById('mobileToggle').addEventListener('click', ()=>document.getElementById('sidebar').classList.toggle('open'));

document.getElementById('openReport').addEventListener('click', ()=>document.getElementById('reportDialog').showModal());
document.getElementById('saveReport').addEventListener('click', ()=>{
  const payload = {
    category: document.getElementById('reportCategory').value,
    location: document.getElementById('reportLocation').value.trim(),
    details: document.getElementById('reportDetails').value.trim(),
    createdAt: new Date().toISOString()
  };
  if(!payload.location || !payload.details){ document.getElementById('reportStatus').textContent = 'Please fill location and details.'; return; }
  const items = JSON.parse(localStorage.getItem('almora_reports') || '[]');
  items.push(payload);
  localStorage.setItem('almora_reports', JSON.stringify(items));
  document.getElementById('reportStatus').textContent = langs[currentLang].reportSaved;
  setTimeout(()=>document.getElementById('reportDialog').close(), 800);
});

const fallbackLibrary = {
  health: {
    summary: "These are the fastest health-related options around Almora right now.",
    chips: ["Hospitals", "Directions", "Emergency", "Wellness"],
    cards: [
      {title:"District Hospital Almora", text:"Primary public hospital access point in Almora.", image:"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80", link:"https://www.google.com/maps/search/?api=1&query=District+Hospital+Almora"},
      {title:"Nearby private clinics", text:"Use maps to compare clinics and timings before visiting.", image:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80", link:"https://www.google.com/maps/search/?api=1&query=clinic+Almora"},
      {title:"Health & wellness", text:"Explore pharmacy, labs and wellness support around town.", image:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80", link:"#health"}
    ]
  },
  jobs: {
    summary: "Here are the most relevant job and skills pathways for Almora users.",
    chips: ["Jobs", "Skills", "Business", "Hiring"],
    cards: [
      {title:"Local jobs", text:"Browse nearby work opportunities and local hiring flows.", image:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", link:"./jobs.html"},
      {title:"Business hiring", text:"Businesses can verify themselves and hire locally.", image:"https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80", link:"./business-login.html"},
      {title:"Skill-building", text:"Education and skills are linked so citizens can grow locally.", image:"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", link:"#education"}
    ]
  },
  tourism: {
    summary: "Here are scenic and cultural places people usually want first.",
    chips: ["Temples", "Nature", "Treks", "Maps"],
    cards: [
      {title:"Kasar Devi", text:"A beloved ridge-top spiritual and scenic spot.", image:"https://images.unsplash.com/photo-1614594851484-89859fb12da8?auto=format&fit=crop&w=800&q=80", link:"https://www.google.com/maps/search/?api=1&query=Kasar+Devi+Almora"},
      {title:"Jageshwar Dham", text:"Historic temple complex set amidst cedar forests.", image:"https://s7ap1.scene7.com/is/image/incredibleindia/2-jageshwar-temple-almorah-uttarakhand-attr-hero?qlt=82&ts=1726646689920", link:"https://www.google.com/maps/search/?api=1&query=Jageshwar+Dham"},
      {title:"Binsar & viewpoints", text:"Forests, wildlife and beautiful lookout points around Almora.", image:"https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80", link:"#places"}
    ]
  },
  roads: {
    summary: "These are the most useful road and transport actions for Almora.",
    chips: ["Road Issue", "Transport", "Maps", "Report"],
    cards: [
      {title:"Report a road issue", text:"Submit a structured report for road, blockage or safety concerns.", image:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80", link:"#"},
      {title:"Transport options", text:"Find bus station, taxis and travel routes.", image:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80", link:"#transport"},
      {title:"Open Almora map", text:"Use the spatial map to locate key places and routes.", image:"https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80", link:"#map"}
    ]
  },
  culture: {
    summary: "Kumaoni culture is one of Almora's strongest living identities.",
    chips: ["Songs", "Festivals", "Food", "Stories"],
    cards: [
      {title:"Bedu Pako", text:"One of the most recognisable Kumaoni folk-song traditions.", image:"https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80", link:"https://www.youtube.com/results?search_query=Bedu+Pako+Kumaoni"},
      {title:"Nanda Devi & local festivals", text:"Festivals shape community, music, dress and memory.", image:"https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=800&q=80", link:"#events"},
      {title:"Food & craft", text:"Bal Mithai, Singauri, Aipan and local art are all part of the Almora identity.", image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", link:"#culture"}
    ]
  }
};

function inferTopic(q){
  q=q.toLowerCase();
  if(/hospital|health|doctor|medicine|wellness/.test(q)) return 'health';
  if(/job|skill|hire|employment/.test(q)) return 'jobs';
  if(/tour|travel|visit|place|temple|trek/.test(q)) return 'tourism';
  if(/road|traffic|bus|taxi|transport/.test(q)) return 'roads';
  if(/culture|song|festival|food|kumaoni/.test(q)) return 'culture';
  return 'tourism';
}

async function askGemini(query){
  if(!window.ALMORA_GEMINI_API_KEY) return null;
  const prompt = `You are Almora AI. For the user query: "${query}", produce compact JSON with keys summary, chips, cards. cards is an array of up to 3 items with title, text, imageQuery, link. Keep it safe and local to Almora/Uttarakhand.`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${window.ALMORA_GEMINI_API_KEY}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})
  });
  if(!res.ok) throw new Error('Gemini request failed');
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('\n') || '';
  const jsonText = text.match(/\{[\s\S]*\}/)?.[0];
  if(!jsonText) return null;
  return JSON.parse(jsonText);
}

function renderResults(result){
  const box = document.getElementById('askResults');
  document.getElementById('askSummary').textContent = result.summary || langs[currentLang].fallbackIntro;
  document.getElementById('resultChips').innerHTML = (result.chips||[]).map(c=>`<span>${c}</span>`).join('');
  document.getElementById('resultCards').innerHTML = (result.cards||[]).map(c=>`
    <article class="resultCard">
      <img src="${c.image || c.imageQuery || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'}" alt="">
      <div class="body">
        <h4>${c.title}</h4>
        <p>${c.text}</p>
        <a class="link" href="${c.link || '#'}" ${String(c.link||'').startsWith('http') ? 'target="_blank"' : ''}>Open ↗</a>
      </div>
    </article>`).join('');
  box.hidden = false;
  box.scrollIntoView({behavior:'smooth', block:'start'});
}

async function handleAsk(query){
  const topic = inferTopic(query);
  const fallback = fallbackLibrary[topic];
  try{
    const remote = await askGemini(query);
    if(remote){
      const enriched = {
        summary: remote.summary || fallback.summary,
        chips: remote.chips?.length ? remote.chips : fallback.chips,
        cards: (remote.cards||[]).slice(0,3).map((c,idx)=>({
          title:c.title || fallback.cards[idx%fallback.cards.length].title,
          text:c.text || fallback.cards[idx%fallback.cards.length].text,
          image:c.image || fallback.cards[idx%fallback.cards.length].image,
          link:c.link || fallback.cards[idx%fallback.cards.length].link
        }))
      };
      renderResults(enriched); return;
    }
  } catch(e){ console.warn(e); }
  renderResults(fallback);
}

document.getElementById('askForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const q = document.getElementById('askInput').value.trim();
  if(!q) return;
  await handleAsk(q);
});
document.getElementById('headerQuery').addEventListener('keydown', async (e)=>{
  if(e.key==='Enter'){
    const q=e.currentTarget.value.trim();
    if(!q) return;
    document.getElementById('askInput').value=q;
    await handleAsk(q);
  }
});
document.querySelectorAll('.quickGrid button').forEach(btn=>btn.addEventListener('click', async ()=> {
  const q = btn.dataset.q;
  document.getElementById('askInput').value = q;
  await handleAsk(q);
}));
document.getElementById('closeResults').addEventListener('click', ()=>document.getElementById('askResults').hidden = true);
document.querySelectorAll('[data-audio]').forEach(btn => btn.addEventListener('click', () => {
  const q = `${btn.dataset.audio} Kumaoni folk song`;
  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank');
}));

async function updateWeather(){
  try{
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.5892&longitude=79.6467&current=temperature_2m,weather_code&timezone=Asia%2FKolkata');
    const d = await r.json();
    const temp = Math.round(d.current.temperature_2m);
    document.getElementById('topTemp').textContent = temp + '°C';
    document.getElementById('heroTemp').textContent = temp + '°C';
  }catch(e){}
}
updateWeather();
