# Almora.ai architecture cleanup

## Why this pass exists

The UI had accumulated overlapping responsibilities across `home.css`, `home-polish.css`, `aipan.css`, legacy page CSS, feature-page CSS, `local-info.js`, `hero-slideshow.js`, `culture-theme.js`, and `page-theme.js`. This made visual results depend on load order and caused cultural borders, hero artwork, saved themes, and surface contrast to disagree across pages.

## Canonical ownership after this pass

### Visual tokens and cultural frame
- `src/styles/design-system.css`: app colors, spacing/radius primitives, modern/heritage surface tokens.
- `src/styles/aipan.css`: **only** cultural frame patterns and cultural-border picker presentation. The frame uses `--culture-pattern`; the decorative gradient token is no longer used as the outer border.
- `src/styles/page-theme.css`: compatibility layer for legacy pages. It removes legacy decorative background gradients and maps cards/headers/forms onto shared dark surfaces.
- `src/styles/home.css`: homepage structure/layout.
- `src/styles/home-polish.css`: homepage-only contrast and hero readability fixes. It does not own the outer cultural frame.
- `src/styles/feature-shell.css`: Wildlife/Kumaoni standalone layout, importing the shared design and cultural-frame layers.

### Theme state
- `src/scripts/theme-runtime.js`: one persisted source of truth for `almoraTheme` and `almoraCultureTheme`.
- `src/scripts/culture-theme.js`: homepage cultural-theme menu UI only; delegates state to `theme-runtime.js`.
- `src/scripts/page-theme.js`: legacy-page bridge; injects the shared theme styles and mounts shared controls.
- `src/scripts/feature-theme.js`: standalone feature-page bridge.

### Homepage hero
- `src/scripts/hero-slideshow.js`: the only owner of hero image selection/rotation.
- `src/scripts/home-visuals.js`: boots the cultural-theme picker and hero slideshow.
- `src/scripts/local-info.js`: live local clock/weather/AQI only; it no longer changes hero images.
- Hero slides use local Almora.ai artwork only, avoiding fragile remote image dependencies.

## Cloudflare Worker router scaffold

`worker/` is intentionally **not deployed** in this pass. It is a safe, credential-free scaffold for the future edge/API layer:

```text
Browser / installed app
        |
        | static HTML/CSS/JS (existing hosting remains unchanged)
        v
  /api/* when enabled later
        |
Cloudflare Worker router
        |-- /api/health
        |-- /api/public/weather
        |-- /api/public/air-quality
        `-- /api/ai   (disabled by default)
             |
             |-- Workers AI / AI Gateway (future binding)
             |-- Groq adapter (future secret)
             |-- NVIDIA adapter (future secret)
             `-- media adapter such as Pexels (future secret)
```

The Worker code currently makes no DNS, billing, account, route, or credential changes. `worker/wrangler.example.toml` is an example only. AI is explicitly disabled unless `ALMORA_ENABLE_AI=1`, an AI binding exists, and a model has been deliberately configured.

## Security and privacy boundaries

- Never commit provider API keys. Use Cloudflare encrypted secrets when deployment is intentionally approved.
- Do not proxy Firebase authentication tokens or weaken Firestore/Auth/App Check rules to make the Worker convenient.
- Resident reports, health-related input, phone/email data, or other personal data must not be broadly logged or cached at the edge.
- Deterministic public-data routes should be preferred over LLM calls when possible.
- AI endpoints must remain informational and must not make medical, government, law-enforcement, wildlife capture/relocation, benefit-eligibility, or other high-impact decisions.
- Public allegations and private-person data must not be generated from unverified reports.

## Migration order

1. Keep current static hosting as the production origin.
2. Stabilize all theme/frame/hero behavior with browser tests.
3. Add Worker local tests and deploy only `/api/health` to a non-production Worker when account authority is available.
4. Add credential-free public-data routes and verify cache/privacy headers.
5. Add Workers AI through a binding behind an explicit feature flag.
6. Add Groq/NVIDIA/Pexels adapters one at a time using encrypted Worker secrets and per-provider rate/cost limits.
7. Point frontend AI calls at `/api/ai` only after provider fallback, observability, privacy, and abuse controls are tested.
8. DNS/custom-domain routing remains a separate authorized production change.

## Files intentionally not reorganized yet

Older top-level HTML/JS files are left in place when moving them would break URLs, Firebase Hosting behavior, bookmarks, or automated refresh jobs. A future mechanical move into `public/` or a build output should be done only with URL-compatibility redirects and full link tests. This pass reorganizes **responsibility and future API structure** without risky public-path churn.
