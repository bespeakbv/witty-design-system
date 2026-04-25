(function () {
function VraagPoll({
  achtergrond = "neutral",
  eyebrow = "Vraag 3 of kop titel",
  intro = "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  titel = "Vestibulum placerat ipsum vel malesuada vehicula.",
  instructie = "Instructie",
  multi = false,
  opties = [
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", stemmen: 42 },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", stemmen: 28 },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", stemmen: 18 },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", stemmen: 12 }
  ],
  toonFeedback = false
}) {
  const [picked, setPicked] = React.useState(() => /* @__PURE__ */ new Set());
  const toggle = (i) => {
    const next = new Set(picked);
    if (multi) {
      if (next.has(i)) next.delete(i);
      else next.add(i);
    } else {
      next.clear();
      next.add(i);
    }
    setPicked(next);
  };
  const totaal = opties.reduce((s, o) => s + (o.stemmen ?? 0), 0) || 1;
  const hasPick = picked.size > 0;
  return /* @__PURE__ */ React.createElement(VraagShell, { ...{ achtergrond, eyebrow, intro, titel, instructie } }, opties.map((opt, i) => {
    const sel = picked.has(i);
    const pct = Math.round((opt.stemmen ?? 0) / totaal * 100);
    if (toonFeedback) {
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: i,
          style: {
            position: "relative",
            background: "#FFFFFF",
            border: `1px solid ${sel ? "#0F1012" : "#D0D5DD"}`,
            borderRadius: "var(--wt-radius)",
            padding: "16px 24px",
            minHeight: 56,
            display: "flex",
            alignItems: "center",
            gap: 16,
            overflow: "hidden"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: {
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          background: "#E6F4F1",
          zIndex: 0
        } }),
        /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 16, flex: 1 } }, multi ? /* @__PURE__ */ React.createElement(CheckBox, { selected: sel }) : /* @__PURE__ */ React.createElement(RadioDot, { selected: sel }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "24px", color: "#0F1012" } }, opt.tekst), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, lineHeight: "24px", color: "#0F1012", minWidth: 44, textAlign: "right" } }, pct, "%"))
      );
    }
    return /* @__PURE__ */ React.createElement(OptionCard, { key: i, selected: sel, onClick: () => toggle(i) }, multi ? /* @__PURE__ */ React.createElement(CheckBox, { selected: sel }) : /* @__PURE__ */ React.createElement(RadioDot, { selected: sel }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, opt.tekst));
  }), toonFeedback ? /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--font-body)",
    fontSize: 14,
    lineHeight: "20px",
    color: "#3D4148",
    marginTop: 4
  } }, totaal, " stemmen") : /* @__PURE__ */ React.createElement(FeedbackButton, { label: "Stemmen", enabled: picked.size > 0 }));
}
window.VraagPoll = VraagPoll;
})();
