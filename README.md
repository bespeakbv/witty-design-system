# Witty Design System — hosted runtime

Public runtime for the Witty design system: React bouwblokken, tokens, fonts, and demo assets. Published to npm so jsDelivr can serve it on a CSP-allowlisted CDN — used by the `witty-lessons` skill so generated lesson artifacts on claude.ai can load shared runtime files from one canonical URL.

## Base URL (production)

```
https://cdn.jsdelivr.net/npm/witty-design-system@1/
```

`@1` resolves to the latest 1.x.x version (semver-range pin) — patches and minor updates propagate automatically; major bumps require explicit URL change.

## Structure

- `components/*.js` — 13 bouwblok-componenten (Tekst, Quote, Chat, Hotspot, Stepper, Vraag·*…) plus shared helpers, pre-compiled from JSX to plain JS via esbuild and IIFE-wrapped to keep top-level helpers from colliding.
- `components/*.jsx` — original sources, kept for reference. Artifacts use the `.js` files.
- `app.js`, `app-tweaks.js`, `app-main.js` — shell that renders blocks and mounts the live tweaks panel.
- `assets.js` — `window.WITTY_ASSETS = { ... }` with placeholder images as base64 `data:` URIs (artifacts can't fetch external images under most CSPs).
- `colors_and_type.css` — Witty tokens with Google Fonts `@import` for Atkinson Hyperlegible Next + Lexend.
- `colors_and_type_artifact.css` — same tokens, but with Atkinson Hyperlegible Next inlined as base64 woff2 `data:` URIs. Use this in claude.ai artifacts where `font-src` may not allow `fonts.gstatic.com`.
- `fonts/*.ttf` — Atkinson Hyperlegible Next sources (all weights + italics). Licensed under the SIL Open Font License 1.1 — see `fonts/OFL.txt`.
- `assets/*.jpg` — demo images at full resolution.

## Typical usage (claude.ai artifact)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/witty-design-system@1/colors_and_type_artifact.css" />
<script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/assets.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/TekstBouwblok.js"></script>
<!-- …other components, then app.js, app-tweaks.js, app-main.js -->
```

See the `witty-lessons` skill for the full skeleton.

## Build scripts

- `./build-jsx.sh` — esbuild-transforms every `.jsx` to `.js` (IIFE-wrapped). Runs automatically on `npm publish` via `prepublishOnly`.
- `./build-artifact-css.sh` — converts `fonts/*.ttf` → woff2, base64-embeds them into `colors_and_type_artifact.css`. Run manually whenever fonts or `colors_and_type.css` change.

## CORS

jsDelivr serves all files with `Access-Control-Allow-Origin: *`.

## Credits

- Atkinson Hyperlegible Next — © Braille Institute of America, Inc. — https://www.brailleinstitute.org/freefont/ — licensed under SIL OFL 1.1.
- All other code and assets — © Bespeak BV.
