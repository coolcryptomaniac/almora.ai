# Cloudflare AI / API Gateway Plan for Almora.ai

Status: **Future architecture — not enabled yet**

This document records the planned Cloudflare-based backend/AI architecture discussed for Almora.ai. It intentionally contains **no API keys, secrets, credentials, DNS changes, billing changes, or production configuration**.

## Goal

Use Cloudflare Workers as a secure API/orchestration layer between the public Almora.ai frontend and optional external providers, while keeping the town site usable when AI providers are unavailable.

```text
almora.ai frontend
      |
      v
Cloudflare Worker
      |
      +-- verified/static Almora knowledge
      +-- Firebase / Firestore services where appropriate
      +-- cache / rate limits
      +-- Open-Meteo / OpenStreetMap / public-data sources
      +-- media search adapter
      +-- AI Gateway / model router
              |
              +-- Groq
              +-- NVIDIA NIM
              +-- Cloudflare Workers AI
              +-- Gemini / OpenAI / Claude or future providers
```

## Why Cloudflare Workers

- Keep provider API keys out of browser JavaScript.
- Centralize request validation, rate limiting, timeouts and provider fallbacks.
- Give the frontend one stable internal endpoint even when model providers change.
- Cache safe public responses where useful.
- Keep deterministic/local engines independent from LLM availability.
- Add cost controls before public scaling.

## Planned endpoints

```text
/api/ai
/api/media/search
/api/translate
/api/status
```

Additional endpoints should be added only when there is a clear need.

## Provider roles

### Groq
Preferred first external model provider for fast, inexpensive chat, intent routing, summaries and general language assistance.

### NVIDIA NIM
Potential secondary provider for heavier reasoning, vision or specialized models.

### Cloudflare Workers AI
Useful built-in fallback and for workloads that make sense within Cloudflare's own inference limits.

### Pexels or similar media provider
Use only for appropriate stock/media discovery. Almora.ai's distinctive Aipan, Kumaoni, wildlife and cultural visual identity should continue to prefer owned, locally stored, properly licensed or AI-generated imagery.

## Important architecture rule

Do **not** call an LLM for tasks that can be answered reliably by deterministic data or a specific public-data service.

Examples:

- `Hospitals in Almora` -> verified directory data.
- `Weather today` -> Open-Meteo.
- `Jobs near Almora` -> jobs engine/database.
- `Bus/route information` -> route and transport data.
- `Reported wildlife activity` -> moderated Wildlife Watch data.
- Complex multi-service questions -> AI reasoning layer when appropriate.

This keeps latency, cost and hallucination risk low.

## Free-tier planning notes

At the time this plan was drafted, the working assumptions discussed were approximately:

- Workers Free: around **100,000 Worker requests/day**.
- Workers AI: a separate free daily inference allowance measured in **Neurons**.
- AI Gateway: useful for model routing, analytics, caching and rate/cost controls.

These quotas and prices can change. **Re-check Cloudflare's official pricing and limits immediately before implementation.** Do not hard-code business assumptions from this document into production.

## Scaling approach

The site should be designed so most visitors use static pages, public data, directories, maps, weather, jobs, Wildlife Watch and Kumaoni tools without consuming LLM inference.

A reasonable early target is to support several thousand daily visitors while limiting AI reasoning to the subset of requests that genuinely need it. Exact capacity must be calculated from real traffic, cache hit rate, prompt sizes, selected models and current provider quotas.

## Security requirements

When implemented:

- Store all external provider credentials as Worker secrets or equivalent protected secret storage.
- Never commit provider keys to GitHub.
- Never expose provider keys in frontend bundles.
- Restrict accepted origins where practical.
- Validate request body size and shape.
- Apply per-user/IP/session rate limits carefully.
- Use short upstream timeouts and graceful fallbacks.
- Do not weaken existing Firebase authentication or Firestore security rules.
- Do not log sensitive resident reports, health-related text, personal contact data or private identifiers by default.
- Avoid caching personalized or sensitive responses.

## Suggested AI request policy

Possible future limits, to be adjusted after observing real usage:

```text
Anonymous visitor: small daily AI allowance
Verified resident: larger daily allowance
Authenticated staff/admin: role-based allowance
Whole project: hard daily/monthly AI spend ceiling
```

These are product-policy ideas only, not implemented limits.

## Reliability / fallback policy

The public site must continue to function if Groq, NVIDIA, Cloudflare AI or another provider is down.

Fallback order should generally be:

1. deterministic/local/public-data answer where possible;
2. cached safe public answer where appropriate;
3. alternate AI provider if the request genuinely requires AI;
4. transparent local fallback explaining that live AI is unavailable.

Never fabricate road status, vacancies, official contacts, medical availability, wildlife population numbers, allegations or emergency information when an upstream service fails.

## High-impact safeguards

AI may assist with information and navigation, but must not independently make or execute:

- medical decisions;
- government decisions;
- wildlife capture/relocation/sterilisation/hunting decisions;
- law-enforcement or eligibility decisions;
- allegations about private people;
- other high-impact civic decisions.

Wildlife, health and government workflows should continue to use verified sources, moderation and appropriately authorized human decision-makers.

## Implementation sequence for later

1. Add a credential-free Worker skeleton and provider-neutral adapter interface.
2. Add tests for request validation, fallbacks and rate-limit behavior.
3. Configure Cloudflare account/project manually with appropriate authority.
4. Add secrets through Cloudflare secret storage only.
5. Connect one provider first (likely Groq) behind `/api/ai`.
6. Add AI Gateway/model routing only after the basic path is stable.
7. Add NVIDIA and media providers as optional adapters.
8. Add observability that avoids sensitive payload logging.
9. Load-test before increasing traffic or quotas.
10. Re-check pricing, quotas, privacy implications and provider terms before production rollout.

## Current state

**Nothing in this document is active production configuration.** It is a saved design note for a future implementation pass.