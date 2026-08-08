# AI agent upgrade summary

This branch now routes the public Almora AI assistant through domain agents and grounds Gemini responses only in explicitly public Firestore collections.

Highlights:

- Gemini 3.6 Flash via Firebase AI Logic
- deterministic agent routing before generation
- verified public Firestore context only
- no private reports/profiles/applications in model context
- Hindi/Hinglish-compatible system behavior
- deterministic fallback when AI is unavailable
- Enter-to-send UX
- AI verification checklist
