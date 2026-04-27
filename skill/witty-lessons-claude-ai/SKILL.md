---
name: witty-lessons
description: Compose a complete Witty lesson as one HTML artifact using the hosted Witty design system runtime (components, tokens, fonts, assets) served via jsDelivr from github.com/bespeakbv/witty-design-system. Triggers when the user asks to create a Witty-les, les-HTML, lesson with Witty bouwblokken, onderwijsles in Witty, etc. Produces a single self-standing HTML artifact that loads shared React bouwblokken over CDN. Bevat ook een sectie "Variant: bouwen direct in de Bespeak LCMS" voor wanneer de gebruiker vraagt de les **in het CMS** te bouwen — dan via `dev-browser --connect` UI-automatisering ipv artifact.
---

# Witty Lessons — claude.ai artifact variant

Genereer een complete Witty-les als één HTML-**artifact** (content type `text/html`) opgebouwd uit 13 bouwblokken (7 content + 6 vraag). Onderwijskundig-neutrale Nederlandse copy, on-brand, klikbaar en interactief.

## Belangrijk onderscheid met de Claude Code skill

- Deze variant schrijft **geen lokaal bestand** — output is altijd een HTML-artifact dat live rendert in claude.ai.
- Alle runtime-assets (components, app shell, CSS, fonts, images) worden geladen van `https://cdn.jsdelivr.net/npm/witty-design-system@1/` — niets wordt ingebed in de artifact zelf.
- Geen build-step, geen lokale filesystem-toegang. De gebruiker ziet de les direct in het artifact-panel en kan hem downloaden als HTML.

## Wanneer activeren

Triggers:
- Gebruiker vraagt om "een Witty-les", "les maken met Witty", "les met Witty"

Niet activeren voor: algemene uitleg over onderwijs, losse bouwblokken zonder lescontext, of ongerelateerde HTML-artifacts.

## Proces

1. **Korte interview** (1 bericht, maximaal 3 vragen tegelijk):
   - Onderwerp (vrije tekst).
   - Doelgroep: MBO-4
   - Doel: kennismaken / verdiepen / oefenen / afsluiten.
   - Optioneel: gewenste lengte (kort / standaard / lang — default standaard).

2. **Kies een template** uit Templates. Respecteer de *Lengteguardrails*.

3. Gebruik de 'Ontwerpmodellen voor educatieve content' om de content te vormen. Vertel na de generatie wat je gebruikt heb en hoe.

4. **Schrijf copy** per blok — zie *NL taal & copy-regels*. Geen lorem, geen placeholders.

5. **Genereer het artifact** volgens het skeleton. Gebruik `application/vnd.ant.html` als artifact-type. Titel van het artifact: `Witty — <lestitel>`.

6. **Rapporteer** terug (onder het artifact): gekozen blokken in volgorde, 1-zin motivering per blok, eventuele open vragen voor de gebruiker.



## **Ontwerpmodellen voor educatieve content**

- 4C/ID model, dit is de leidraad voor het ontwerp
- 5 Moments of Need, aanvullend bij taakondersteuning
- 12 Levers of Transfer, focus op de gewenste gedragsverandering

Gedrags- en motivatielenzen

- SUE / gedragsbeïnvloeding, hoe maken we het gewenste gedrag makkelijker, aantrekkelijker en logischer.
- Breinleren, alleen evidence-informed, niet als neurohype

Evaluatie

- LTEM voor evaluatie, hoe voorkomen we dat we tevredenheid verwarren met effect



## Block catalog — content (7)

| kind | verplichte props | varianten | zet in voor |
|---|---|---|---|
| `tekst` | `variant`, `titel`, `body` | 5 varianten × 4 achtergronden × afbeelding/video × boxed/full | intro, uitleg, tussenkop, afsluiting |
| `quote` | `tekst`, `auteur` | 4 achtergronden × avatar links/rechts/geen × quotes aan/uit | anker, expert-stem, motivatie |
| `external-link` | `type`, `titel`, `body`, `href` | 4 achtergronden × link/download × thumbnail aan/uit | bron, werkblad, verdieping |
| `media-carousel` | `items` | 4 achtergronden × boxed/full | reeks beelden, vergelijking |
| `chat` | `berichten`, `avatars` | 4 achtergronden | modeldialoog, feedback, socratisch gesprek |
| `hotspot` | `afbeelding`, `hotspots` | 4 achtergronden × tekst links/rechts | beeld-ontleden, anatomie |
| `stepper` | `stappen` | 4 achtergronden × één/twee-kolommen | procesuitleg, stappenplan |

## Block catalog — vraag (6)

Alle vraagblokken delen dezelfde header (`eyebrow`, `intro`, `titel`, `instructie`) via `VraagShell`. Elk heeft een `toonFeedback`-toggle.

| kind | antwoordvorm | unieke props | zet in voor |
|---|---|---|---|
| `vraag-tekst` | 4 tekstopties (radio/checkbox) | `multi`, `opties: [{tekst, correct}]`, `layout` (+ media) | kennischeck, begripstoets |
| `vraag-afb` | 2×2 grid beeldkaarten | `multi`, `opties: [{tekst, afbeelding, correct}]` | visuele herkenning |
| `poll` | peiling (geen goed/fout) | `multi`, `opties: [{tekst, stemmen}]` | mening, reflectie |
| `stelling` | juist/onjuist | `juistIsJuist`, `labels` | misconcepties, snelle check |
| `volgorde` | sorteren met ↑/↓ | `opties: [{tekst}]` (array-volgorde = correct) | procesinzicht, chronologie |
| `connect` | matchen links↔rechts | `paren: [{links, rechts, afbeelding?}]` (index = match), `metAfbeelding` | begrippen koppelen |

