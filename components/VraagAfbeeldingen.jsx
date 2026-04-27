// VraagAfbeeldingen.jsx — Vraag met afbeeldings-antwoorden (single of multi)
// Toont een grid van kaartjes met afbeelding + tekst.
// Selectie state: stroke donker. Correct state: groene stroke + CorrectBadge.

function VraagAfbeeldingen({
  achtergrond = "standaard",
  eyebrow = "Vraag 3 of kop titel",
  intro = "",
  titel = "",
  instructie = "Instructie",
  multi = false,
  opties = [
    { tekst: "", afbeelding: "assets/vraag-img-1.jpg", correct: true },
    { tekst: "", afbeelding: "assets/vraag-img-2.jpg", correct: false },
    { tekst: "", afbeelding: "assets/vraag-img-1.jpg", correct: false },
    { tekst: "", afbeelding: "assets/vraag-img-2.jpg", correct: false },
  ],
  toonFeedback = false,
}) {
  const [picked, setPicked] = React.useState(() => new Set());

  const toggle = (i) => {
    const next = new Set(picked);
    if (multi) {
      if (next.has(i)) next.delete(i); else next.add(i);
    } else {
      next.clear(); next.add(i);
    }
    setPicked(next);
  };

  const hasPick = picked.size > 0;

  return (
    <VraagShell {...{ achtergrond, eyebrow, intro, titel, instructie }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 16,
      }}>
        {opties.map((opt, i) => {
          const sel = picked.has(i);
          const showCorrect = toonFeedback && opt.correct;
          const stroke = showCorrect ? "#12B76A" : (sel ? "#0F1012" : "#D0D5DD");
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${stroke}`,
                borderRadius: "var(--wt-radius)",
                padding: 0,
                overflow: "hidden",
                cursor: "pointer",
                font: "inherit",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                background: opt.afbeelding
                  ? `url(${opt.afbeelding}) center / cover no-repeat`
                  : "repeating-linear-gradient(135deg, #EEF2F5 0 12px, #E4E9EE 12px 24px)",
                display: opt.afbeelding ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#667085",
              }}>
                {!opt.afbeelding && (
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600 }}>
                    Afbeelding vervangen
                  </span>
                )}
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  {multi ? <CheckBox selected={sel} correct={showCorrect} /> : <RadioDot selected={sel} correct={showCorrect} />}
                </div>
                {showCorrect && (
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <CorrectBadge />
                  </div>
                )}
              </div>
              <div style={{
                padding: "16px 20px",
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: "24px",
                color: "#0F1012",
              }}>
                {opt.tekst}
              </div>
            </button>
          );
        })}
      </div>
      <FeedbackButton label="Controleer" enabled={hasPick} />
    </VraagShell>
  );
}

window.VraagAfbeeldingen = VraagAfbeeldingen;
