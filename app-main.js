(function () {
function renderBlock(b) {
  switch (b.kind) {
    case "tekst":
      return /* @__PURE__ */ React.createElement(
        TekstBouwblok,
        {
          variant: b.variant,
          achtergrond: b.achtergrond,
          onderSpacing: b.onderSpacing,
          mediaType: b.mediaType,
          mediaSrc: MEDIA_SRC[b.mediaType],
          mediaDimensions: b.mediaDimensions,
          toonPlayknop: b.toonPlayknop !== false,
          titel: b.titel,
          subtitel: b.subtitel,
          body: b.body,
          body2: b.body2,
          toonTitel: b.toonTitel,
          toonSubtitel: b.toonSubtitel
        }
      );
    case "quote":
      return /* @__PURE__ */ React.createElement(
        Quote,
        {
          achtergrond: b.achtergrond,
          onderSpacing: b.onderSpacing,
          tekst: b.tekst,
          auteur: b.auteur,
          avatarSrc: b.avatarSrc,
          toonAvatar: b.toonAvatar !== false,
          avatarPositie: b.avatarPositie || "rechts",
          metQuotes: !!b.metQuotes
        }
      );
    case "external-link":
      return /* @__PURE__ */ React.createElement(
        ExternalLink,
        {
          achtergrond: b.achtergrond,
          onderSpacing: b.onderSpacing,
          type: b.type || "link",
          titel: b.titel,
          body: b.body,
          linkTekst: b.linkTekst,
          href: b.href || "#",
          toonAfbeelding: b.toonAfbeelding !== false,
          afbeelding: b.afbeelding
        }
      );
    case "media-carousel":
      return /* @__PURE__ */ React.createElement(
        MediaCarousel,
        {
          achtergrond: b.achtergrond,
          onderSpacing: b.onderSpacing,
          items: b.items,
          mediaDimensions: b.mediaDimensions || "boxed",
          toonPlayknop: b.toonPlayknop !== false
        }
      );
    case "chat":
      return /* @__PURE__ */ React.createElement(
        Chat,
        {
          achtergrond: b.achtergrond,
          onderSpacing: b.onderSpacing,
          titel: b.titel,
          berichten: b.berichten,
          avatars: b.avatars
        }
      );
    case "hotspot":
      return /* @__PURE__ */ React.createElement(
        Hotspot,
        {
          achtergrond: b.achtergrond,
          onderSpacing: b.onderSpacing,
          titel: b.titel,
          body: b.body,
          afbeelding: b.afbeelding,
          hotspots: b.hotspots,
          textPositie: b.textPositie || "links"
        }
      );
    case "stepper":
      return /* @__PURE__ */ React.createElement(
        Stepper,
        {
          achtergrond: b.achtergrond,
          onderSpacing: b.onderSpacing,
          layout: b.layout || "twee-kolommen",
          stappen: b.stappen
        }
      );
    case "vraag-tekst":
      return /* @__PURE__ */ React.createElement(
        VraagTekst,
        {
          achtergrond: b.achtergrond,
          eyebrow: b.eyebrow,
          intro: b.intro,
          titel: b.titel,
          instructie: b.instructie,
          multi: !!b.multi,
          opties: b.opties,
          toonFeedback: !!b.toonFeedback,
          layout: b.layout || "alleen-tekst",
          mediaType: b.mediaType || "afbeelding",
          mediaSrc: b.mediaType ? MEDIA_SRC[b.mediaType] : void 0,
          toonPlayknop: b.toonPlayknop !== false
        }
      );
    case "vraag-afb":
      return /* @__PURE__ */ React.createElement(
        VraagAfbeeldingen,
        {
          achtergrond: b.achtergrond,
          eyebrow: b.eyebrow,
          intro: b.intro,
          titel: b.titel,
          instructie: b.instructie,
          multi: !!b.multi,
          opties: b.opties,
          toonFeedback: !!b.toonFeedback
        }
      );
    case "poll":
    case "vraag-poll":
      return /* @__PURE__ */ React.createElement(
        VraagPoll,
        {
          achtergrond: b.achtergrond,
          eyebrow: b.eyebrow,
          intro: b.intro,
          titel: b.titel,
          instructie: b.instructie,
          multi: !!b.multi,
          opties: b.opties,
          toonFeedback: !!b.toonFeedback
        }
      );
    case "stelling":
    case "vraag-stelling":
      return /* @__PURE__ */ React.createElement(
        VraagStelling,
        {
          achtergrond: b.achtergrond,
          eyebrow: b.eyebrow,
          intro: b.intro,
          titel: b.titel,
          instructie: b.instructie,
          juistIsJuist: !!b.juistIsJuist,
          toonFeedback: !!b.toonFeedback
        }
      );
    case "volgorde":
    case "vraag-volgorde":
      return /* @__PURE__ */ React.createElement(
        VraagVolgorde,
        {
          achtergrond: b.achtergrond,
          eyebrow: b.eyebrow,
          intro: b.intro,
          titel: b.titel,
          instructie: b.instructie,
          opties: b.opties,
          toonFeedback: !!b.toonFeedback
        }
      );
    case "connect":
    case "vraag-connect":
      return /* @__PURE__ */ React.createElement(
        VraagConnect,
        {
          achtergrond: b.achtergrond,
          eyebrow: b.eyebrow,
          intro: b.intro,
          titel: b.titel,
          instructie: b.instructie,
          metAfbeelding: !!b.metAfbeelding,
          paren: b.paren,
          toonFeedback: !!b.toonFeedback
        }
      );
    default:
      return /* @__PURE__ */ React.createElement("div", { style: { padding: 48, color: "#999" } }, "Onbekend bouwblok: ", b.kind);
  }
}
function TweaksPanel({ blocks, activeId, onSelect, onPatch, onAddBlock, onRemoveBlock, settings, onPatchSettings }) {
  const active = blocks.find((b) => b.id === activeId) || blocks[0];
  const KindTweaks = KIND_TWEAKS[active.kind] || (() => /* @__PURE__ */ React.createElement("div", { style: { color: "var(--neutral-500)", fontSize: 12 } }, "Geen tweaks voor dit blok."));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tweaks-header" }, /* @__PURE__ */ React.createElement("h4", null, "Tweaks"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--neutral-500)", fontSize: 11 } }, blocks.length, " blokken")), /* @__PURE__ */ React.createElement("div", { className: "tweaks-sub" }, "Algemene instellingen"), /* @__PURE__ */ React.createElement("div", { className: "tweaks-body", style: { borderBottom: "1px solid var(--neutral-100)" } }, /* @__PURE__ */ React.createElement(Field, { label: "Radius van knoppen & opties" }, /* @__PURE__ */ React.createElement(
    Seg,
    {
      value: settings.radius,
      options: RADIUS_OPTIONS,
      onChange: (v) => onPatchSettings({ radius: v })
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "tweaks-sub" }, "Kies een bouwblok"), /* @__PURE__ */ React.createElement("div", { className: "tweaks-blocklist" }, blocks.map((b) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: b.id,
      className: b.id === active.id ? "active" : "",
      onClick: () => onSelect(b.id)
    },
    /* @__PURE__ */ React.createElement("span", { className: "dot" }),
    /* @__PURE__ */ React.createElement("span", { style: { flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, b.naam),
    /* @__PURE__ */ React.createElement("span", { style: { color: "var(--neutral-500)", fontSize: 11 } }, KIND_LABEL[b.kind] || b.kind)
  ))), /* @__PURE__ */ React.createElement("div", { className: "tweaks-sub", style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, "Blok toevoegen")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", borderBottom: "1px solid var(--neutral-100)" } }, KIND_GROUPS.map((group) => {
    const entries = group.kinds.filter((k) => KIND_LABEL[k]).filter((k) => !window.ALLOWED_KINDS || window.ALLOWED_KINDS.includes(k)).map((k) => [k, KIND_LABEL[k]]);
    if (entries.length === 0) return null;
    return /* @__PURE__ */ React.createElement("div", { key: group.label, style: { padding: "6px 10px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.3,
      color: "var(--neutral-500)",
      textTransform: "uppercase",
      marginBottom: 6
    } }, group.label), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 } }, entries.map(([k, label]) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => onAddBlock(k),
        style: {
          all: "unset",
          padding: "6px 8px",
          borderRadius: 4,
          border: "1px solid var(--neutral-200)",
          cursor: "pointer",
          fontSize: 11,
          color: "var(--ink)",
          textAlign: "center",
          background: "#fff"
        }
      },
      "+ ",
      label
    ))));
  })), /* @__PURE__ */ React.createElement("div", { className: "tweaks-sub" }, "Variabelen \u2014 ", active.naam), /* @__PURE__ */ React.createElement("div", { className: "tweaks-body" }, /* @__PURE__ */ React.createElement(Field, { label: "Naam van het blok" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "tw-text",
      value: active.naam,
      onChange: (e) => onPatch(active.id, { naam: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement(KindTweaks, { b: active, patch: (p) => onPatch(active.id, p) }), blocks.length > 1 && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onRemoveBlock(active.id),
      style: {
        all: "unset",
        cursor: "pointer",
        textAlign: "center",
        padding: "6px 8px",
        border: "1px solid #FDA29B",
        borderRadius: 6,
        color: "#B42318",
        fontSize: 12,
        fontWeight: 700,
        marginTop: 4
      }
    },
    "Blok verwijderen"
  )));
}
function templateFor(kind) {
  const id = "b" + Math.random().toString(36).slice(2, 7);
  const base = { id, kind, naam: KIND_LABEL[kind] || kind };
  switch (kind) {
    case "tekst":
      return {
        ...base,
        variant: "een-kolom",
        achtergrond: "standaard",
        onderSpacing: true,
        mediaType: "afbeelding",
        mediaDimensions: "boxed",
        toonPlayknop: true,
        titel: "Titel",
        subtitel: "Subtitel",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        body2: "",
        toonTitel: true,
        toonSubtitel: true
      };
    case "quote":
      return {
        ...base,
        achtergrond: "licht",
        onderSpacing: true,
        tekst: "Mensen die ouder worden, kunnen er ook mooi en stralend uitzien. Ik houd daarom niet zo van de term anti-aging, maar eerder van healthy aging!",
        auteur: "Annemarie Docter",
        avatarSrc: "assets/avatar-annemarie.jpg",
        toonAvatar: true,
        avatarPositie: "rechts",
        metQuotes: true
      };
    case "external-link":
      return {
        ...base,
        achtergrond: "standaard",
        onderSpacing: true,
        type: "link",
        titel: "Verder lezen",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur laoreet vel nisl quis laoreet. Vivamus leo tellus, rhoncus vitae.",
        linkTekst: "",
        href: "#",
        toonAfbeelding: true,
        afbeelding: "assets/external-link-thumb.jpg"
      };
    case "media-carousel":
      return {
        ...base,
        achtergrond: "standaard",
        onderSpacing: true,
        mediaDimensions: "boxed",
        toonPlayknop: true,
        items: [
          { src: "assets/media-carousel.jpg", soort: "video", alt: "Video" },
          { src: "assets/media-carousel.jpg", soort: "afbeelding", alt: "Afbeelding 1" },
          { src: "assets/media-carousel.jpg", soort: "afbeelding", alt: "Afbeelding 2" }
        ]
      };
    case "chat":
      return {
        ...base,
        achtergrond: "standaard",
        onderSpacing: true,
        titel: "",
        avatars: {
          links: "assets/avatar-annemarie.jpg",
          rechts: "assets/avatar-michel.jpg"
        },
        berichten: [
          { auteur: "rechts", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
          { auteur: "rechts", titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
          { auteur: "links", titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
          { auteur: "links", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." }
        ]
      };
    case "hotspot":
      return {
        ...base,
        achtergrond: "standaard",
        onderSpacing: true,
        titel: "Ontdek de plant",
        body: "Klik op de punten om meer te leren over de onderdelen van een blad.",
        afbeelding: "assets/hotspot-image.jpg",
        textPositie: "links",
        hotspots: [
          { x: 38, y: 28, titel: "Bladsteel", body: "De steel waaraan het blad vastzit aan de plant." },
          { x: 58, y: 62, titel: "Bladschijf", body: "Het groene, platte deel van het blad dat zonlicht opvangt voor fotosynthese." },
          { x: 78, y: 40, titel: "Bladnerf", body: "De transportbanen voor water en voedingsstoffen door het blad." }
        ]
      };
    case "stepper":
      return {
        ...base,
        achtergrond: "donker",
        onderSpacing: true,
        layout: "twee-kolommen",
        stappen: [
          { titel: "Stap \xE9\xE9n", subtitel: "Ori\xEBntatie", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam." },
          { titel: "Stap twee", subtitel: "Voorbereiden", body: "Quisque ut efficitur nibh, sed porttitor lacus. Nullam malesuada quam eget est ultrices consequat." },
          { titel: "Stap drie", subtitel: "Uitvoeren", body: "In finibu, a magna lobortis, porta ligula ut, ullamcorper nulla." },
          { titel: "Stap vier", subtitel: "Afronden", body: "Suspendisse potenti. Aenean varius, nisl ac posuere rhoncus." }
        ]
      };
    case "vraag-tekst":
      return {
        ...base,
        achtergrond: "standaard",
        eyebrow: "Vraag \u2014 kop titel",
        intro: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
        titel: "Vestibulum placerat ipsum vel malesuada vehicula.",
        instructie: "Instructie",
        multi: false,
        toonFeedback: false,
        layout: "alleen-tekst",
        mediaType: "afbeelding",
        toonPlayknop: true,
        opties: [
          { tekst: "Lorem ipsum dolor sit amet.", correct: true },
          { tekst: "Lorem ipsum dolor sit amet.", correct: false },
          { tekst: "Lorem ipsum dolor sit amet.", correct: false },
          { tekst: "Lorem ipsum dolor sit amet.", correct: false }
        ]
      };
    case "vraag-afb":
      return {
        ...base,
        achtergrond: "standaard",
        eyebrow: "Vraag \u2014 kop titel",
        intro: "Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
        titel: "Vestibulum placerat ipsum vel malesuada vehicula.",
        instructie: "Instructie",
        multi: false,
        toonFeedback: false,
        opties: [
          { tekst: "Optie 1", afbeelding: "assets/vraag-img-1.jpg", correct: true },
          { tekst: "Optie 2", afbeelding: "assets/vraag-img-2.jpg", correct: false },
          { tekst: "Optie 3", afbeelding: "assets/vraag-img-1.jpg", correct: false },
          { tekst: "Optie 4", afbeelding: "assets/vraag-img-2.jpg", correct: false }
        ]
      };
    case "poll":
    case "vraag-poll":
      return {
        ...base,
        achtergrond: "neutral",
        eyebrow: "Poll",
        intro: "Er is geen goed of fout antwoord.",
        titel: "Wat denk jij?",
        instructie: "E\xE9n antwoord.",
        multi: false,
        toonFeedback: false,
        opties: [
          { tekst: "Optie 1", stemmen: 40 },
          { tekst: "Optie 2", stemmen: 30 },
          { tekst: "Optie 3", stemmen: 20 },
          { tekst: "Optie 4", stemmen: 10 }
        ]
      };
    case "stelling":
    case "vraag-stelling":
      return {
        ...base,
        achtergrond: "standaard",
        eyebrow: "Stelling",
        intro: "Beoordeel de volgende uitspraak.",
        titel: "Vul je stelling in.",
        instructie: "Is dit juist of onjuist?",
        juistIsJuist: true,
        toonFeedback: false
      };
    case "volgorde":
    case "vraag-volgorde":
      return {
        ...base,
        achtergrond: "standaard",
        eyebrow: "Volgorde",
        intro: "Breng in de juiste volgorde.",
        titel: "Sleep de onderdelen op hun plek.",
        instructie: "Van begin naar einde.",
        toonFeedback: false,
        opties: [
          { tekst: "Stap \xE9\xE9n." },
          { tekst: "Stap twee." },
          { tekst: "Stap drie." },
          { tekst: "Stap vier." }
        ]
      };
    case "connect":
    case "vraag-connect":
      return {
        ...base,
        achtergrond: "standaard",
        eyebrow: "Connect",
        intro: "Koppel links aan rechts.",
        titel: "Welke beschrijving hoort bij welk begrip?",
        instructie: "Klik links, dan rechts.",
        metAfbeelding: false,
        toonFeedback: false,
        paren: [
          { links: "Begrip 1", rechts: "Beschrijving 1", afbeelding: "assets/vraag-img-1.jpg" },
          { links: "Begrip 2", rechts: "Beschrijving 2", afbeelding: "assets/vraag-img-2.jpg" },
          { links: "Begrip 3", rechts: "Beschrijving 3", afbeelding: "assets/vraag-img-1.jpg" },
          { links: "Begrip 4", rechts: "Beschrijving 4", afbeelding: "assets/vraag-img-2.jpg" }
        ]
      };
    default:
      return base;
  }
}
function App() {
  const [state, setState] = React.useState(TWEAK_DEFAULTS);
  const [activeId, setActiveId] = React.useState(TWEAK_DEFAULTS.blocks[0].id);
  const [tweaksOn, setTweaksOn] = React.useState(false);
  React.useEffect(() => {
    function onMessage(e) {
      const t = e.data && e.data.type;
      if (t === "__activate_edit_mode") setTweaksOn(true);
      else if (t === "__deactivate_edit_mode") setTweaksOn(false);
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);
  React.useEffect(() => {
    document.body.classList.toggle("tweaks-on", tweaksOn);
  }, [tweaksOn]);
  const persist = React.useCallback((blocks, settings) => {
    const edits = {};
    if (blocks) edits.blocks = blocks;
    if (settings) edits.settings = settings;
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
  }, []);
  const patchBlock = React.useCallback((id, patch) => {
    setState((s) => {
      const blocks = s.blocks.map((b) => b.id === id ? { ...b, ...patch } : b);
      persist(blocks);
      return { ...s, blocks };
    });
  }, [persist]);
  const patchSettings = React.useCallback((patch) => {
    setState((s) => {
      const settings = { ...s.settings, ...patch };
      persist(null, settings);
      return { ...s, settings };
    });
  }, [persist]);
  React.useEffect(() => {
    const r = state.settings && state.settings.radius;
    if (r && RADIUS_VALUES[r]) {
      document.documentElement.style.setProperty("--wt-radius", RADIUS_VALUES[r]);
    }
  }, [state.settings]);
  const addBlock = React.useCallback((kind) => {
    setState((s) => {
      const newBlock = templateFor(kind);
      const blocks = [...s.blocks, newBlock];
      persist(blocks);
      setActiveId(newBlock.id);
      return { ...s, blocks };
    });
  }, [persist]);
  const removeBlock = React.useCallback((id) => {
    setState((s) => {
      const blocks = s.blocks.filter((b) => b.id !== id);
      persist(blocks);
      if (blocks.length > 0 && id === activeIdRef.current) {
        setActiveId(blocks[0].id);
      }
      return { ...s, blocks };
    });
  }, [persist]);
  const activeIdRef = React.useRef(activeId);
  React.useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, state.blocks.map((b) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: b.id,
      className: "block-frame",
      "data-screen-label": b.naam,
      "data-selected": tweaksOn && b.id === activeId,
      onClick: () => tweaksOn && setActiveId(b.id)
    },
    /* @__PURE__ */ React.createElement("div", { className: "block-label" }, b.naam, " \xB7 ", KIND_LABEL[b.kind] || b.kind),
    renderBlock(b)
  )), tweaksOn && ReactDOM.createPortal(
    /* @__PURE__ */ React.createElement(
      TweaksPanel,
      {
        blocks: state.blocks,
        activeId,
        onSelect: setActiveId,
        onPatch: patchBlock,
        onAddBlock: addBlock,
        onRemoveBlock: removeBlock,
        settings: state.settings || { radius: "klein" },
        onPatchSettings: patchSettings
      }
    ),
    document.getElementById("tweaks-panel")
  ));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