⚠ **Gotchas**:
- `VraagConnect` gebruikt `paren`, **niet** `opties`. Index bepaalt de match.
- `Stepper` default-achtergrond is `"donker"`. Geef `"standaard"` mee als je wit wil.
- `VraagPoll` default-achtergrond is `"neutral"`.

## Hosted assets

Alle runtime-files staan op `https://cdn.jsdelivr.net/npm/witty-design-system@1/`:

- `colors_and_type_artifact.css` — design tokens + Atkinson Hyperlegible Next inline als base64 woff2 (artifact-CSP-safe; Lexend via Google Fonts @import met system-ui fallback). **Gebruik altijd deze in artifacts**, niet `colors_and_type.css`.
- `components/*.js` — bouwblokken (17 files: 13 kinds + shared helpers, pre-compiled van JSX naar plain JS)
- `app.js`, `app-tweaks.js`, `app-main.js` — shell + tweaks panel runtime

Refereer altijd met absolute URLs. Never use relative paths in the artifact — artifacts have no base URL context.

### Cachebuster (verplicht)

jsdelivr stuurt `cache-control: max-age=604800` (7 dagen). Zonder cachebuster blijft Chrome oude `.js`/`.css` versies serveren ook na een npm publish — namen, fixes en nieuwe features worden dan onzichtbaar in nieuw gegenereerde artifacts.

**Regel**: append `?v={{CACHE_BUST}}` aan elke `cdn.jsdelivr.net/npm/witty-design-system@1/...` URL. **Vervang `{{CACHE_BUST}}` door de huidige `Date.now()`-waarde** (een 13-cijferig millisec-timestamp) op het moment dat je het artifact genereert. Gebruik **één identieke waarde** voor alle scripts in dezelfde artifact (zodat de browser ze binnen het artifact wél kan cachen).

## Images: gebruik `WITTY_ASSETS[...]`, nooit directe URLs

Claude's artifact `img-src` CSP staat **geen enkele externe CDN** toe — maar `data:` URIs wél. De runtime bevat daarom `assets.js` met alle placeholder-afbeeldingen als base64-data. Laad dit script **vóór** je TWEAK_DEFAULTS-blok en gebruik `WITTY_ASSETS["<naam>"]` overal waar een image-URL hoort.

Beschikbare keys in `WITTY_ASSETS`:

| Key | Gebruik in kind |
|---|---|
| `avatar-annemarie` | `quote.avatarSrc`, `chat.avatars.links/rechts` |
| `avatar-michel` | `quote.avatarSrc`, `chat.avatars.links/rechts` |
| `tekst-image` | `tekst.mediaSrc` (bij `mediaType: "afbeelding"`) |
| `tekst-video-thumb` | `tekst.mediaSrc` (bij `mediaType: "video"`) |
| `media-carousel` | `media-carousel.items[].src` |
| `hotspot-image` | `hotspot.afbeelding` |
| `external-link-thumb` | `external-link.afbeelding` |
| `vraag-img-1`, `vraag-img-2` | `vraag-afb.opties[].afbeelding` |

**Voorbeelden in blocks:**

```js
{ kind: "quote", avatarSrc: WITTY_ASSETS["avatar-annemarie"], ... }
{ kind: "tekst", variant: "media-links", mediaSrc: WITTY_ASSETS["tekst-image"], ... }
{ kind: "hotspot", afbeelding: WITTY_ASSETS["hotspot-image"], ... }
{ kind: "chat", avatars: { links: WITTY_ASSETS["avatar-annemarie"], rechts: WITTY_ASSETS["avatar-michel"] }, ... }
{ kind: "media-carousel", items: [
  { src: WITTY_ASSETS["media-carousel"], soort: "afbeelding", alt: "…" }
] }
{ kind: "vraag-afb", opties: [
  { tekst: "…", afbeelding: WITTY_ASSETS["vraag-img-1"], correct: true },
  { tekst: "…", afbeelding: WITTY_ASSETS["vraag-img-2"], correct: false }
] }
```

**Gebruiker levert zelf een afbeelding aan?** Claude's chat-upload genereert een `https://claudeusercontent.com/...`-URL — die mag wél door `img-src`. In dat geval gebruik je die URL direct als string ipv `WITTY_ASSETS[...]`.

**Nooit doen**: URLs naar `jsdelivr.net`, `github.io`, of enige andere externe image-host in block-props zetten — die worden stuk voor stuk geblokkeerd.

## Per-blok prop-referentie

### `tekst`
```js
{
  id: "t1", kind: "tekst", naam: "Introductie",
  variant: "media-links" | "media-rechts" | "een-kolom" | "gecentreerd" | "twee-kolommen",
  achtergrond: "standaard" | "licht" | "donker" | "neutral",
  onderSpacing: true,
  toonTitel: true, toonSubtitel: true,
  titel: "…", subtitel: "…", body: "…",
  body2: "…",                // alleen bij "twee-kolommen"
  mediaType: "afbeelding" | "video",
  mediaSrc: WITTY_ASSETS["tekst-image"],
  mediaDimensions: "boxed" | "full",
  toonPlayknop: true
}
```

