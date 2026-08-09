# Almora.ai Theme V3 — Manual Drop-in

This package is designed to give you the **first generated design as the default live experience** as quickly as possible, while keeping a second **Heritage** theme available through the theme switcher.

## What changes

Only the homepage is replaced.

Copy these files into the root of `coolcryptomaniac/almora.ai`:

```text
index.html            ← replace existing homepage
theme-v3.css          ← new
theme-v3.js           ← new
assets/aipan-mark.svg ← new
```

Your existing pages such as:

- `resident-login.html`
- `business-login.html`
- `government-login.html`
- `jobs.html`
- `businesses.html`
- `services.html`
- existing backend/authentication files

remain untouched.

## Fast apply

```bash
git checkout main
git pull

# copy the contents of drop-in/ into the repo root
git add index.html theme-v3.css theme-v3.js assets/aipan-mark.svg
git commit -m "feat: launch premium Almora visual system v3"
git push
```

Firebase Hosting should then deploy from `main`.

## Test locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Theme switching

The top-right theme control switches:

- **Modern** — default, based on the first generated design.
- **Heritage** — warmer Kumaoni/Aipan-inspired alternative.

Preference is stored locally in the browser.

## Languages

The language button cycles:

`EN → हिं → कुम → EN`

The selection is saved locally.

## Important integration note

The included homepage is intentionally self-contained so it cannot be broken by older menu/animation scripts.

The AI box currently has a fast local routing response. After this visual version is stable, you can reconnect your existing production AI call inside the `askAI()` function in `theme-v3.js`.

The report dialog currently saves reports locally in the browser for the same reason. Replace that one storage line with your existing authenticated submission function when you are ready.

## Cache

All assets use `?v=3.0.0`, which helps browsers request the new frontend after deployment. If a device still shows an old version, use a hard refresh once or clear site data.
