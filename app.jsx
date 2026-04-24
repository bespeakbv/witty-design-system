// app.jsx — Witty demo page
// Rendert meerdere bouwblokken (Tekst + Vraag-types) onder elkaar, met één
// Tweaks-paneel waar de onderwijskundige per blok variabelen kan aanpassen.
//
// Bouwsteen-types (kind):
//   "tekst"           → TekstBouwblok (bestaand)
//   "vraag-tekst"     → VraagTekst (single/multi toggle)
//   "vraag-afb"       → VraagAfbeeldingen (single/multi toggle)
//   "poll"            → VraagPoll (single/multi toggle)
//   "stelling"        → VraagStelling (Juist/Onjuist)
//   "volgorde"        → VraagVolgorde
//   "connect"         → VraagConnect (met/zonder afbeelding)
//
// Gedeelde vraag-tweaks: achtergrond, eyebrow (Vraag-nummer), opties (add/remove/edit +
// correct-vlag), toonFeedback. Specifieke tweaks per type waar relevant.

const { useState, useEffect, useCallback } = React;

// ── Default block config ─────────────────────────────────────────────
// Elk demo-HTML-bestand zet zijn eigen window.TWEAK_DEFAULTS (met EDITMODE-markers)
// voordat dit script laadt, zodat elk demo-bestand zijn eigen set blokken heeft.
const TWEAK_DEFAULTS = window.TWEAK_DEFAULTS;

// ── Options ────────────────────────────────────────────────────────────
const VARIANTS = [
  { v: "media-links",   label: "Media links" },
  { v: "media-rechts",  label: "Media rechts" },
  { v: "een-kolom",     label: "Eén kolom" },
  { v: "gecentreerd",   label: "Gecentreerd" },
  { v: "twee-kolommen", label: "Twee kolommen" },
];
const BACKGROUNDS = [
  { v: "standaard", label: "Wit" },
  { v: "licht",     label: "Licht" },
  { v: "donker",    label: "Donker" },
  { v: "neutral",   label: "Neutral" },
];
const MEDIA_TYPES = [
  { v: "afbeelding", label: "Afbeelding" },
  { v: "video",      label: "Video" },
];
const MEDIA_DIMS = [
  { v: "boxed", label: "Boxed" },
  { v: "full",  label: "Full" },
];
const MULTI_MODES = [
  { v: false, label: "Single" },
  { v: true,  label: "Multi" },
];
const VRAAG_TEKST_LAYOUTS = [
  { v: "alleen-tekst",  label: "Alleen tekst" },
  { v: "media-links",   label: "Media links" },
  { v: "media-rechts",  label: "Media rechts" },
];
// Groepering voor de "Blok toevoegen" sectie in de Tweaks-panel.
const KIND_GROUPS = [
  { label: "Tekst bouwstenen",        kinds: ["tekst", "quote", "external-link"] },
  { label: "Media & interactie",      kinds: ["media-carousel", "hotspot", "stepper", "chat"] },
  { label: "Vragen",                  kinds: ["vraag-tekst", "vraag-afb", "poll", "stelling", "volgorde", "connect"] },
];
// Opties voor de nieuwe types
const AVATAR_POSITIES = [
  { v: "links",  label: "Links" },
  { v: "rechts", label: "Rechts" },
];
const EXTERNAL_LINK_TYPES = [
  { v: "link",     label: "Link" },
  { v: "download", label: "Download" },
];
const HOTSPOT_TEXT_POSITIES = [
  { v: "links",  label: "Tekst links" },
  { v: "rechts", label: "Tekst rechts" },
];
const STEPPER_LAYOUTS = [
  { v: "twee-kolommen", label: "Twee kolommen" },
  { v: "een-kolom",     label: "Eén kolom" },
];
const CHAT_AUTEUR = [
  { v: "links",  label: "Annemarie (links)" },
  { v: "rechts", label: "Michel (rechts)" },
];
const MEDIA_ITEM_SOORT = [
  { v: "afbeelding", label: "Afbeelding" },
  { v: "video",      label: "Video" },
];
const CONNECT_MODES = [
  { v: false, label: "Tekst" },
  { v: true,  label: "Met afbeelding" },
];
const STELLING_CORRECT = [
  { v: true,  label: "Juist" },
  { v: false, label: "Onjuist" },
];
const RADIUS_OPTIONS = [
  { v: "geen",  label: "Geen" },
  { v: "klein", label: "Klein" },
  { v: "groot", label: "Groot" },
];
const RADIUS_VALUES = {
  geen: "0px",
  klein: "8px",
  groot: "999px",
};

const MEDIA_SRC = window.MEDIA_SRC || {
  afbeelding: "assets/tekst-image.png",
  video:      "assets/tekst-video-thumb.jpg",
};

const KIND_LABEL = {
  "tekst":          "Tekst",
  "quote":          "Quote",
  "external-link":  "Externe link",
  "media-carousel": "Media carousel",
  "chat":           "Chat",
  "hotspot":        "Hotspot",
  "stepper":        "Stepper",
  "vraag-tekst":    "Vraag · tekst",
  "vraag-afb":      "Vraag · afbeelding",
  "poll":           "Poll",
  "stelling":       "Stelling",
  "volgorde":       "Volgorde",
  "connect":        "Connect",
};

// ── Tweaks UI primitives ──────────────────────────────────────────────
function Seg({ value, options, onChange }) {
  return (
    <div className="tw-seg">
      {options.map((o) => (
        <button
          key={String(o.v)}
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
function Toggle({ checked, onChange, label }) {
  return (
    <div className="tw-toggle">
      <span>{label}</span>
      <div
        className="tw-switch"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div className="tw-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

Object.assign(window, { Seg, Toggle, Field, VARIANTS, BACKGROUNDS, MEDIA_TYPES, MEDIA_DIMS, MULTI_MODES, VRAAG_TEKST_LAYOUTS, CONNECT_MODES, STELLING_CORRECT, MEDIA_SRC, KIND_LABEL, KIND_GROUPS, RADIUS_OPTIONS, RADIUS_VALUES, AVATAR_POSITIES, EXTERNAL_LINK_TYPES, HOTSPOT_TEXT_POSITIES, STEPPER_LAYOUTS, CHAT_AUTEUR, MEDIA_ITEM_SOORT });