### `quote`
```js
{
  id: "q1", kind: "quote", naam: "Quote …",
  achtergrond: "…", onderSpacing: true,
  tekst: "…", auteur: "Annemarie Docter",
  avatarSrc: WITTY_ASSETS["avatar-annemarie"],
  toonAvatar: true, avatarPositie: "rechts" | "links", metQuotes: true
}
```
Beschikbare avatars: `avatar-annemarie.jpg`, `avatar-michel.jpg`.

### `external-link`
```js
{
  id: "e1", kind: "external-link", naam: "Werkblad",
  achtergrond: "…", onderSpacing: true,
  type: "link" | "download",
  titel: "…", body: "…", linkTekst: "…", href: "#",
  toonAfbeelding: true,
  afbeelding: WITTY_ASSETS["external-link-thumb"]
}
```

### `media-carousel`
```js
{
  id: "m1", kind: "media-carousel", naam: "…",
  achtergrond: "…", onderSpacing: true,
  items: [
    { src: WITTY_ASSETS["media-carousel"], soort: "afbeelding", alt: "…" },
    { src: WITTY_ASSETS["media-carousel"], soort: "video", alt: "…" }
  ],
  mediaDimensions: "boxed" | "full", toonPlayknop: true
}
```
Minimaal 2 items. Placeholder asset mag herhaald met verschillende alt.

### `chat`
```js
{
  id: "c1", kind: "chat", naam: "…",
  achtergrond: "…", onderSpacing: true,
  titel: "…",
  avatars: {
    links:  WITTY_ASSETS["avatar-annemarie"],
    rechts: WITTY_ASSETS["avatar-michel"]
  },
  // Personen-namen — gerenderd door Chat.js bij berichten, en gebruikt door
  // de CMS-export. Verzin altijd realistische voornaam + achternaam (zie NL
  // taal & copy-regels). Volgorde: index 0 = links, index 1 = rechts.
  personen: [
    { naam: "Anna de Vries", positie: "links"  },
    { naam: "Tom Bakker",    positie: "rechts" }
  ],
  berichten: [
    { auteur: "rechts", tekst: "…" },
    { auteur: "links",  tekst: "…" },
    { auteur: "rechts", titel: "Mooi begin", tekst: "…" }
  ]
}
```

### `hotspot`
```js
{
  id: "h1", kind: "hotspot", naam: "…",
  achtergrond: "…", onderSpacing: true,
  titel: "…", body: "…",
  afbeelding: WITTY_ASSETS["hotspot-image"],
  hotspots: [
    { x: 38, y: 28, titel: "…", body: "…" }
    // x/y zijn percentages 0–100. Houd ze >10% uit elkaar.
  ],
  textPositie: "links" | "rechts",
  startIndex: 0
}
```

### `stepper`
```js
{
  id: "s1", kind: "stepper", naam: "…",
  achtergrond: "standaard" | "licht" | "donker" | "neutral",  // default "donker"
  onderSpacing: true,
  layout: "een-kolom" | "twee-kolommen",
  stappen: [
    { titel: "…", subtitel: "…", body: "…" }
    // 3–6 stappen werkt het best
  ]
}
```

### `vraag-tekst`
```js
{
  id: "vq1", kind: "vraag-tekst", naam: "…",
  achtergrond: "…",
  eyebrow: "Vraag 1 van 4", intro: "…", titel: "…", instructie: "Kies één antwoord.",
  multi: false,
  opties: [
    { tekst: "…", correct: true },
    { tekst: "…", correct: false },
    // 4 bij "alleen-tekst", 3 mag bij media
  ],
  toonFeedback: false,
  layout: "alleen-tekst" | "media-links" | "media-rechts",
  mediaType: "afbeelding" | "video",
  mediaSrc: WITTY_ASSETS["tekst-image"],
  toonPlayknop: true
}
```

### `vraag-afb`
```js
{
  id: "va1", kind: "vraag-afb", naam: "…",
  achtergrond: "…", eyebrow: "…", titel: "…",
  instructie: "Kies één afbeelding.", multi: false,
  opties: [
    { tekst: "…", afbeelding: WITTY_ASSETS["vraag-img-1"], correct: true },
    { tekst: "…", afbeelding: WITTY_ASSETS["vraag-img-2"], correct: false }
    // idealiter 4 (2×2)
  ],
  toonFeedback: false
}
```

### `poll`
```js
{
  id: "p1", kind: "poll", naam: "…",
  achtergrond: "neutral",           // default
  eyebrow: "Poll", titel: "…", instructie: "Kies één antwoord.", multi: false,
  opties: [
    { tekst: "…", stemmen: 42 },
    { tekst: "…", stemmen: 28 }
    // gebruik realistische cijfers, vermijd 25/25/25/25
  ],
  toonFeedback: false
}
```

