---
name: witty-lessons
description: Compose a complete Witty lesson as one HTML artifact using the hosted Witty design system runtime (components, tokens, fonts, assets) served via jsDelivr from github.com/bespeakbv/witty-design-system. Triggers when the user asks to create a Witty-les, les-HTML, lesson with Witty bouwblokken, onderwijsles in Witty, etc. Produces a single self-standing HTML artifact that loads shared React bouwblokken over CDN. Bevat ook een sectie "Variant: bouwen direct in de Bespeak LCMS" voor wanneer de gebruiker vraagt de les **in het CMS** te bouwen — dan via `dev-browser --connect` UI-automatisering ipv artifact.
---

# Witty Lessons — claude.ai artifact variant

Genereer een complete Witty-les als één HTML-**artifact** (content type `text/html`) opgebouwd uit 13 bouwblokken (7 content + 6 vraag). Onderwijskundig-neutrale Nederlandse copy, on-brand, klikbaar en interactief.

## Belangrijk onderscheid met de Claude Code skill

- Deze variant schrijft **geen lokaal bestand** — output is altijd een HTML-artifact dat live rendert in claude.ai.
- Alle runtime-assets (components, app shell, CSS, fonts, images) worden geladen van `https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/` — niets wordt ingebed in de artifact zelf.
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

3. **Verplicht: Gebruik de 'Ontwerpmodellen voor educatieve content' om de content te vormen.** Vertel na de generatie wat je gebruikt heb en hoe.

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

Alle runtime-files staan op `https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/`:

- `colors_and_type_artifact.css` — design tokens + Atkinson Hyperlegible Next inline als base64 woff2 (artifact-CSP-safe; Lexend via Google Fonts @import met system-ui fallback). **Gebruik altijd deze in artifacts**, niet `colors_and_type.css`.
- `components/*.js` — bouwblokken (17 files: 13 kinds + shared helpers, pre-compiled van JSX naar plain JS)
- `app.js`, `app-tweaks.js`, `app-main.js` — shell + tweaks panel runtime

Refereer altijd met absolute URLs. Never use relative paths in the artifact — artifacts have no base URL context.

### Versie-resolve (verplicht)

jsDelivr's range-tags (`@1`, `@latest`) hebben een edge-cache die niet altijd direct ververst na npm publish — dan serveert de CDN nog dagen oude `.js` files. Gepin'de versies (`@1.0.7`) raken een aparte tarball-cache die wél direct goed staat. Een cachebuster query-string fixt dit niet — het probleem zit upstream van de browser-cache.

**Regel**: pin de versie. Vóór de artifact-generatie: doe één WebFetch om de huidige laatste versie op te halen, en vervang `{{WDS_VERSION}}` overal in het skeleton door die waarde.

```
WebFetch("https://cdn.jsdelivr.net/npm/witty-design-system/package.json")
→ {"name":"witty-design-system","version":"1.0.8", ...}
```

Gebruik het `version`-veld (bv. `1.0.8`) als `{{WDS_VERSION}}`. Eén identieke waarde voor alle URLs in het artifact.

Waarom **dit** endpoint? claude.ai's WebFetch deelt een trusted-host-whitelist met artifact's `connect-src` CSP. `cdn.jsdelivr.net` is whitelisted (artifacts laden er sowieso scripts vandaan). `data.jsdelivr.com` en `registry.npmjs.org` zijn **niet** whitelisted — die geven "Failed to fetch". jsDelivr serveert `package.json` zonder versie-pin door automatisch te resolveren naar latest, dus dit werkt als een lookup-endpoint.

Lukt de lookup alsnog niet? Gebruik `1.0.8` als fallback en meld dat tegen de gebruiker.

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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/colors_and_type_artifact.css" />
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
  <!-- tweaks-toggle + cms-export handlers worden geladen via app-claudeai-glue.js (onderaan, na app-main.js). -->

  <!-- Base64 asset data URIs — load BEFORE TWEAK_DEFAULTS so WITTY_ASSETS is defined. -->
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/assets.js"></script>

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

  <!-- Hosted Witty runtime — alle witty-design-system URLs delen één  per artifact-generatie. -->
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/TekstBouwblok.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/BlockShared.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/Quote.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/ExternalLink.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/MediaCarousel.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/Chat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/Hotspot.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/Stepper.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagShell.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagPrimitives.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagTekst.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagAfbeeldingen.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagPoll.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagStelling.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagVolgorde.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/components/VraagConnect.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/app.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/app-tweaks.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/app-main.js"></script>
  <!-- Glue voor tweaks-toggle + cms-export — MOET na app-main.js, want het opereert op gemounte DOM. -->
  <script src="https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/app-claudeai-glue.js"></script>
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
- **Relatieve paden breken** — alle `src`/`href` in de artifact moeten absolute `https://cdn.jsdelivr.net/npm/witty-design-system@{{WDS_VERSION}}/...` URLs zijn.
- **`{{WDS_VERSION}}` placeholder MOET vervangen** — vóór generatie WebFetch op `https://cdn.jsdelivr.net/npm/witty-design-system/package.json`, pak `version` (bv. `1.0.8`), vervang elke `{{WDS_VERSION}}` in skeleton door die waarde. Eén waarde voor alle URLs. Niet vervangen of fout pinnen = jsDelivr range-tag-cache levert oude `.js` versies en nieuwe features zijn onzichtbaar. Lookup faalt? Fallback naar `1.0.8` en meld het. Gebruik **niet** `data.jsdelivr.com` of `registry.npmjs.org` — die zitten niet in claude.ai's WebFetch-whitelist.
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
