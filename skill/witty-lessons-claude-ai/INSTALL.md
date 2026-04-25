# Witty Lessons — installatie in Claude

Met deze skill genereert Claude op claude.ai (of de Desktop-app) een complete Witty-les als **live artifact**: een interactieve HTML-les met 13 soorten bouwblokken, tweaks-paneel, en alle styling van het Witty design system.

## Wat je nodig hebt

- Een claude.ai Pro of Max abonnement (Skills zijn niet beschikbaar op Free).
- Een werkende internetverbinding voor de Witty runtime (`cdn.jsdelivr.net/npm/witty-design-system@1`).

## Installeren — 4 stappen

1. Download deze skill als zip.
2. Ga naar **claude.ai → Settings → Capabilities → Skills**.
3. Klik **"Add skill"** en selecteer de zip.
4. Klaar. De skill heet nu `witty-lessons` en activeert automatisch.

## Gebruiken

Open een nieuw gesprek en typ bijvoorbeeld:

- *"Maak een Witty-les over breuken, doelgroep basisonderwijs, doel kennismaken."*
- *"Genereer een Witty-les over narratieve structuur voor VO, oefenen."*
- *"Korte afsluitende Witty-les over ondernemerschap."*

Claude stelt 1–3 korte vragen, kiest een pedagogisch recept, schrijft de copy, en produceert de les **als artifact** in het rechterpaneel.

## In de les

- **Live interactie**: alle vragen (multiple choice, polls, stellingen, volgorde, connect) werken direct.
- **Tweaks-knop (linksonder)**: klik om per-blok een tweaks-paneel te openen. Hier kun je varianten, achtergronden, titels en bodies aanpassen — handig om snel varianten te verkennen.
- **Downloaden**: het artifact heeft een download-knop om de HTML offline op te slaan.
- **Delen**: de artifact-URL werkt alleen binnen claude.ai. Voor offline/presentatie-gebruik: download en open lokaal in een browser.

## Wat gebeurt er onder de motorkap?

De les laadt alle bouwblokken, CSS, fonts en placeholder-assets van één publieke URL: `https://cdn.jsdelivr.net/npm/witty-design-system@1/` (jsDelivr mirror van github.com/bespeakbv/witty-design-system). De artifact zelf bevat alleen de lesdata (welke blokken in welke volgorde, met welke copy) — dus hij is compact (~15KB) maar volledig functioneel.

Updates aan het design system (nieuwe bouwblok, kleurtweaks, enz.) verschijnen automatisch in alle nieuwe én bestaande lessen — geen her-generatie nodig.

## Problemen?

- **Artifact is leeg of blijft laden** → check of `cdn.jsdelivr.net/npm/witty-design-system@1` bereikbaar is (open in een browser-tab). GitHub Pages is 99.9%+ beschikbaar, maar zelden kan een uitval hier de oorzaak zijn.
- **Fonts zien er anders uit** → Atkinson Hyperlegible Next laadt 1–2 seconden na de eerste pageload. Normaal gedrag.
- **Tweaks-knop werkt niet** → refresh het artifact-panel. Als het blijft mislukken: meld het met de URL + artifact-id.

## Vragen of feedback?

Neem contact op met Bespeak via https://www.bespeak.nl/.