### `stelling`
```js
{
  id: "st1", kind: "stelling", naam: "…",
  achtergrond: "…", eyebrow: "Stelling 1", titel: "…",
  instructie: "Kies Juist of Onjuist.",
  juistIsJuist: true,
  labels: { juist: "Juist", onjuist: "Onjuist" },
  toonFeedback: false
}
```

### `volgorde`
```js
{
  id: "vo1", kind: "volgorde", naam: "…",
  achtergrond: "…", eyebrow: "Vraag 1", titel: "…",
  instructie: "Gebruik de pijlen om de opties te verplaatsen.",
  opties: [
    // Deze volgorde = JUIST. Component shuffled zelf in de UI.
    { tekst: "…" }, { tekst: "…" }, { tekst: "…" }, { tekst: "…" }
  ],
  toonFeedback: false
}
```

### `connect`
```js
{
  id: "co1", kind: "connect", naam: "…",
  achtergrond: "…", eyebrow: "Vraag 2", titel: "…",
  instructie: "Sleep of gebruik de pijlen om te matchen.",
  metAfbeelding: false,
  paren: [
    // paren[i].links hoort bij paren[i].rechts (index = juiste match)
    { links: "…", rechts: "…" }
  ],
  toonFeedback: false
}
```

## Templates

### 0. Kort (3 blokken)
`tekst (een-kolom) → stelling → quote`

### 1. Concept-introductie (5–6 blokken)
`tekst (een-kolom) → quote → tekst (media-links) → vraag-tekst → stepper → poll`

### 2. Vaardigheidsoefening (5 blokken)
`tekst (gecentreerd) → stepper → external-link (download) → volgorde → vraag-tekst (multi)`

### 3. Bron-analyse (6 blokken)
`tekst (media-rechts) → external-link (link) → hotspot → chat → stelling → connect`

### 4. Reflectie-afsluiting (4 blokken)
`tekst (een-kolom) → vraag-afb → poll → quote`

### Compositieregels
- Open **altijd** met `tekst` (oriëntatie).
- Minstens één interactief blok.
- Niet twee identieke soorten blokken na elkaar, tenzij de user om een examen/exam vraagt
- Wissel achtergronden af: `standaard → licht → standaard → donker → standaard`. Donker max 2×.

## Lengteguardrails

| Lengte | Blokken |
|---|---|
| kort | 5–7 |
| standaard | 8–12 |
| lang | 14–25 |

## NL taal & copy-regels

- **Taal**: Nederlands. Geen lorem.
- **Taalniveau:** CEFR B1, tenzij de gebruiker anders vraagt
- **Persoon**: `je`-vorm. Nooit `u`.
- **Casing**: sentence case voor titels en subtitels.
- **Toon**: rustig, instructief, neutraal. Geen uitroeptekens, geen emoji.
- **Lengte**: titel ≤ 8-12 woorden, subtitel ≤ 6, body 2–4 zinnen. Stepper.body 3–5 zinnen per stap.
- **Doelgroep**: MBO-4: beroepscontext, abstracte concepten mogen.
- **Namen**: Verzin namen voor de avatars, altijd voornaam en achternaam

## Toegankelijkheid

- **Kleur niet als enige drager**: feedback combineert kleur + icon + tekst.
- **Gebruik donkere varianten spaarzaam**: max 2× per les, niet voor blokken met veel body-tekst.

## HTML skeleton (artifact)

Produceer dit als je artifact met MIME `text/html`. Vervang `<!-- lestitel -->` en de `blocks`-array.

