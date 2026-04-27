---
name: witty-lessons-cms
description: Maak of muteer een Witty-les rechtstreeks in de Bespeak LCMS via één GraphQL save-mutation. Triggers wanneer de gebruiker zegt "in cms", "in lcms", "voeg blok toe in cms", of "sla witty-les op in cms". Werkt voor acc en live; vereist alleen dat de juiste building-blocks-pagina open staat in Chrome (CDP). Voor alleen renderen als HTML-artifact zie skill `witty-lessons-claude-ai`.
---

# Witty-lessons CMS — direct opslaan via GraphQL

## Wanneer activeren

Triggers:
- "maak een witty-les in cms / lcms"
- "voeg een blok toe in cms"
- "sla deze les op in lcms"
- Vergelijkbare frasen waaruit blijkt dat de gebruiker mutatie in de echte LCMS-omgeving wil, niet een artifact.

**Niet** activeren voor: claude.ai HTML-artifacts (zie `witty-lessons-claude-ai`).

## Werkwijze (zero-staging voor de gebruiker)

De gebruiker hoeft alleen één ding gedaan te hebben: de **building-blocks-pagina** van de doel-les open hebben in Chrome (acc óf live). Ik doe alles in één Bash-call.

### Vereisten check
1. `dev-browser --connect <<<'console.log((await browser.listPages()).filter(p => p.url?.includes("lcms.witty")).map(p => p.url))'` — bevestig dat één LCMS-tab open is.
2. Als acc + live tegelijk open: vraag gebruiker welke, of vraag om `lcmsHostHint` (substring van hostname).

### Volledige les vanaf nul opslaan

Inline-flow met `save-les.js` (builders.js wordt eerst ge-cat zodat de runner de builders kan gebruiken):

```bash
SKILL=~/.claude/skills/witty-lessons-cms
DUMMY_B64=$(base64 < $SKILL/dummy.webp | tr -d '\n')
LES_JSON='{"didacticToolId":"<uuid-uit-URL>","blocks":[ ... blocks-array ... ]}'

dev-browser --connect <<EOF
const __INLINE_DUMMY_B64 = "${DUMMY_B64}";
const __INLINE_LES = ${LES_JSON};
$(cat $SKILL/cms-api/builders.js)
$(cat $SKILL/cms-api/save-les.js)
EOF
```

Het script doet zelf:
- `versionId` uit Apollo cache (kan worden overschreven met `les.versionId`)
- Image-required blokken: upload `dummy.webp` als geen `assetId` is opgegeven
- Build alle blokken via per-kind builders in `builders.js`
- Save via `__APOLLO_CLIENT__.mutate()` (bypasst extension fetch-wrappers)

### Eén blok toevoegen aan bestaande les

```bash
SKILL=~/.claude/skills/witty-lessons-cms
DUMMY_B64=$(base64 < $SKILL/dummy.webp | tr -d '\n')
BLOCK_JSON='{"kind":"tekst","variant":"media-links","achtergrond":"standaard","body":"..."}'

dev-browser --connect <<EOF
const __INLINE_DUMMY_B64 = "${DUMMY_B64}";
const __INLINE_BLOCK = ${BLOCK_JSON};
const __INLINE_POSITION = "first";  // of "last", of een nummer
$(cat $SKILL/cms-api/builders.js)
$(cat $SKILL/cms-api/add-block.js)
EOF
```

`add-block.js` leest bestaande blocks uit Apollo cache, voegt het nieuwe blok in op de gevraagde positie, hernummert `order`, en saved.

### Smoke-test draaien (idempotent re-save)

Bewijst dat auth/enums/endpoint kloppen voor de actieve omgeving zonder iets te veranderen:

```bash
dev-browser --connect <<'EOF'
$(cat ~/.claude/skills/witty-lessons-cms/cms-api/smoke-test.js)
EOF
```

Output: `✓ smoke test passed in 234ms — env=…, blocks=N` of `✗` met diagnose.

## les.json shape

