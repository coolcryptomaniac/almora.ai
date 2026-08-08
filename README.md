# Almora.ai

> **Your town, one conversation away.**

Almora.ai is an open civic-tech experiment to create an AI-native coordination layer for Almora, Uttarakhand: services, commerce, jobs, transport, tourism, farming, wildlife conflict, healthcare navigation, education, roads, traffic, prices and government-service navigation.

## What works now

- Modern responsive AI command-center UI
- Live OpenStreetMap centered on Almora
- Browser geolocation
- Live Almora weather via Open-Meteo
- Realtime Firestore public-data listeners
- Resident issue reporting and moderation
- Resident accounts and private skills profiles
- Moderated local jobs and business marketplace
- Moderator/admin console
- Firebase App Check using reCAPTCHA Enterprise
- Firebase AI Logic client with deterministic fallback
- 15-agent town registry
- Firebase Hosting CI/CD workflow
- GitHub Pages retained as a manual fallback only

**Important:** civic seed markers are explicitly demo markers. They are not represented as live incidents. Public civic data should only come from moderated resident reports or verified sources.

## Firebase project

Project ID: `almoraai`

The production path is:

`GitHub → GitHub Actions → Firebase Hosting → App Check → Firebase AI Logic / Firestore`

### App Check

The web app initializes App Check with the registered reCAPTCHA Enterprise site key before Auth/Firestore/AI usage. Keep enforcement **off initially**, deploy the app, then review App Check metrics. Turn enforcement on only after valid requests are consistently visible.

For local development after enforcement is enabled, configure Firebase's App Check debug provider rather than disabling production protection.

### Firebase AI Logic

`ai-client.js` uses the Gemini Developer API backend through Firebase AI Logic and currently targets `gemini-3.5-flash`. If AI Logic is unavailable or not yet enabled in the Firebase console, the homepage falls back to deterministic Almora-specific routing instead of failing.

No Gemini API key is stored in this repository.

## Hosting

Firebase Hosting is the primary production host. `.github/workflows/firebase-hosting.yml` supports:

- live deployment from `main`;
- temporary preview channels for pull requests.

The workflow is intentionally skipped until this GitHub Actions secret exists:

`FIREBASE_SERVICE_ACCOUNT_ALMORAAI`

The recommended way to create it is Firebase CLI's official Hosting GitHub integration (`firebase init hosting:github`), which creates the deployment service account and stores the credential as a GitHub secret. Never commit the service-account JSON.

`.github/workflows/pages.yml` is manual-only and exists purely as a fallback; it is not the production path.

## Firestore model

- `reports` — private/unverified resident submissions
- `publicIssues` — moderated public issue feed
- `facilities`
- `jobs`
- `jobSubmissions`
- `jobApplications`
- `candidateProfiles`
- `transport`
- `businesses`
- `businessSubmissions`
- `verifiedSources`
- `moderators`

Unverified submissions are not publicly readable by default. Moderation promotes verified facts into public collections.

## Run locally

Because App Check reCAPTCHA Enterprise validates allowed hostnames, local development should use the official App Check debug provider once enforcement is enabled. Before enforcement, a simple static server is enough:

```bash
python3 -m http.server 8000
```

## Agents

See `agents/registry.json`. Agents are **read-first**. AI may retrieve, classify, summarize and coordinate routine workflows. High-impact actions require accountable humans, especially medical/emergency cases, wildlife intervention, government submissions, accusations, payments and employment decisions.

## Next milestones

- Connect the custom `almora.ai` domain to Firebase Hosting
- Turn on Firebase AI Logic in the Firebase console if not already enabled
- Observe App Check metrics, then enforce it for AI Logic and Firestore
- Verified Almora facilities dataset
- Hindi/English UI and voice
- Transport and road adapters
- Wildlife hotspot analytics
- Public resolution metrics
- Remote Config for switching AI models without redeploying

Before accepting external civic-data contributions, add an explicit open-source license, privacy policy, contribution policy and moderation policy.
