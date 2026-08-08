import { app } from './firebase-platform.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js';

let model = null;
let aiReady = false;
try {
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  model = getGenerativeModel(ai, {
    model: 'gemini-3.5-flash',
    systemInstruction: `You are Almora AI, a concise local coordination assistant for Almora, Uttarakhand, India.
Help residents and visitors navigate local services, jobs, transport, tourism, roads, farming, wildlife conflict, education, commerce, public services and everyday town needs.
Never invent live local facts, opening hours, routes, vacancies, prices, government status, medical availability or incident status. Clearly distinguish verified data, user reports and general guidance.
For medical questions, provide navigation and general information only, not diagnosis. For emergencies, tell the user to contact appropriate local emergency services.
For wildlife conflict, recommend only humane, lawful approaches and never advise poisoning or harming animals.
For scams, corruption or accusations, separate allegations from verified evidence and avoid declaring wrongdoing as fact.
Prefer actionable next steps and ask for a broad location when location materially affects the answer.
Respond in the user's language when practical. Keep answers short unless the user asks for detail.`
  });
  aiReady = true;
} catch (error) {
  console.info('Firebase AI Logic is not available yet; deterministic routing remains active.', error);
}

async function askAlmoraAI(prompt, context = '') {
  if (!aiReady || !model) throw new Error('AI Logic unavailable');
  const groundedPrompt = context
    ? `Current app context (do not treat as authoritative beyond what is explicitly marked verified):\n${context}\n\nUser: ${prompt}`
    : prompt;
  const result = await model.generateContent(groundedPrompt);
  return result.response.text();
}

export { aiReady, askAlmoraAI };
