const DAY=86400;
const SIMPLE=[/^(hi|hello|hey|namaste|नमस्ते|नमस्कार)[!. ]*$/i,/\b(time|date|weather|temperature|aqi|air quality)\b/i,/\b(hospital|school|college|job|bus|taxi|water|road|tourism|monkey|wildlife|office|market)\b/i];
function dayKey(){return new Date().toISOString().slice(0,10)}
function normalize(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ').slice(0,2000)}
function classify(prompt){const q=normalize(prompt);if(!q)return{tier:'reject',reason:'empty'};if(q.length<80||SIMPLE.some(r=>r.test(q)))return{tier:'local',reason:'simple_or_known'};if(q.length<220&&!/[?।].*[?।]/.test(q))return{tier:'local',reason:'short'};return{tier:'ai',reason:'complex'}}
function fingerprint(prompt){let h=2166136261;for(const c of normalize(prompt)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
async function readBudget(env){if(!env.QUOTA_KV)return{ai:0,requests:0};try{return JSON.parse(await env.QUOTA_KV.get(`budget:${dayKey()}`)||'{}')}catch{return{ai:0,requests:0}}}
async function allowAI(env){const max=Math.max(0,Number(env.AI_DAILY_REQUEST_CAP||120));const reserve=Math.max(0,Number(env.AI_RESERVE_REQUESTS||20));const b=await readBudget(env);return{ok:(b.ai||0)<Math.max(0,max-reserve),used:b.ai||0,max,reserve}}
async function record(env,kind){if(!env.QUOTA_KV)return;const key=`budget:${dayKey()}`;try{const b=await readBudget(env);b.requests=(b.requests||0)+1;if(kind==='ai')b.ai=(b.ai||0)+1;await env.QUOTA_KV.put(key,JSON.stringify(b),{expirationTtl:DAY*2})}catch{}}
export{classify,fingerprint,allowAI,record,normalize};