```html
<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Witty — <!-- lestitel --></title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/witty-design-system@1/colors_and_type_artifact.css?v={{CACHE_BUST}}" />
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: var(--font-body);
      color: var(--ink);
      background: var(--white);
    }

    /* Page scaffolding */
    .page { display: flex; flex-direction: column; }
    .block-frame { position: relative; }
    .block-label {
      position: absolute; top: 12px; left: 12px; z-index: 2;
      background: rgba(255,255,255,0.88); backdrop-filter: blur(6px);
      border: 1px solid var(--neutral-200); color: var(--neutral-500);
      font-family: var(--font-body); font-size: 11px; font-weight: 700;
      letter-spacing: 0.04em; text-transform: uppercase;
      padding: 4px 8px; border-radius: 4px; pointer-events: none;
      opacity: 0; transition: opacity 120ms ease;
    }
    body.tweaks-on .block-label { opacity: 1; }
    .block-frame[data-selected="true"]::before {
      content: ""; position: absolute; inset: 0;
      border: 2px solid var(--teal-600); pointer-events: none; z-index: 3;
    }

    /* Tweaks panel */
    .tweaks {
      position: fixed; right: 16px; bottom: 16px; width: 320px; max-height: 80vh;
      overflow: auto; background: #fff; border: 1px solid var(--neutral-200);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(16,24,40,0.16), 0 2px 6px rgba(16,24,40,0.08);
      font-family: var(--font-body); font-size: 13px; color: var(--ink);
      z-index: 1001; display: none;
    }
    body.tweaks-on .tweaks { display: block; }
    .tweaks-header { padding: 12px 14px; border-bottom: 1px solid var(--neutral-200); display: flex; align-items: center; justify-content: space-between; }
    .tweaks-header h4 { margin: 0; font-family: var(--font-display); font-size: 14px; font-weight: 700; }
    .tweaks-sub { padding: 8px 14px; border-bottom: 1px solid var(--neutral-100); color: var(--neutral-500); font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 700; }
    .tweaks-blocklist { padding: 8px; border-bottom: 1px solid var(--neutral-100); display: flex; flex-direction: column; gap: 2px; max-height: 180px; overflow: auto; }
    .tweaks-blocklist button { all: unset; padding: 6px 10px; border-radius: 6px; cursor: pointer; color: var(--ink-muted); font-size: 12px; display: flex; align-items: center; gap: 8px; }
    .tweaks-blocklist button:hover { background: var(--neutral-50); }
    .tweaks-blocklist button.active { background: var(--teal-50); color: var(--teal-700); font-weight: 700; }
    .tweaks-blocklist .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--neutral-200); }
    .tweaks-blocklist button.active .dot { background: var(--teal-600); }
    .tweaks-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 14px; }
    .tw-field { display: flex; flex-direction: column; gap: 6px; }
    .tw-field label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--neutral-500); font-weight: 700; }
    .tw-seg { display: flex; background: var(--neutral-50); border: 1px solid var(--neutral-200); border-radius: 6px; padding: 2px; flex-wrap: wrap; gap: 2px; }
    .tw-seg button { all: unset; flex: 1 1 auto; text-align: center; padding: 6px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; color: var(--ink-muted); min-width: 40px; }
    .tw-seg button[aria-pressed="true"] { background: #fff; color: var(--ink); font-weight: 700; box-shadow: 0 1px 2px rgba(16,24,40,0.08); }
    .tw-toggle { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--ink); }
    .tw-switch { position: relative; width: 36px; height: 20px; background: var(--neutral-200); border-radius: 999px; cursor: pointer; transition: background 160ms ease; flex-shrink: 0; }
    .tw-switch::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; box-shadow: 0 1px 2px rgba(16,24,40,0.2); transition: left 160ms ease; }
    .tw-switch[aria-checked="true"] { background: var(--teal-600); }
    .tw-switch[aria-checked="true"]::after { left: 18px; }
    .tw-text { border: 1px solid var(--neutral-200); border-radius: 6px; padding: 6px 8px; font-family: var(--font-body); font-size: 12px; color: var(--ink); width: 100%; resize: vertical; }
    .tw-text:focus { outline: 2px solid var(--teal-600); outline-offset: -1px; border-color: transparent; }
    textarea.tw-text { min-height: 64px; }
    body.tweaks-on .block-frame { cursor: pointer; }
    body.tweaks-on .block-frame:hover::after { content: ""; position: absolute; inset: 0; border: 2px dashed var(--teal-600); pointer-events: none; z-index: 1; }

    /* Tweaks toggle button */
    .tweaks-toggle {
      position: fixed; left: 16px; bottom: 16px; z-index: 1000;
      font-family: var(--font-body); font-size: 12px; font-weight: 700;
      letter-spacing: 0.02em; padding: 8px 14px; border-radius: 999px;
      border: 1px solid var(--neutral-200); background: #fff; color: var(--ink);
      cursor: pointer; box-shadow: 0 2px 8px rgba(16,24,40,0.08);
      transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
    }
    .tweaks-toggle:hover { background: var(--neutral-50); }
    body.tweaks-on .tweaks-toggle { background: var(--teal-600); color: #fff; border-color: var(--teal-600); }

    /* CMS export button — copies stripped blocks JSON to clipboard for the Witty bookmarklet. */
    .cms-export {
      position: fixed; left: 138px; bottom: 16px; z-index: 1000;
      font-family: var(--font-body); font-size: 12px; font-weight: 700;
      letter-spacing: 0.02em; padding: 8px 14px; border-radius: 999px;
      border: 1px solid var(--neutral-200); background: #fff; color: var(--ink);
      cursor: pointer; box-shadow: 0 2px 8px rgba(16,24,40,0.08);
      transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
    }
    .cms-export:hover { background: var(--neutral-50); }
    .cms-export.cms-export--ok { background: var(--teal-600); color: #fff; border-color: var(--teal-600); }
    .cms-export.cms-export--err { background: #c0392b; color: #fff; border-color: #c0392b; }
  </style>
</head>
<body>
  <div id="root" class="page"></div>
  <div class="tweaks" id="tweaks-panel"></div>
  <button type="button" id="tweaks-toggle" class="tweaks-toggle" aria-pressed="false">Tweaks aan</button>
  <button type="button" id="cms-export" class="cms-export" title="Kopieer blocks-JSON voor de Witty CMS bookmarklet">Exporteer voor CMS</button>
  <script>
    (function () {
      var btn = document.getElementById("tweaks-toggle");
      function sync() {
        var on = document.body.classList.contains("tweaks-on");
        btn.setAttribute("aria-pressed", String(on));
        btn.textContent = on ? "Tweaks uit" : "Tweaks aan";
      }
      btn.addEventListener("click", function () {
        var on = document.body.classList.contains("tweaks-on");
        window.postMessage({ type: on ? "__deactivate_edit_mode" : "__activate_edit_mode" }, "*");
      });
      new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ["class"] });
      sync();
    })();
  </script>
  <script>
    // CMS export — strip artifact-only data and runtime URIs, then copy clean blocks
    // JSON to clipboard. The Witty CMS bookmarklet picks it up on the LCMS-tab.
    (function () {
      var btn = document.getElementById("cms-export");
      if (!btn) return;

      // Replace data:/blob: URIs with null (CMS expects assetId UUIDs;
      // user uploads images manually after import). Recursively cleans
      // strings everywhere; does NOT strip object keys at this level —
      // top-level artifact-only keys (id/naam) are dropped per-block below.
      function cleanValue(v) {
        if (typeof v === "string") {
          if (v.startsWith("data:") || v.startsWith("blob:") || v.indexOf("claudeusercontent.com") !== -1) return null;
          return v;
        }
        if (Array.isArray(v)) return v.map(cleanValue);
        if (v && typeof v === "object") {
          var out = {};
          for (var k in v) out[k] = cleanValue(v[k]);
          return out;
        }
        return v;
      }
      // Strip artifact-only top-level fields. `id` and `naam` are display-only
      // hooks for the tweaks panel; the CMS assigns its own UUIDs and ignores
      // naam. Critically: only at TOP level — `personen[i].naam` (chat speakers)
      // and other nested naam-like fields stay intact.
      function stripValue(v) {
        var cleaned = cleanValue(v);
        if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned)) {
          delete cleaned.id;
          delete cleaned.naam;
        }
        return cleaned;
      }

      // Per-kind remap from artifact-shape to CMS-builder-shape.
      function remapBlock(b) {
        var s = stripValue(b);
        if (s.kind === "external-link") {
          return {
            kind: "link",
            achtergrond: s.achtergrond,
            titel: s.titel,
            instructie: s.body,
            url: s.href,
            linkLabel: s.linkTekst,
          };
        }
        if (s.kind === "media-carousel") {
          return null;  // skipped — CMS Media is single-asset, not a carousel
        }
        if (s.kind === "chat") {
          // Build map auteur ("links"/"rechts") → persoonIndex.
          // Prefer authored personen[] (with names) when present, else fallback to
          // ordering by first-seen auteur in berichten with default names.
          // Berichten may use either `auteur` (artifact-shape) or `persoonIndex`
          // (CMS-shape, accepted as pass-through).
          var seen = {};
          var personen = [];
          if (Array.isArray(s.personen) && s.personen.length) {
            s.personen.forEach(function (p, i) {
              personen.push({ naam: p.naam || ("Persoon " + (i + 1)), positie: p.positie });
              if (p.positie) seen[p.positie] = i;
            });
          }
          (s.berichten || []).forEach(function (m) {
            if (m.auteur && !(m.auteur in seen)) {
              seen[m.auteur] = personen.length;
              personen.push({ naam: "Persoon " + (personen.length + 1), positie: m.auteur });
            }
          });
          return {
            kind: "chat",
            achtergrond: s.achtergrond,
            personen: personen,
            berichten: (s.berichten || []).map(function (m) {
              var idx = (typeof m.persoonIndex === "number")
                ? m.persoonIndex
                : (m.auteur in seen ? seen[m.auteur] : 0);
              return { tekst: m.tekst, titel: m.titel, persoonIndex: idx };
            }),
          };
        }
        return s;
      }

      // Show modal-dialog with the JSON pre-selected. Used when navigator.clipboard
      // is blocked by Permissions-Policy (claude.ai artifact iframes do this).
      function showExportDialog(payload, summary) {
        var existing = document.getElementById("cms-export-dialog");
        if (existing) existing.remove();

        var backdrop = document.createElement("div");
        backdrop.id = "cms-export-dialog";
        backdrop.style.cssText =
          "position:fixed;inset:0;z-index:99999;background:rgba(16,24,40,0.5);" +
          "display:flex;align-items:center;justify-content:center;padding:24px;" +
          "font-family:var(--font-body),system-ui,sans-serif;";

        var card = document.createElement("div");
        card.style.cssText =
          "background:#fff;border-radius:12px;padding:20px;max-width:680px;width:100%;" +
          "max-height:80vh;display:flex;flex-direction:column;gap:12px;" +
          "box-shadow:0 20px 60px rgba(16,24,40,0.3);";

        var title = document.createElement("h3");
        title.textContent = "Exporteer voor CMS";
        title.style.cssText = "margin:0;font-size:18px;font-weight:700;color:var(--ink);";

        var info = document.createElement("p");
        info.textContent = summary + " — selecteer alles en kopieer (Cmd+A, Cmd+C), plak daarna in de LCMS-tab via de Witty-bookmarklet.";
        info.style.cssText = "margin:0;font-size:13px;color:var(--ink-muted,#6B7280);line-height:1.5;";

        var ta = document.createElement("textarea");
        ta.value = payload;
        ta.readOnly = true;
        ta.style.cssText =
          "flex:1;min-height:300px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;" +
          "font-size:12px;border:1px solid var(--neutral-200,#E5E7EB);border-radius:8px;" +
          "padding:12px;resize:vertical;width:100%;box-sizing:border-box;color:var(--ink);";

        var actions = document.createElement("div");
        actions.style.cssText = "display:flex;gap:8px;justify-content:flex-end;";

        var copyBtn = document.createElement("button");
        copyBtn.textContent = "Selecteer alles";
        copyBtn.style.cssText =
          "padding:8px 14px;border-radius:6px;border:1px solid var(--neutral-200,#E5E7EB);" +
          "background:#fff;color:var(--ink);font-weight:600;font-size:13px;cursor:pointer;";
        copyBtn.onclick = function () {
          ta.focus();
          ta.select();
          // Try execCommand as a best-effort fallback (also restricted in some iframes).
          try {
            var ok = document.execCommand && document.execCommand("copy");
            if (ok) {
              copyBtn.textContent = "✓ Gekopieerd";
              copyBtn.style.background = "var(--teal-600,#0D9488)";
              copyBtn.style.color = "#fff";
              copyBtn.style.borderColor = "var(--teal-600,#0D9488)";
            } else {
              copyBtn.textContent = "Selectie klaar — Cmd+C";
            }
          } catch (e) {
            copyBtn.textContent = "Selectie klaar — Cmd+C";
          }
        };

        var closeBtn = document.createElement("button");
        closeBtn.textContent = "Sluiten";
        closeBtn.style.cssText =
          "padding:8px 14px;border-radius:6px;border:none;" +
          "background:var(--ink,#1F2937);color:#fff;font-weight:600;font-size:13px;cursor:pointer;";
        closeBtn.onclick = function () { backdrop.remove(); };

        actions.appendChild(copyBtn);
        actions.appendChild(closeBtn);
        card.appendChild(title);
        card.appendChild(info);
        card.appendChild(ta);
        card.appendChild(actions);
        backdrop.appendChild(card);
        backdrop.addEventListener("click", function (e) {
          if (e.target === backdrop) backdrop.remove();
        });
        document.body.appendChild(backdrop);

        // Pre-select the textarea so Cmd+C works immediately.
        setTimeout(function () { ta.focus(); ta.select(); }, 50);
      }

      btn.addEventListener("click", async function () {
        var origText = btn.textContent;
        var payload, summary, mapped, skipped;
        try {
          var blocks = (window.TWEAK_DEFAULTS && window.TWEAK_DEFAULTS.blocks) || [];
          skipped = 0;
          mapped = blocks.map(remapBlock).filter(function (b) {
            if (b === null) { skipped++; return false; }
            return true;
          });
          payload = JSON.stringify({ blocks: mapped }, null, 2);
          summary = mapped.length + " blokken klaar" + (skipped ? " (" + skipped + " overgeslagen)" : "");
        } catch (e) {
          btn.classList.add("cms-export--err");
          btn.textContent = "✗ " + (e.message || "Fout");
          setTimeout(function () { btn.classList.remove("cms-export--err"); btn.textContent = origText; }, 3000);
          return;
        }

        // Try modern Clipboard API first; fall back to dialog if blocked
        // (claude.ai artifact iframes block clipboard via Permissions-Policy).
        var copiedDirectly = false;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(payload);
            copiedDirectly = true;
          } catch (e) {
            // Permission denied or policy blocked — fall through to dialog.
          }
        }

        if (copiedDirectly) {
          btn.classList.add("cms-export--ok");
          btn.textContent = "✓ " + summary + " — gekopieerd";
          setTimeout(function () { btn.classList.remove("cms-export--ok"); btn.textContent = origText; }, 2500);
        } else {
          showExportDialog(payload, summary);
        }
      });
    })();
  </script>

  <!-- Base64 asset data URIs — load BEFORE TWEAK_DEFAULTS so WITTY_ASSETS is defined. -->
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/assets.js?v={{CACHE_BUST}}"></script>

  <script>
    // tekst + vraag-tekst resolve mediaSrc via window.MEDIA_SRC[b.mediaType], not b.mediaSrc.
    // Override with data URIs so tekst media ook werkt in het artifact.
    window.MEDIA_SRC = {
      afbeelding: WITTY_ASSETS["tekst-image"],
      video:      WITTY_ASSETS["tekst-video-thumb"]
    };
    window.ALLOWED_KINDS = null;
    window.TWEAK_DEFAULTS = {
      "settings": { "radius": "klein" },
      "blocks": [
        {
          "id": "t1", "kind": "tekst", "naam": "Introductie",
          "variant": "media-links", "achtergrond": "standaard", "onderSpacing": true,
          "toonTitel": true, "toonSubtitel": true,
          "titel": "…", "subtitel": "…", "body": "…",
          "mediaType": "afbeelding", "mediaSrc": WITTY_ASSETS["tekst-image"]
        }
        // …meer blokken…
      ]
    };
  </script>

  <!-- React (UMD) -->
  <script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>

  <!-- Hosted Witty runtime — alle witty-design-system URLs delen één ?v={{CACHE_BUST}} per artifact-generatie. -->
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/TekstBouwblok.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/BlockShared.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/Quote.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/ExternalLink.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/MediaCarousel.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/Chat.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/Hotspot.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/Stepper.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagShell.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagPrimitives.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagTekst.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagAfbeeldingen.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagPoll.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagStelling.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagVolgorde.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/components/VraagConnect.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/app.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/app-tweaks.js?v={{CACHE_BUST}}"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@1/app-main.js?v={{CACHE_BUST}}"></script>
</body>
</html>
```

