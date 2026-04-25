(function () {
function VraagStelling({
  achtergrond = "standaard",
  eyebrow = "Vraag 3 of kop titel",
  intro = "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  titel = "Vestibulum placerat ipsum vel malesuada vehicula.",
  instructie = "Instructie",
  juistIsJuist = true,
  // welk antwoord is correct
  labels = { juist: "Juist", onjuist: "Onjuist" },
  toonFeedback = false
}) {
  const [picked, setPicked] = React.useState(null);
  const opties = [
    { tekst: labels.juist, correct: juistIsJuist === true },
    { tekst: labels.onjuist, correct: juistIsJuist === false }
  ];
  return /* @__PURE__ */ React.createElement(VraagShell, { ...{ achtergrond, eyebrow, intro, titel, instructie } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, opties.map((o, i) => {
    const sel = picked === i;
    const showCorrect = toonFeedback && o.correct;
    const stroke = showCorrect ? "#12B76A" : sel ? "#0F1012" : "#D0D5DD";
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        type: "button",
        onClick: () => setPicked(i),
        style: {
          background: "#FFFFFF",
          border: `1px solid ${stroke}`,
          borderRadius: "var(--wt-radius)",
          padding: "20px 24px",
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          gap: 16,
          font: "inherit",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          color: "#0F1012",
          cursor: "pointer",
          textAlign: "left"
        }
      },
      /* @__PURE__ */ React.createElement(RadioDot, { selected: sel, correct: showCorrect }),
      /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, o.tekst),
      showCorrect && /* @__PURE__ */ React.createElement(CorrectBadge, null)
    );
  })), /* @__PURE__ */ React.createElement(FeedbackButton, { label: "Controleer", enabled: picked !== null }));
}
window.VraagStelling = VraagStelling;
})();