```ts
{
  didacticToolId: string,        // uit URL: /content/didactic-tools/<id>/building-blocks
  versionId?: string,            // optional — anders uit Apollo cache
  audience?: string | null,
  lcmsHostHint?: string,         // substring van hostname, alleen nodig bij meerdere tabs
  apiUrl?: string,               // override; anders auto-derived uit lcms.* → api.*
  defaultAssetId?: string,       // skip dummy-upload als image-fallback
  blocks: Array<{ kind: string, ... }>
}
```

Block-shape per kind: zie [`witty-lessons-claude-ai`](../witty-lessons-claude-ai/SKILL.md) — dezelfde content-shape die de artifact-skill gebruikt.

## Block-kind → DTO-mapping (alle 16 menu-types)

| CMS-menu | skill `kind` | `__typename` | `type` |
|---|---|---|---|
| Tekst | `tekst` | `ContentBuildingBlockDto` | `CONTENT` |
| Stelling | `stelling` | `StandBuildingBlockDto` | `STAND` |
| Vraag tekst | `vraag-tekst` | `MpcBuildingBlockDto` | `MPC` |
| Vraag afbeeldingen | `vraag-afb` | `MpcBuildingBlockDto` | `MPC` |
| Poll | `poll` | `PollBuildingBlockDto` | `POLL` |
| Hotspot | `hotspot` | `HotspotBuildingBlockDto` | `HOTSPOT` |
| Vraag verbinden | `connect` | `QuestionConnectBuildingBlockDto` | `QUESTION_CONNECT` |
| Vraag volgorde | `volgorde` | `SortQuestionBuildingBlockDto` | `SORT_QUESTION` |
| Quote | `quote` | `QuoteBuildingBlockDto` | `QUOTE` |
| Stepper | `stepper` | `CarouselBuildingBlockDto` | `CAROUSEL` |
| Chat | `chat` | `ConversationBuildingBlockDto` | `CONVERSATION` |
| Accordion | `accordion` | `AccordionBuildingBlockDto` | `ACCORDION` |
| Kaarten | `kaarten` | `ReferenceCardsCarouselBuildingBlockDto` | `REFERENCE_CARDS_CAROUSEL` |
| Lijst | `lijst` | `ListBuildingBlockDto` | `LIST` |
| Link | `link` | `LinkBuildingBlockDto` | `LINK` |
| Media | `media` | `MediaBuildingBlockDto` | `MEDIA` (single asset, niet de artifact-skill `media-carousel`) |

Volledige veld-schemas per DTO: zie [`cms-api/sample-save-payload.json`](cms-api/sample-save-payload.json).

## Belangrijke gotchas

1. **Nieuwe blokken: `id` weglaten.** Het API-endpoint behandelt elk meegegeven `id` als "bestaand block om te updaten" en gooit `NotFoundException` op een client-side gegenereerde UUID. Builders gebruiken `id: b.id` (niet `id: b.id || uuid()`); JSON.stringify dropt undefined velden zodat nieuwe blokken zonder `id` arriveren en de backend zelf een UUID toewijst.

2. **GraphQL via `__APOLLO_CLIENT__.mutate()`, niet via `fetch()`.** Chrome-extensies (`react-grab`, `react-scan` uit CLAUDE.md) wrappen de globale `window.fetch` op pagina-niveau en blokkeren ad-hoc cross-origin requests met `TypeError: Failed to fetch`. Apollo's HttpLink heeft fetch al bij init gecaptured (vóór de extensies in dit Chrome-profiel). `save-les.js` bouwt een DocumentNode handmatig en roept `client.mutate({ ..., fetchPolicy: 'no-cache' })`.

3. **REST-upload (multipart/form-data → `/rest/assets`) gaat wel via `fetch`.** Niet via Apollo-link te routeren want die spreekt geen REST. Werkt momenteel; als upload faalt door een agressievere extension-wrapper: pre-upload de afbeelding via UI en geef `assetId` mee in les.json als `defaultAssetId`.

4. **Dummy-image is single-fallback.** Alle blokken zonder eigen `assetId` krijgen dezelfde grijze gradient (placeholder). Bewust gekozen — losse placeholders per type is geen toegevoegde waarde voor een save-runner.

