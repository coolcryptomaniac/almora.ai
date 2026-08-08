# Almora.ai

> **Your town, one conversation away.**

Almora.ai is an open civic-tech experiment to create an AI-native coordination layer for Almora, Uttarakhand: services, commerce, jobs, transport, tourism, farming, wildlife conflict, healthcare navigation, education, roads, traffic, prices and government-service navigation.

## What works now

- Modern responsive AI command-center UI
- Live OpenStreetMap centered on Almora
- Browser geolocation
- Live Almora weather via Open-Meteo
- Map filters for roads, wildlife, health, jobs and transport
- Resident problem-report workflow
- Optional Firestore persistence
- Privacy-first Firestore rules
- 15-agent town registry
- Automatic GitHub Pages deployment workflow

**Important:** civic markers currently included in the map are explicitly seed/demo markers. They are not represented as live incidents. Live civic data should only appear after a verified source or moderated resident report is connected.

## Run locally

```bash
python3 -m http.server 8000
```

## Enable Firebase

1. Create a Firebase project and enable Cloud Firestore.
2. Register a Web app.
3. Copy `firebase-config.example.js` to `firebase-config.js`.
4. Paste the Firebase web-app configuration into it.
5. Deploy `firestore.rules` and `firestore.indexes.json` using Firebase CLI.

Never commit service-account keys or Firebase Admin credentials.

## Firestore model

- `reports` — private/unverified resident submissions
- `publicIssues` — moderated public issue feed
- `facilities`
- `jobs`
- `candidateProfiles`
- `transport`
- `businesses`
- `verifiedSources`

Unverified reports are not publicly readable by default. Moderation should promote verified facts into public collections.

## Agents

See `agents/registry.json`. Agents are **read-first**. AI may retrieve, classify, summarize and coordinate routine workflows. High-impact actions require accountable humans, especially medical/emergency cases, wildlife intervention, government submissions, accusations, payments and employment decisions.

## GitHub Pages

`.github/workflows/pages.yml` deploys the repository on pushes to `main`. In repository settings set **Pages → Source → GitHub Actions**.

## Next milestones

- Firebase Authentication for residents, businesses and moderators
- Moderation/admin dashboard
- Verified Almora facilities dataset
- Live moderated issue markers from Firestore
- Jobs marketplace + private candidate profiles
- Hindi/English UI and voice
- AI gateway with source-backed retrieval and tool calling
- Transport and road adapters
- Wildlife hotspot analytics
- Public resolution metrics

Before accepting external civic-data contributions, add an explicit open-source license, privacy policy, contribution policy and moderation policy.