## Output format

Produceer de les **altijd** als artifact met:
- type: `text/html`
- title: `Witty — <jouw lestitel>`
- Inhoud: het volledige HTML-skeleton hierboven, met `window.TWEAK_DEFAULTS.blocks` ingevuld.

Na het artifact: korte chat-response met:
- Gekozen blokken in volgorde (kind · naam)
- 1-zin motivering per blok waarom het nu past
- Eventuele open vragen aan de gebruiker (bv. "Welke avatar wil je voor de Quote?")

## Gotchas & veelgemaakte fouten

- **`<div id="root">` MOET in de body staan** — letterlijk `<div id="root" class="page"></div>` direct in `<body>`. `app-main.js` doet `createRoot(document.getElementById('root'))` en faalt met `Target container is not a DOM element` als die div ontbreekt. Niet hernoemen, niet weglaten, niet inwikkelen.
- **Skeleton volgorde is verplicht** — body bevat in deze exacte volgorde: `#root` div, `#tweaks-panel` div, `#tweaks-toggle` button, `#cms-export` button, scripts. `assets.js` vóór `TWEAK_DEFAULTS`-script vóór React-scripts vóór `app-*.js`. Volgorde aanpassen breekt de mount.
- **Relatieve paden breken** — alle `src`/`href` in de artifact moeten absolute `https://cdn.jsdelivr.net/npm/witty-design-system@1/...` URLs zijn.
- **`{{CACHE_BUST}}` placeholder MOET vervangen** — vervang elke `{{CACHE_BUST}}` in het skeleton door dezelfde `Date.now()`-waarde (een 13-cijferig millisec-timestamp, bv. `1714240800000`). Eén waarde voor alle URLs in dit artifact. Niet vervangen = jsdelivr-cache levert oude `.js` versies en nieuwe features (chat-namen, fixes) zijn onzichtbaar.
- **`VraagConnect.paren` ≠ `opties`** — andere prop-naam, index bepaalt match.
- **Geen `type="module"` of `type="text/babel"`** — scripts zijn pre-compiled `.js` (esbuild output). Plain `<script src="…">` is correct. Niet veranderen.
- **Blok zonder `id` of `kind`** — wordt genegeerd of crasht. Altijd beide meegeven.
- **Stepper default `"donker"`** — expliciet `"standaard"` voor witte achtergrond.
- **ALLOWED_KINDS = null** — laat staan, anders verbiedt de app bepaalde kinds.

