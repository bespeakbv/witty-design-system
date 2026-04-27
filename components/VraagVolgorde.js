(function () {
function shuffle(arr, seed = 1) {
  const a = arr.slice();
  let m = a.length, t, i;
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  while (m) {
    i = Math.floor(rnd() * m--);
    t = a[m];
    a[m] = a[i];
    a[i] = t;
  }
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
    { tekst: "Stap twee \u2014 Consectetur adipiscing elit." },
    { tekst: "Stap drie \u2014 Sed do eiusmod tempor incididunt." },
    { tekst: "Stap vier \u2014 Ut labore et dolore magna aliqua." }
  ],
  toonFeedback = false
}) {
  const initial = React.useMemo(
    () => shuffle(opties.map((_, i) => i), opties.length + 3),
    [opties.length]
  );
  const [order, setOrder] = React.useState(initial);
  React.useEffect(() => {
    setOrder(initial);
  }, [initial]);
  const move = (from, dir) => {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const next = order.slice();
    [next[from], next[to]] = [next[to], next[from]];
    setOrder(next);
  };
  return /* @__PURE__ */ React.createElement(VraagShell, { ...{ achtergrond, eyebrow, intro, titel, instructie } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, order.map((origIdx, pos) => {
    const opt = opties[origIdx];
    const opJuistePlek = origIdx === pos;
    const showCorrect = toonFeedback && opJuistePlek;
    const showWrong = toonFeedback && !opJuistePlek;
    const stroke = showCorrect ? "#12B76A" : showWrong ? "#F04438" : "#D0D5DD";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: origIdx,
        style: {
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
          color: "#0F1012"
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, opt.tekst),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
        ArrowIconBtn,
        {
          dir: "up",
          disabled: pos === 0,
          onClick: () => move(pos, -1)
        }
      ), /* @__PURE__ */ React.createElement(
        ArrowIconBtn,
        {
          dir: "down",
          disabled: pos === order.length - 1,
          onClick: () => move(pos, 1)
        }
      ))
    );
  })), /* @__PURE__ */ React.createElement(FeedbackButton, { label: "Controleer", enabled: true }));
}
function ArrowIconBtn({ dir, disabled, onClick }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      "aria-label": dir === "up" ? "Omhoog" : "Omlaag",
      style: {
        all: "unset",
        width: 36,
        height: 36,
        display: "grid",
        placeItems: "center",
        color: disabled ? "#98A2B3" : "#0F1012",
        cursor: disabled ? "default" : "pointer",
        borderRadius: 6
      }
    },
    /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none" }, dir === "up" ? /* @__PURE__ */ React.createElement("path", { d: "M12 19V5M5 12l7-7 7 7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) : /* @__PURE__ */ React.createElement("path", { d: "M12 5v14M19 12l-7 7-7-7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))
  );
}
window.VraagVolgorde = VraagVolgorde;
window.ArrowIconBtn = ArrowIconBtn;
})();
