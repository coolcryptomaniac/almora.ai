# Manual Patch

## Replace

Replace the repository root `index.html` with the included `index.html`.

## Add

Add:

```text
theme-v3.css
theme-v3.js
assets/aipan-mark.svg
```

## Do NOT delete

Keep all existing login, jobs, businesses, services, authentication, backend, rules, and workflow files.

## Why this patch is safer

The previous homepage accumulated several independent UI modules that could all modify navigation and layout. This version consolidates the public homepage into one visual/runtime layer.

It deliberately does **not** import:

```text
public-menu.js
superapp.js
multimedia.js
news-sports.js
ux-upgrade.js
```

because their functionality is represented directly in the new homepage and loading them again would recreate duplicate menus and conflicting layout rules.

Once Theme V3 is stable, useful backend/data functions from those modules can be migrated one-by-one into `theme-v3.js`.
