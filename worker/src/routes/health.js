async function handleHealth({json}){return json({ok:true,service:'almora-ai-router',version:1,providers:{workersAI:'optional',groq:'optional',nvidia:'optional',pexels:'optional'}})}
export{handleHealth};
