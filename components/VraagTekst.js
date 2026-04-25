(function () {
function VraagTekst({
  achtergrond = "standaard",
  eyebrow = "Vraag 3 of kop titel",
  intro = "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  titel = "Vestibulum placerat ipsum vel malesuada vehicula.",
  instructie = "Instructie",
  multi = false,
  opties = [
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: true },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false }
  ],
  toonFeedback = false,
  layout = "alleen-tekst",
  mediaType = "afbeelding",
  mediaSrc,
  toonPlayknop = true
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
  return /* @__PURE__ */ React.createElement(
    VraagShell,
    {
      achtergrond,
      eyebrow,
      intro,
      titel,
      instructie,
      layout,
      mediaType,
      mediaSrc,
      toonPlayknop
    },
    opties.map((opt, i) => {
      const sel = picked.has(i);
      const showCorrect = toonFeedback && opt.correct;
      return /* @__PURE__ */ React.createElement(
        OptionCard,
        {
          key: i,
          selected: sel,
          correct: showCorrect,
          onClick: () => toggle(i)
        },
        multi ? /* @__PURE__ */ React.createElement(CheckBox, { selected: sel, correct: showCorrect }) : /* @__PURE__ */ React.createElement(RadioDot, { selected: sel, correct: showCorrect }),
        /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, opt.tekst),
        showCorrect && /* @__PURE__ */ React.createElement(CorrectBadge, null)
      );
    }),
    /* @__PURE__ */ React.createElement(FeedbackButton, { label: "Controleer", enabled: hasPick })
  );
}
window.VraagTekst = VraagTekst;
})();
