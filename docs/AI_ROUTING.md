# Almora AI routing and grounding

The public assistant uses Firebase AI Logic with the Gemini Developer API and routes each request to a domain agent before generation.

## Current agent routing

- `town-concierge` — default router
- `monkey-wildlife` — monkey and wildlife conflict
- `local-jobs` — jobs and employment
- `farm-watch` — farming and crop issues
- `road-access` — roads, potholes, landslides and access
- `transport-watch` — buses, taxis, routes and mobility
- `health-navigator` — healthcare navigation (not diagnosis)
- `education` — schools, students and scholarships
- `price-scam-watch` — prices, scams and integrity reports
- `government-navigator` — schemes and public services
- `tourism` — responsible visitor guidance
- `commerce` — shops, businesses and local services
- `traffic` — traffic and parking

## Grounding boundary

Only these public Firestore collections may be sent to the AI as verified app context:

- `publicIssues`
- `facilities`
- `jobs`
- `transport`
- `businesses`

Private collections such as `reports`, `candidateProfiles`, `jobApplications`, `moderators`, `jobSubmissions`, and `businessSubmissions` must never be added to model context.

The current client sends a compact, capped snapshot of public records. This is appropriate for the MVP while collections are small. Before scale, replace this with query-based retrieval so only records relevant to the user's request and location are sent to the model.

## Trust behavior

If relevant verified data is not present, the model is instructed to state that clearly and give general next steps rather than inventing a town fact. Resident reports remain unverified until moderation promotes them to a public collection.

## Model

The current model is `gemini-3.6-flash` through Firebase AI Logic / Gemini Developer API. Keep the model name configurable in a future Remote Config migration so model upgrades do not require a frontend deployment.
