(function () {
function VraagAfbeeldingen({
  achtergrond = "standaard",
  eyebrow = "Vraag 3 of kop titel",
  intro = "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  titel = "Vestibulum placerat ipsum vel malesuada vehicula.",
  instructie = "Instructie",
  multi = false,
  opties = [
    { tekst: "Lorem ipsum", afbeelding: "assets/vraag-img-1.jpg", correct: true },
    { tekst: "Lorem ipsum", afbeelding: "assets/vraag-img-2.jpg", correct: false },
    { tekst: "Lorem ipsum", afbeelding: "assets/vraag-img-1.jpg", correct: false },
    { tekst: "Lorem ipsum", afbeelding: "assets/vraag-img-2.jpg", correct: false }
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
  const hasPick = picked.size > 0;
  return /* @__PURE__ */ React.createElement(VraagShell, { ...{ achtergrond, eyebrow, intro, titel, instructie } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16
  } }, opties.map((opt, i) => {
    const sel = picked.has(i);
    const showCorrect = toonFeedback && opt.correct;
    const stroke = showCorrect ? "#12B76A" : sel ? "#0F1012" : "#D0D5DD";
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        type: "button",
        onClick: () => toggle(i),
        style: {
          background: "#FFFFFF",
          border: `1px solid ${stroke}`,
          borderRadius: "var(--wt-radius)",
          padding: 0,
          overflow: "hidden",
          cursor: "pointer",
          font: "inherit",
          textAlign: "left",
          display: "flex",
          flexDirection: "column"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 10",
        background: opt.afbeelding ? `url(${opt.afbeelding}) center / cover no-repeat` : "repeating-linear-gradient(135deg, #EEF2F5 0 12px, #E4E9EE 12px 24px)",
        display: opt.afbeelding ? "block" : "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#667085"
      } }, !opt.afbeelding && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600 } }, "Afbeelding vervangen"), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 12, left: 12 } }, multi ? /* @__PURE__ */ React.createElement(CheckBox, { selected: sel, correct: showCorrect }) : /* @__PURE__ */ React.createElement(RadioDot, { selected: sel, correct: showCorrect })), showCorrect && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 12, right: 12 } }, /* @__PURE__ */ React.createElement(CorrectBadge, null))),
      /* @__PURE__ */ React.createElement("div", { style: {
        padding: "16px 20px",
        fontFamily: "var(--font-body)",
        fontSize: 16,
        lineHeight: "24px",
        color: "#0F1012"
      } }, opt.tekst)
    );
  })), /* @__PURE__ */ React.createElement(FeedbackButton, { label: "Controleer", enabled: hasPick }));
}
window.VraagAfbeeldingen = VraagAfbeeldingen;
})();