5. **Multipart-binary read in QuickJS sandbox.** Standalone `dev-browser run save-les.js` (zonder inline) faalde voor binary files: `readFile` decodeert UTF-8 en kapt WebP af bij eerste high-byte. Daarom ondersteunen we alleen het inline-pad (`__INLINE_DUMMY_B64`).

## Files

| | |
|---|---|
| `dummy.webp` | 838 bytes WebP, 512×512 gradient. Inline base64-geëmbed in elke run. |
| `cms-api/builders.js` | Shared builders + enum maps + validation. Single source of truth voor alle 16 blok-types. Cat'd vóór save-les.js / add-block.js / bookmarklet-bridge.js. |
| `cms-api/save-les.js` | Volledige les opslaan (overschrijft alle blocks). |
| `cms-api/add-block.js` | Eén blok toevoegen aan bestaande les (read cache → insert → save). |
| `cms-api/smoke-test.js` | Idempotent re-save van huidige les: bewijst dat enums/auth/endpoint kloppen. Geen builders nodig. |
| `cms-api/bookmarklet-bridge.js` | Bookmarklet-bridge — leest clipboard JSON, bouwt DTOs via builders.js, saved via Apollo. |
| `cms-api/build-bookmarklet.sh` | Concatenate builders + bridge → URL-encoded `javascript:` URL → `bookmarklet-url.txt`. |
| `cms-api/bookmarklet-url.txt` | Generated artifact: paste deze URL als bookmark om de claude.ai → CMS workflow aan te zetten. |
| `cms-api/sample-save-payload.json` | Schema-referentie van een echte 13-blok save (alle DTO-velden, enums). |

## Bookmarklet (claude.ai-artifact → LCMS workflow)

Voor wie een les ontwerpt in de [`witty-lessons-claude-ai`](../witty-lessons-claude-ai/SKILL.md) artifact en daarna naar het CMS wil overhevelen zonder Claude Code te starten.

### Eenmalig installeren

```bash
~/.claude/skills/witty-lessons-cms/cms-api/build-bookmarklet.sh
# → schrijft bookmarklet-url.txt (~30 KB, binnen Chrome's 64 KB cap)
```

1. Open `bookmarklet-url.txt`, kopieer de hele regel
2. Maak een nieuwe bookmark in de browser-bookmarksbar, naam: **"Witty CMS Import"**
3. Plak de `javascript:...` regel als URL
4. Klaar — voor altijd

### Werking

```
claude.ai artifact ──[copy clipboard]──→ LCMS-tab ──[click bookmarklet]──→ Apollo.mutate()
   (export-knop)         (blocks-JSON)        (open op les)        (auto-save)
```

De bookmarklet:
- Checkt `location.hostname.startsWith('lcms.witty.')` als safety
- Leest clipboard met `navigator.clipboard.readText()` (user-gesture via klik)
- Pulls didacticToolId + versionId uit Apollo cache
- Toont confirm-dialog `"X nieuwe blokken vervangen Y bestaande"`
- Roept `__APOLLO_CLIENT__.mutate()` aan (bypasst extension fetch-wrappers, zelfde route als `save-les.js`)
- Toast-feedback: ✓ groen of ✗ rood met error-detail

### CSP-bypass

Bookmarklets via `javascript:` URLs draaien in user-gesture context — Chrome past page-CSP **niet** toe op deze code. Daarom werkt inline-eval, kan de bookmarklet bij `__APOLLO_CLIENT__`, en passes alle network calls via Apollo's pre-extension fetch reference.

### Onderhoud

Bij elke wijziging in `builders.js` (nieuwe block-types, fix in DTO-shape):
```bash
~/.claude/skills/witty-lessons-cms/cms-api/build-bookmarklet.sh
```
Daarna: bookmark in browser updaten met de nieuwe URL.

## Endpoints (auto-detected)

GraphQL: `https://api.<host>/graphql` afgeleid uit `https://lcms.<host>/...` (swap `lcms.` → `api.`)
REST upload: `https://api.<host>/rest/assets` (POST multipart/form-data, field `file`)

Werkt voor acc (`*.acc.test-k8s.tribeagency.nl`), live (`*.bespeak.nl`), en elke andere deploy die het `lcms.` ↔ `api.` patroon volgt.
