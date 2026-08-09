import {
  directory,
  officialLinks,
  liveNotices,
  places,
  radio,
  droneVideos,
  mapsUrl
} from './home-data.js';

const COPY = {
  en: {
    fallback: 'Gemini did not answer quickly enough, so I am showing verified Almora options from the local catalog.',
    health: 'Here are verified health options around Almora.',
    jobs: 'Here are useful local job and skill pathways.',
    tourism: 'Here are places and travel options around Almora.',
    transport: 'Here are transport and road options for Almora.',
    government: 'Here are official public-service links for Almora.',
    utilities: 'Here are water and utility help options for Almora.',
    culture: 'Here are Kumaoni culture and listening options.',
    wildlife: 'Here are safe wildlife-conflict and reporting options.',
    default: 'Here are the most useful Almora options for your request.'
  },
  hi: {
    fallback: 'Gemini ने जल्दी उत्तर नहीं दिया, इसलिए स्थानीय कैटलॉग के सत्यापित विकल्प दिखाए जा रहे हैं।',
    health: 'अल्मोड़ा के सत्यापित स्वास्थ्य विकल्प यहाँ हैं।',
    jobs: 'स्थानीय रोज़गार और कौशल के उपयोगी रास्ते यहाँ हैं।',
    tourism: 'अल्मोड़ा के आसपास घूमने और यात्रा के विकल्प यहाँ हैं।',
    transport: 'अल्मोड़ा के यातायात और सड़क विकल्प यहाँ हैं।',
    government: 'अल्मोड़ा की आधिकारिक सार्वजनिक सेवाओं के लिंक यहाँ हैं।',
    utilities: 'अल्मोड़ा में पानी और उपयोगिता सहायता के विकल्प यहाँ हैं।',
    culture: 'कुमाऊँनी संस्कृति और सुनने के विकल्प यहाँ हैं।',
    wildlife: 'वन्यजीव समस्या के सुरक्षित और रिपोर्टिंग विकल्प यहाँ हैं।',
    default: 'आपके सवाल के लिए सबसे उपयोगी अल्मोड़ा विकल्प यहाँ हैं।'
  },
  kfy: {
    fallback: 'Gemini ले जल्दी जवाब नि दियो, तैले स्थानीय कैटलॉग का सत्यापित विकल्प दिख रौ छन।',
    health: 'अल्माड़ का सत्यापित इलाज विकल्प यां छन।',
    jobs: 'स्थानीय रोजगार अर हुनर का काम का बाट यां छन।',
    tourism: 'अल्माड़ आसपास घूमण अर सफर का विकल्प यां छन।',
    transport: 'अल्माड़ का सफर अर सड़क विकल्प यां छन।',
    government: 'अल्माड़ की सरकारी सेवा का सही लिंक यां छन।',
    utilities: 'अल्माड़ में पाणि अर जरूरी सुविधा की मदद यां छन।',
    culture: 'कुमाऊँनी संस्कृति अर सुनण का विकल्प यां छन।',
    wildlife: 'जंगली जानवर की दिक्कत खातिर सुरक्षित अर रिपोर्ट का बाट यां छन।',
    default: 'तुमर सवाल खातिर काम का अल्माड़ विकल्प यां छन।'
  }
};

function detect(query = '') {
  const s = query.toLowerCase();
  if (/hospital|doctor|health|clinic|medicine|अस्पताल|इलाज/.test(s)) return 'health';
  if (/job|work|career|hire|employment|रोजगार|काम/.test(s)) return 'jobs';
  if (/water|electricity|power|utility|पानी|पाणि|बिजली/.test(s)) return 'utilities';
  if (/bus|taxi|transport|road|traffic|route|सड़क|बस|टैक्सी/.test(s)) return 'transport';
  if (/government|scheme|certificate|office|ration|pension|सरकार|प्रमाण/.test(s)) return 'government';
  if (/culture|song|music|festival|kumaoni|गीत|संस्कृति/.test(s)) return 'culture';
  if (/monkey|wildlife|animal|leopard|boar|बंदर|जंगली/.test(s)) return 'wildlife';
  if (/tour|visit|trip|temple|trek|hotel|घूम|मंदिर/.test(s)) return 'tourism';
  return 'default';
}

function directoryCard(item, icon = '⌘') {
  return {
    kind: 'directory',
    icon,
    title: item.name,
    eyebrow: item.trust === 'official' ? 'Official' : 'Directory',
    description: item.area || '',
    image: '',
    actions: [
      ...(item.phone ? [{ label: 'Call', url: `tel:${item.phone}` }] : []),
      { label: 'Directions', url: mapsUrl(item.query || item.name) },
      { label: 'Source', url: item.sourceUrl || mapsUrl(item.query || item.name) }
    ]
  };
}