## Default-aan voor tweaks-paneel

Standaard is het paneel uit bij opening (gebruiker klikt "Tweaks aan"). Wil de gebruiker het standaard aan? Pas de initialState-regel in `app-main.jsx` niet aan (host-asset), maar voeg in de artifact een klein scriptje toe **ná** de app-scripts:

```html
<script>
  setTimeout(() => window.postMessage({ type: "__activate_edit_mode" }, "*"), 200);
</script>
```

De timeout wacht op React-mount. Alleen toevoegen als gebruiker expliciet vraagt.

---

## CMS-variant: aparte skill

Wil de gebruiker de les **direct in de Bespeak LCMS** opslaan ("in cms", "in lcms", "voeg blok toe in cms")? Dat is een ander pad: één GraphQL save-mutation via `__APOLLO_CLIENT__.mutate()`, geen artifact. Zie [`witty-lessons-cms`](../witty-lessons-cms/SKILL.md) — zelfde block-shape, andere uitvoering.

Triggers voor déze (artifact-)skill blijven: "een witty-les", "les met witty", "les-HTML". Voor CMS-mutaties switcht Claude naar de andere skill.

## Exporteer-naar-CMS knop (claude.ai → bookmarklet → LCMS)

Naast de Tweaks-toggle staat een **"Exporteer voor CMS"** knop. Workflow voor wie de les in claude.ai ontwerpt en daarna naar het CMS wil overhevelen zonder Claude Code:

