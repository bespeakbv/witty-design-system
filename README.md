# Witty Design System — hosted runtime

Public CDN for the Witty design system: React bouwblokken, tokens, fonts, and demo assets. Used by the `witty-lessons` skill so that generated lesson artifacts can load shared runtime files from one canonical URL.

## Base URL

```
https://bespeakbv.github.io/witty-design-system/
```

## Structure

- `components/*.jsx` — 13 bouwblok-componenten (Tekst, Quote, Chat, Hotspot, Stepper, Vraag·*…) plus shared helpers and a simple `lesson-runtime.jsx`.
- `app.jsx`, `app-tweaks.jsx`, `app-main.jsx` — shell that renders blocks and mounts the live tweaks panel.
- `colors_and_type.css` — Witty tokens (colors, spacing, typography).
- `fonts/*.ttf` — Atkinson Hyperlegible Next (all weights + italics). Licensed under the SIL Open Font License 1.1 — see `fonts/OFL.txt`.
- `assets/*.jpg` — demo images used by placeholders (avatars, bouwblok-afbeeldingen).

## Typical usage

Link directly from HTML:

```html
<link rel="stylesheet" href="https://bespeakbv.github.io/witty-design-system/colors_and_type.css" />
<script type="text/babel" src="https://bespeakbv.github.io/witty-design-system/components/TekstBouwblok.jsx"></script>
```

See `witty-lessons` skill for the full skeleton.

## CORS

GitHub Pages serves these files with `Access-Control-Allow-Origin: *`, so Babel-standalone can fetch and compile the JSX at runtime from any origin (including claude.ai artifact iframes).

## Credits

- Atkinson Hyperlegible Next — © Braille Institute of America, Inc. — https://www.brailleinstitute.org/freefont/ — licensed under SIL OFL 1.1.
- All other code and assets — © Bespeak BV.
