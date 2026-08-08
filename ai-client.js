import { app } from './firebase-platform.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js';

const AGENTS = [
  ['monkey-wildlife', /monkey|bandar|wildlife|animal|leopard|boar/i],
  ['local-jobs', /job|employment|work|vacancy|hire|career/i],
  ['farm-watch', /farm|crop|agri|kheti|farmer|seed|harvest/i],
  ['road-access', /road|pothole|blocked|landslide|access|closure/i],
  ['transport-watch', /bus|taxi|transport|route|travel|parking/i],
  ['health-navigator', /doctor|hospital|health|medical|medicine|clinic/i],
  ['education', /school|education|student|college|scholarship|course/i],
  ['price-scam-watch', /price|scam|fraud|bribe|corruption|overcharg/i],
  ['government-navigator', /government|govt|scheme|certificate|office|pension|ration/i],
  ['tourism', /tour|visit|trip|hotel|trek|temple|sightseeing/i],
  ['commerce', /shop|business|service|plumber|electrician|market/i],
  ['traffic', /traffic|jam|congestion|parking/i]
];

function routeAgent(prompt) {
  const match = AGENTS.find(([, pattern]) => pattern.test(prompt));
  return match ? match[0] : 'town-concierge';
}

let model = null;
let aiReady = false;
try {
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  model = getGenerativeModel(ai, {
    model: 'gemini-3.6-flash',
    systemInstruction: `You are Almora AI, the AI coordination layer for Almora, Uttarakhand, India.
Your job is to help residents, visitors, businesses and public-service teams understand what to do next.

TRUST RULES
- Never invent live local facts, opening hours, routes, vacancies, prices, government status, medical availability, emergency status or incident status.
- Treat only context explicitly labelled VERIFIED PUBLIC DATA as verified town facts.
- Treat resident reports as unverified until moderation.
- If verified data is absent, say so plainly and provide useful general next steps rather than guessing.
- For medical questions, provide navigation and general information only, not diagnosis.
- For wildlife conflict, recommend only humane and lawful approaches; never advise poisoning, injury or unsafe capture.
- For scams, corruption or accusations, separate allegations from verified evidence and never declare wrongdoing as fact without evidence.
- Never expose private candidate profiles, private reports, moderator data, email addresses or other private Firestore content.

EXPERIENCE
- Respond in the user's language when practical, including Hindi/Hinglish.
- Prefer concise, actionable answers.
- If a broad location is needed to help, ask for locality/village/landmark rather than a private home address.
- When the supplied context contains relevant verified records, use them and identify them as verified Almora data.
- Explain which Almora agent is handling the request when useful.`
  });
  aiReady = true;
} catch (error) {
  console.info('Firebase AI Logic is not available yet; deterministic routing remains active.', error);
}

async function askAlmoraAI(prompt, context = '') {
  if (!aiReady || !model) throw new Error('AI Logic unavailable');
  const agent = routeAgent(prompt);
  const groundedPrompt = `ACTIVE AGENT: ${agent}\n\n${context || 'VERIFIED PUBLIC DATA: No relevant verified records supplied.'}\n\nUSER REQUEST:\n${prompt}`;
  const result = await model.generateContent(groundedPrompt);
  return { text: result.response.text(), agent };
}

export { aiReady, askAlmoraAI, routeAgent };
