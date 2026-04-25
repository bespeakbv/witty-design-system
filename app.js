(function () {
const { useState, useEffect, useCallback } = React;
const TWEAK_DEFAULTS = window.TWEAK_DEFAULTS;
const VARIANTS = [
  { v: "media-links", label: "Media links" },
  { v: "media-rechts", label: "Media rechts" },
  { v: "een-kolom", label: "E\xE9n kolom" },
  { v: "gecentreerd", label: "Gecentreerd" },
  { v: "twee-kolommen", label: "Twee kolommen" }
];
const BACKGROUNDS = [
  { v: "standaard", label: "Wit" },
  { v: "licht", label: "Licht" },
  { v: "donker", label: "Donker" },
  { v: "neutral", label: "Neutral" }
];
const MEDIA_TYPES = [
  { v: "afbeelding", label: "Afbeelding" },
  { v: "video", label: "Video" }
];
const MEDIA_DIMS = [
  { v: "boxed", label: "Boxed" },
  { v: "full", label: "Full" }
];
const MULTI_MODES = [
  { v: false, label: "Single" },
  { v: true, label: "Multi" }
];
const VRAAG_TEKST_LAYOUTS = [
  { v: "alleen-tekst", label: "Alleen tekst" },
  { v: "media-links", label: "Media links" },
  { v: "media-rechts", label: "Media rechts" }
];
const KIND_GROUPS = [
  { label: "Tekst bouwstenen", kinds: ["tekst", "quote", "external-link"] },
  { label: "Media & interactie", kinds: ["media-carousel", "hotspot", "stepper", "chat"] },
  { label: "Vragen", kinds: ["vraag-tekst", "vraag-afb", "poll", "stelling", "volgorde", "connect"] }
];
const AVATAR_POSITIES = [
  { v: "links", label: "Links" },
  { v: "rechts", label: "Rechts" }
];
const EXTERNAL_LINK_TYPES = [
  { v: "link", label: "Link" },
  { v: "download", label: "Download" }
];
const HOTSPOT_TEXT_POSITIES = [
  { v: "links", label: "Tekst links" },
  { v: "rechts", label: "Tekst rechts" }
];
const STEPPER_LAYOUTS = [
  { v: "twee-kolommen", label: "Twee kolommen" },
  { v: "een-kolom", label: "E\xE9n kolom" }
];
const CHAT_AUTEUR = [
  { v: "links", label: "Annemarie (links)" },
  { v: "rechts", label: "Michel (rechts)" }
];
const MEDIA_ITEM_SOORT = [
  { v: "afbeelding", label: "Afbeelding" },
  { v: "video", label: "Video" }
];
const CONNECT_MODES = [
  { v: false, label: "Tekst" },
  { v: true, label: "Met afbeelding" }
];
const STELLING_CORRECT = [
  { v: true, label: "Juist" },
  { v: false, label: "Onjuist" }
];
const RADIUS_OPTIONS = [
  { v: "geen", label: "Geen" },
  { v: "klein", label: "Klein" },
  { v: "groot", label: "Groot" }
];
const RADIUS_VALUES = {
  geen: "0px",
  klein: "8px",
  groot: "999px"
};
const MEDIA_SRC = window.MEDIA_SRC || {
  afbeelding: "assets/tekst-image.png",
  video: "assets/tekst-video-thumb.jpg"
};
const KIND_LABEL = {
  "tekst": "Tekst",
  "quote": "Quote",
  "external-link": "Externe link",
  "media-carousel": "Media carousel",
  "chat": "Chat",
  "hotspot": "Hotspot",
  "stepper": "Stepper",
  "vraag-tekst": "Vraag \xB7 tekst",
  "vraag-afb": "Vraag \xB7 afbeelding",
  "poll": "Poll",
  "stelling": "Stelling",
  "volgorde": "Volgorde",
  "connect": "Connect"
};
function Seg({ value, options, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { className: "tw-seg" }, options.map((o) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: String(o.v),
      "aria-pressed": value === o.v,
      onClick: () => onChange(o.v)
    },
    o.label
  )));
}
function Toggle({ checked, onChange, label }) {
  return /* @__PURE__ */ React.createElement("div", { className: "tw-toggle" }, /* @__PURE__ */ React.createElement("span", null, label), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "tw-switch",
      role: "switch",
      "aria-checked": checked,
      onClick: () => onChange(!checked)
    }
  ));
}
function Field({ label, children }) {
  return /* @__PURE__ */ React.createElement("div", { className: "tw-field" }, /* @__PURE__ */ React.createElement("label", null, label), children);
}
Object.assign(window, { Seg, Toggle, Field, VARIANTS, BACKGROUNDS, MEDIA_TYPES, MEDIA_DIMS, MULTI_MODES, VRAAG_TEKST_LAYOUTS, CONNECT_MODES, STELLING_CORRECT, MEDIA_SRC, KIND_LABEL, KIND_GROUPS, RADIUS_OPTIONS, RADIUS_VALUES, AVATAR_POSITIES, EXTERNAL_LINK_TYPES, HOTSPOT_TEXT_POSITIES, STEPPER_LAYOUTS, CHAT_AUTEUR, MEDIA_ITEM_SOORT });
})();
