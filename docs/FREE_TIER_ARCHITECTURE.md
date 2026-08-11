# Almora.ai free-tier-first architecture

## Non-negotiable principle
A page view is not a Worker request. Static HTML/CSS/JS/images are served from Cloudflare CDN/static assets and aggressively cached. The Worker exists only for dynamic API routes. This is required because Workers Free has a daily request ceiling; a million visitors cannot each traverse a free Worker.

## Request ladder
1. Browser/local code: navigation, search index, deterministic intent matching, calculators, translations, FAQ/service routing, bundled town knowledge.
2. CDN/static JSON: versioned public datasets and generated indexes. Cache for minutes/hours/days depending on freshness.
3. Worker deterministic router: validation, tiny computations, public-data normalization, auth/rate gates. No AI.
4. Cached answer: normalized/fingerprinted complex questions reuse a prior answer.
5. Database only when state is actually required. Prefer indexed D1 queries; never query D1 for static content or every page view.
6. Workers AI only for unresolved complex requests and only while an application-level daily reserve remains.
7. When AI quota is protected/exhausted, return a useful deterministic fallback rather than an error.

## Quota rules
- Never spend AI on greetings, navigation, directory lookup, weather/AQI routing, common service questions, fixed calculations or repeated questions.
- Never write KV per page view. KV writes are for durable cache entries and coarse counters only.
- Cache AI answers by normalized query fingerprint with long TTL. Do not cache sensitive/user-specific prompts.
- AI output is short by default (currently max 360 tokens) and temperature is low.
- AI has an application cap and reserve independent of Cloudflare's platform cap. Default scaffold: 120 attempted AI calls/day, preserve final 20 for important unresolved requests.
- AI is OFF by default in configuration.
- Static/public data must fail open to stale-but-safe cached data where possible.

## Data placement
- Static Assets/CDN: UI, images, cultural artwork, dictionaries, FAQs, service catalogs, public read-mostly JSON.
- Browser IndexedDB/localStorage: language/theme/preferences and optional downloaded local search index. Never secrets.
- Cache API/CDN: public HTTP responses.
- KV: read-mostly shared cache and coarse quota state; avoid high-write workloads.
- D1: reports, moderated records, normalized relational town data. Indexed queries only.
- R2: large immutable media/data exports when needed; never put binaries in D1/KV.
- Workers AI: last-resort reasoning, not search/navigation/routing.

## Scale behavior
At 1M+ visits, the vast majority should terminate at CDN/browser and consume zero Worker, KV, D1 or AI operations. Dynamic APIs are cacheable where public. Interactive features degrade independently: if AI is unavailable the site, local search, directories, reporting UI and cached public information continue working.

## Security/cost controls
- No provider key in frontend.
- CORS allowlist, request body limits and method validation.
- AI endpoint disabled unless explicitly enabled.
- Add Cloudflare rate limiting/WAF rules at deployment for abusive clients.
- Do not log full prompts by default.
- Protect administrative/report-write endpoints separately from public reads.

## Deployment topology
`Browser -> Cloudflare CDN/static assets -> /api/* Worker router -> cache/local resolver -> optional KV/D1/R2 -> gated Workers AI`

This repository intentionally contains no Cloudflare account IDs, production routes or secrets.
