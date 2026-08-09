# Almora Homepage Exact V5

This package recreates the homepage in the exact **format direction** shown in your reference screenshot:

- same dark premium layout
- same top-picture direction
- no phone mockup on the hero
- same sidebar structure
- same weather card
- same Almora Now / Experience / Agents / Cultural Radio / Login sections
- Ask AI upgraded to interactive visual result cards

## Files

- `index.html` → replace existing homepage
- `exact-homepage.css` → new stylesheet
- `exact-homepage.js` → interactions
- `config.example.js` → optional Gemini key hookup
- `assets/hero-top.png` → cropped top hero image from your approved screenshot
- `assets/tripti-card.png` → Tripti card image from your approved screenshot

## Manual install

Copy these files into your repo root:

- `index.html`
- `exact-homepage.css`
- `exact-homepage.js`
- `config.example.js` (optional)
- `assets/hero-top.png`
- `assets/tripti-card.png`

Then update the script references exactly as included in `index.html`.

## Gemini notes

The Ask AI box works **immediately** using the built-in visual fallback library.

If you want **live Gemini responses**, do this:

1. copy `config.example.js` to `config.js`
2. fill `window.ALMORA_GEMINI_API_KEY`
3. add `<script src="./config.js"></script>` before `exact-homepage.js`

If Gemini is unavailable, the page still works and returns interactive Almora cards.

## Important honesty note

I cannot actually commit to your GitHub from this run, so I packaged the exact patch for manual commit.