function cardsFor(topic) {
  if (topic === 'health') {
    return directory.filter(x => x.category === 'health').slice(0, 3).map(x => directoryCard(x, '❤️'));
  }
  if (topic === 'transport') {
    return [
      ...directory.filter(x => x.category === 'transport').slice(0, 2).map(x => directoryCard(x, '🚌')),
      { kind: 'action', icon: '🛣️', title: 'Report a road issue', eyebrow: 'Town report', description: 'Share the broad location and what happened so it can be reviewed.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80', actions: [{ label: 'Report', action: 'report' }] }
    ];
  }
  if (topic === 'utilities') {
    const utility = directory.find(x => x.category === 'utility');
    return [
      ...(utility ? [directoryCard(utility, '💧')] : []),
      { kind: 'action', icon: '💧', title: 'Report a water / utility issue', eyebrow: 'Town report', description: 'Share the area, service and what is happening. Reports remain unverified until reviewed.', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80', actions: [{ label: 'Report', action: 'report' }] },
      { kind: 'official', icon: '🏛️', title: 'District public utilities', eyebrow: 'Official', description: 'Use the district public-utilities directory for official contacts and services.', image: '', actions: [{ label: 'Open official source', url: 'https://almora.nic.in/public-utilities/' }] }
    ];
  }
  if (topic === 'jobs') {
    return [
      { kind: 'page', icon: '💼', title: 'Local jobs', eyebrow: 'Opportunities', description: 'Browse local vacancies and moderated employer submissions.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', actions: [{ label: 'Open jobs', url: './jobs.html' }] },
      { kind: 'page', icon: '🏪', title: 'Business hiring', eyebrow: 'Employers', description: 'Businesses can verify themselves and publish local opportunities.', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80', actions: [{ label: 'Business access', url: './business-login.html' }] },
      ...directory.filter(x => x.id === 'employment-office').map(x => directoryCard(x, '🏛️'))
    ];
  }
  if (topic === 'government') {
    return officialLinks.slice(0, 3).map(x => ({ kind: 'official', icon: '🏛️', title: x.label, eyebrow: 'Official', description: x.detail, image: '', actions: [{ label: 'Open official source', url: x.url }] }));
  }
  if (topic === 'culture') {
    return [
      { kind: 'media', icon: '🎵', title: radio[0].name, eyebrow: 'Kumaoni music', description: radio[0].sub, image: radio[0].image, actions: [{ label: 'Listen', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(radio[0].q)}` }] },
      { kind: 'media', icon: '🎥', title: droneVideos[0]?.title || 'Almora from above', eyebrow: 'Video', description: droneVideos[0]?.note || 'Aerial Almora views.', image: droneVideos[0] ? `https://i.ytimg.com/vi/${droneVideos[0].youtubeId}/hqdefault.jpg` : '', actions: [{ label: 'Watch', url: droneVideos[0] ? `https://www.youtube.com/watch?v=${droneVideos[0].youtubeId}` : '#culture' }] },
      { kind: 'page', icon: '🎪', title: 'Kumaoni festivals', eyebrow: 'Living culture', description: 'Explore Nanda Devi, Harela and other local traditions.', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80', actions: [{ label: 'Explore culture', url: '#events' }] }
    ];
  }
  if (topic === 'wildlife') {
    return [
      { kind: 'action', icon: '🐒', title: 'Report wildlife conflict', eyebrow: 'Humane response', description: 'Share location, time and what happened. Do not approach, poison or attempt unsafe capture.', image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80', actions: [{ label: 'Report incident', action: 'report' }] },
      { kind: 'page', icon: '🌿', title: 'Farm & wildlife help', eyebrow: 'Local support', description: 'Coordinate crop-risk and wildlife information through the farm workflow.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80', actions: [{ label: 'Open section', url: '#farming' }] }
    ];
  }
  return places.slice(0, 3).map(x => ({ kind: 'place', icon: '🏔️', title: x.name, eyebrow: x.type || 'Place', description: x.detail || '', image: x.image || '', actions: [{ label: 'Map', url: mapsUrl(`${x.name} Almora`) }, { label: 'Source', url: x.sourceUrl || '#places' }] }));
}

function contextFor(topic, cards) {
  const lines = cards.map(c => `${c.title}: ${c.description}`).join('\n');
  const notices = topic === 'transport' ? liveNotices.slice(0, 2).map(n => `${n.title}: ${n.summary}`).join('\n') : '';
  return `VERIFIED PUBLIC DATA:\n${lines}\n${notices}`.trim();
}

function withTimeout(promise, ms = 7000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), ms))
  ]);
}

async function askRich(query, lang = 'en') {
  const topic = detect(query);
  const cards = cardsFor(topic);
  const base = {
    topic,
    agent: topic,
    cards,
    chips: cards.map(x => x.eyebrow).filter(Boolean).slice(0, 4),
    summary: COPY[lang]?.[topic] || COPY.en[topic]
  };

  try {
    const { askAlmoraAI, routeAgent } = await import('../../ai-client.js');
    const language = lang === 'hi' ? 'Hindi' : lang === 'kfy' ? 'natural Kumaoni in Devanagari; use simple Hindi only when a common Kumaoni term is unavailable' : 'English';
    const prompt = `Respond in ${language}. Give a concise, useful answer in 2-5 short paragraphs. Do not invent live facts. Explain what the user should do next. USER: ${query}`;
    const response = await withTimeout(askAlmoraAI(prompt, contextFor(topic, cards)));
    return { ...base, agent: response.agent || routeAgent(query), summary: response.text, ai: true };
  } catch (error) {
    console.warn('Almora AI fallback:', error);
    return { ...base, summary: `${COPY[lang]?.fallback || COPY.en.fallback}\n\n${base.summary}`, ai: false };
  }
}

export { askRich, detect };
