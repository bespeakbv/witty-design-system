// VraagVolgorde.jsx — Zet de opties in de juiste volgorde. Eenvoudige lijst met
// tekst + ↑/↓ knoppen rechts. Geen nummer-badge, geen drag-handle.
// De "juiste volgorde" is gelijk aan de array-volgorde van props.opties.

function shuffle(arr, seed = 1) {
  const a = arr.slice();
  let m = a.length, t, i;
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  while (m) { i = Math.floor(rnd() * m--); t = a[m]; a[m] = a[i]; a[i] = t; }
  return a;
}

function VraagVolgorde({
  achtergrond = "standaard",
  eyebrow = "Vraag 3 of kop titel",
  intro = "",
  titel = "Zet de stappen in de juiste volgorde.",
  instructie = "Instructie",
  opties = [
    { tekst: "" },
    { tekst: "Stap twee — Consectetur adipiscing elit." },
    { tekst: "Stap drie — Sed do eiusmod tempor incididunt." },
    { tekst: "Stap vier — Ut labore et dolore magna aliqua." },
  ],
  toonFeedback = false,
}) {
  const initial = React.useMemo(
    () => shuffle(opties.map((_, i) => i), opties.length + 3),
    [opties.length]
  );
  const [order, setOrder] = React.useState(initial);
  React.useEffect(() => { setOrder(initial); }, [initial]);

  const move = (from, dir) => {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const next = order.slice();
    [next[from], next[to]] = [next[to], next[from]];
    setOrder(next);
  };

  return (
    <VraagShell {...{ achtergrond, eyebrow, intro, titel, instructie }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {order.map((origIdx, pos) => {
          const opt = opties[origIdx];
          const opJuistePlek = origIdx === pos;
          const showCorrect = toonFeedback && opJuistePlek;
          const showWrong = toonFeedback && !opJuistePlek;
          const stroke = showCorrect ? "#12B76A" : (showWrong ? "#F04438" : "#D0D5DD");
          return (
            <div
              key={origIdx}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${stroke}`,
                borderRadius: "var(--wt-radius)",
                padding: "20px 16px 20px 24px",
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: "24px",
                color: "#0F1012",
              }}
            >
              <span style={{ flex: 1 }}>{opt.tekst}</span>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <ArrowIconBtn
                  dir="up"
                  disabled={pos === 0}
                  onClick={() => move(pos, -1)}
                />
                <ArrowIconBtn
                  dir="down"
                  disabled={pos === order.length - 1}
                  onClick={() => move(pos, +1)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <FeedbackButton label="Controleer" enabled />
    </VraagShell>
  );
}

function ArrowIconBtn({ dir, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "up" ? "Omhoog" : "Omlaag"}
      style={{
        all: "unset",
        width: 36, height: 36,
        display: "grid", placeItems: "center",
        color: disabled ? "#98A2B3" : "#0F1012",
        cursor: disabled ? "default" : "pointer",
        borderRadius: 6,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        {dir === "up" ? (
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

window.VraagVolgorde = VraagVolgorde;
window.ArrowIconBtn = ArrowIconBtn;