1. In claude.ai: speel met de tweaks, copy, layout
2. Klik **Exporteer voor CMS** → blocks-JSON staat op het clipboard (data: URIs zijn vervangen door `null`, want het CMS verwacht assetId-UUIDs en de gebruiker uploadt afbeeldingen handmatig na import)
3. Switch naar de open LCMS-tab op de juiste building-blocks-pagina
4. Klik de **Witty CMS Import** bookmarklet (eenmalig drag-and-drop in bookmarks bar — zie `witty-lessons-cms/cms-api/bookmarklet-url.txt`)
5. Confirm-dialog "X blokken vervangen Y bestaande" → OK → toast "✓ N blokken opgeslagen"
6. Refresh + handmatig afbeeldingen uploaden waar nodig

De bookmarklet bypasses CSP (Chrome behandelt `javascript:` URLs als user-initiated) en gebruikt cookies van de open LCMS-sessie voor auth — geen network-config nodig.

### Wat de export-knop wegstript

- `id`, `naam` (artifact-only display velden)
- `data:` / `blob:` / `claudeusercontent.com` URIs (assetId blijft null)
- `media-carousel` blokken (geen 1-op-1 CMS-equivalent, worden overgeslagen met "(N overgeslagen)" in de toast)

### Wat de export-knop remapt

- `external-link` (artifact) → `link` (CMS): `linkTekst` → `linkLabel`, `href` → `url`, `body` → `instructie`
- `chat`: `avatars: {links, rechts}` + `berichten[].auteur` → `personen: [...]` + `berichten[].persoonIndex`
