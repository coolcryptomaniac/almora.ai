import { app } from './firebase-platform.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js';

const AGENTS=[['monkey-wildlife',/monkey|bandar|wildlife|animal|leopard|boar|बंदर|जंगली/i],['local-jobs',/job|employment|work|vacancy|hire|career|रोजगार|काम/i],['farm-watch',/farm|crop|agri|kheti|farmer|seed|harvest|खेती/i],['road-access',/road|pothole|blocked|landslide|access|closure|सड़क/i],['transport-watch',/bus|taxi|transport|route|travel|parking|बस|टैक्सी|सफर/i],['health-navigator',/doctor|hospital|health|medical|medicine|clinic|अस्पताल|इलाज/i],['education',/school|education|student|college|scholarship|course|स्कूल|पढ़ाई/i],['price-scam-watch',/price|scam|fraud|bribe|corruption|overcharg/i],['government-navigator',/government|govt|scheme|certificate|office|pension|ration|सरकार/i],['tourism',/tour|visit|trip|hotel|trek|temple|sightseeing|घूम|मंदिर/i],['commerce',/shop|business|service|plumber|electrician|market|दुकान/i],['traffic',/traffic|jam|congestion|parking/i],['water-watch',/water|supply|pressure|tanker|पानी|पाणि/i],['hill-life',/elderly|medicine pickup|school access|hill life|local help/i]];
function routeAgent(prompt){return AGENTS.find(([,p])=>p.test(prompt))?.[0]||'town-concierge'}

const SYSTEM=`You are Almora AI, the AI coordination layer for Almora, Uttarakhand, India.
Help residents, visitors, businesses and public-service teams decide what to do next.
TRUST RULES
- Never invent live local facts, opening hours, routes, vacancies, prices, government status, medical availability, emergency status or incident status.
- Treat only context explicitly labelled VERIFIED PUBLIC DATA as verified town facts.
- Treat resident reports as unverified until moderation.
- Medical: navigation/general information only, not diagnosis.
- Wildlife: humane and lawful approaches only; never poisoning, injury or unsafe capture.
- Accusations/scams: distinguish allegation from verified evidence.
- Never expose private candidate profiles, private reports, moderator data or private Firestore content.
EXPERIENCE
- Reply in the user's language when practical, including Hindi and simple natural Kumaoni in Devanagari.
- Prefer short actionable sections and local next steps.
- Ask for locality/village/landmark instead of a private home address.
- Use supplied verified records and say when information is not verified.
- Coordinate across agents when a hill-life problem spans transport, health, roads, water, school or local tasks.`;
let primaryModel=null,fallbackModel=null,aiReady=false;const sessions=new Map();
try{const ai=getAI(app,{backend:new GoogleAIBackend()});primaryModel=getGenerativeModel(ai,{model:'gemini-3.6-flash',systemInstruction:SYSTEM,generationConfig:{maxOutputTokens:900}});fallbackModel=getGenerativeModel(ai,{model:'gemini-3.5-flash-lite',systemInstruction:SYSTEM,generationConfig:{maxOutputTokens:700}});aiReady=true}catch(error){console.info('Firebase AI Logic unavailable; grounded deterministic results remain active.',error)}
function sessionFor(agent){if(!sessions.has(agent))sessions.set(agent,primaryModel.startChat({generationConfig:{maxOutputTokens:900}}));return sessions.get(agent)}
async function askAlmoraAI(prompt,context=''){
 if(!aiReady||!primaryModel)throw new Error('AI Logic unavailable');const agent=routeAgent(prompt);const grounded=`ACTIVE AGENT: ${agent}\n\n${context||'VERIFIED PUBLIC DATA: No relevant verified records supplied.'}\n\nUSER REQUEST:\n${prompt}`;
 try{const result=await sessionFor(agent).sendMessage(grounded);return{text:result.response.text(),agent,model:'gemini-3.6-flash'}}catch(primaryError){console.warn('Primary Almora AI chat failed; using Flash-Lite fallback.',primaryError);const result=await fallbackModel.generateContent(grounded);return{text:result.response.text(),agent,model:'gemini-3.5-flash-lite'}}
}
function resetAlmoraChat(agent){if(agent)sessions.delete(agent);else sessions.clear()}
export{aiReady,askAlmoraAI,routeAgent,resetAlmoraChat};
