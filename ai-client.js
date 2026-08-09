import { app } from './firebase-platform.js';
import { safeJSON, race } from './src/scripts/app-runtime.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js';

const AGENTS=[['monkey-wildlife',/monkey|bandar|wildlife|animal|leopard|boar|बंदर|जंगली/i],['local-jobs',/job|employment|work|vacancy|hire|career|रोजगार|काम/i],['farm-watch',/farm|crop|agri|kheti|farmer|seed|harvest|खेती/i],['road-access',/road|pothole|blocked|landslide|access|closure|सड़क/i],['transport-watch',/bus|taxi|transport|route|travel|parking|बस|टैक्सी|सफर/i],['health-navigator',/doctor|hospital|health|medical|medicine|clinic|अस्पताल|इलाज/i],['rural-education',/school|education|student|college|scholarship|course|स्कूल|पढ़ाई/i],['price-scam-watch',/price|scam|fraud|bribe|corruption|overcharg/i],['government-navigator',/government|govt|scheme|certificate|office|pension|ration|सरकार/i],['tourism',/tour|visit|trip|hotel|trek|temple|sightseeing|घूम|मंदिर/i],['commerce',/shop|business|service|plumber|electrician|market|दुकान/i],['traffic',/traffic|jam|congestion|parking/i],['water-watch',/water|supply|pressure|tanker|पानी|पाणि/i],['route-intelligence',/ranikhet|bageshwar|haldwani|nainital|pithoragarh|dehradun|delhi|distance|how.*reach/i],['app-bridge',/rapido|zomato|swiggy|redbus|irctc|delivery app|ride app/i],['hill-life',/elderly|medicine pickup|school access|hill life|local help|multiple problem/i]];
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
- Reply in the user's language when practical, including Hindi and simple natural Kumaoni in Devanagari. If unsure of a Kumaoni word, use plain Hindi rather than inventing vocabulary.
- Prefer short actionable sections, maps/actions when available, and local next steps.
- Ask for locality/village/landmark instead of a private home address.
- Use supplied verified records and say when information is not verified.
- For compound problems use this sequence: identify intent → assign specialist → check shared evidence lessons → make an ordered plan → verify risky/current claims → answer.
- Coordinate across agents when a hill-life problem spans transport, health, roads, water, school or local tasks.
- A shared lesson is guidance derived from public evidence; it is not a new factual claim and never overrides fresher verified data.`;
let primaryModel=null,fallbackModel=null,aiReady=false;const sessions=new Map(),turns=new Map();
try{const ai=getAI(app,{backend:new GoogleAIBackend()});primaryModel=getGenerativeModel(ai,{model:'gemini-3.6-flash',systemInstruction:SYSTEM,generationConfig:{maxOutputTokens:1000}});fallbackModel=getGenerativeModel(ai,{model:'gemini-3.5-flash-lite',systemInstruction:SYSTEM,generationConfig:{maxOutputTokens:760}});aiReady=true}catch(error){console.info('Firebase AI Logic unavailable; grounded deterministic results remain active.',error)}
function sessionFor(agent){const n=turns.get(agent)||0;if(!sessions.has(agent)||n>=8){sessions.set(agent,primaryModel.startChat({generationConfig:{maxOutputTokens:1000}}));turns.set(agent,0)}return sessions.get(agent)}
async function sharedLessons(agent){const {value}=await safeJSON('./data/agent-learning.json',{fallback:{lessons:[]},cacheKey:'agent-learning',maxAge:70*60*1000,retries:1,timeout:4500});const rows=(value?.lessons||[]).filter(x=>(x.toAgents||[]).includes(agent)||(x.fromAgents||[]).includes(agent)||agent==='town-concierge').slice(0,5);if(!rows.length)return'';return `\n\nSHARED EVIDENCE LESSONS (coordination guidance, not model training):\n${rows.map(x=>`- ${x.rule} Evidence: ${(x.evidence||[]).slice(0,2).join(' | ')}`).join('\n')}`}
async function askAlmoraAI(prompt,context=''){
 if(!aiReady||!primaryModel)throw new Error('AI Logic unavailable');const agent=routeAgent(prompt),lessons=await sharedLessons(agent);const grounded=`ACTIVE AGENT: ${agent}\n\n${context||'VERIFIED PUBLIC DATA: No relevant verified records supplied.'}${lessons}\n\nUSER REQUEST:\n${prompt}`;
 try{const result=await race(()=>sessionFor(agent).sendMessage(grounded),()=>{throw new Error('Primary model timeout')},{timeout:9000});turns.set(agent,(turns.get(agent)||0)+1);return{text:result.response.text(),agent,model:'gemini-3.6-flash'}}catch(primaryError){console.warn('Primary Almora AI chat failed; using Flash-Lite fallback.',primaryError);const result=await race(()=>fallbackModel.generateContent(grounded),()=>{throw new Error('Fallback model timeout')},{timeout:6500});return{text:result.response.text(),agent,model:'gemini-3.5-flash-lite'}}
}
function resetAlmoraChat(agent){if(agent){sessions.delete(agent);turns.delete(agent)}else{sessions.clear();turns.clear()}}
export{aiReady,askAlmoraAI,routeAgent,resetAlmoraChat};
