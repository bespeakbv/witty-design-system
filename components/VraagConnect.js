(function () {
function VraagConnect({
  achtergrond = "standaard",
  eyebrow = "Vraag 3 of kop titel",
  intro = "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  titel = "Vestibulum placerat ipsum vel malesuada vehicula.",
  instructie = "Instructie",
  metAfbeelding = false,
  paren = [
    { links: "Begrip 1", rechts: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", afbeelding: "assets/vraag-img-1.jpg" },
    { links: "Begrip 2", rechts: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.", afbeelding: "assets/vraag-img-2.jpg" },
    { links: "Begrip 3", rechts: "Duis aute irure dolor in reprehenderit in voluptate velit esse.", afbeelding: "assets/vraag-img-1.jpg" },
    { links: "Begrip 4", rechts: "Excepteur sint occaecat cupidatat non proident, sunt in culpa.", afbeelding: "assets/vraag-img-2.jpg" }
  ],
  toonFeedback = false
}) {
  const [order, setOrder] = React.useState(
    () => shuffleConnect(paren.map((_, i) => i), paren.length + 11)
  );
  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const next = order.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    setOrder(next);
  };
  const rowHeight = metAfbeelding ? 140 : 76;
  return /* @__PURE__ */ React.createElement(VraagShell, { ...{ achtergrond, eyebrow, intro, titel, instructie } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: 32,
    rowGap: 16,
    alignItems: "stretch"
  } }, paren.map((p, rowIdx) => {
    const rechtsIdx = order[rowIdx];
    const rechtsItem = paren[rechtsIdx];
    const isCorrect = toonFeedback && rechtsIdx === rowIdx;
    const isWrong = toonFeedback && rechtsIdx !== rowIdx;
    const rightBorder = isCorrect ? "1px solid #12B76A" : isWrong ? "1px solid #F04438" : "none";
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: rowIdx }, metAfbeelding ? /* @__PURE__ */ React.createElement("div", { style: {
      position: "relative",
      height: rowHeight,
      background: p.afbeelding ? `url(${p.afbeelding}) center / cover no-repeat` : "repeating-linear-gradient(135deg, #EEF2F5 0 12px, #E4E9EE 12px 24px)",
      borderRadius: "var(--wt-radius)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#667085",
      fontFamily: "var(--font-body)",
      fontSize: 12,
      fontWeight: 600
    } }, !p.afbeelding && /* @__PURE__ */ React.createElement("span", null, "Afbeelding vervangen"), /* @__PURE__ */ React.createElement(ConnectNotch, null)) : /* @__PURE__ */ React.createElement("div", { style: {
      position: "relative",
      minHeight: rowHeight,
      borderRadius: "var(--wt-radius)",
      background: "#FFFFFF",
      border: "1px solid #D0D5DD",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      lineHeight: "24px",
      color: "#0F1012"
    } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, p.links), /* @__PURE__ */ React.createElement(ConnectNotch, null)), /* @__PURE__ */ React.createElement("div", { style: {
      minHeight: rowHeight,
      borderRadius: "var(--wt-radius)",
      background: "#F9FAFB",
      border: rightBorder,
      padding: "20px 16px 20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 12
    } }, /* @__PURE__ */ React.createElement("span", { style: {
      flex: 1,
      fontFamily: "var(--font-body)",
      fontSize: 16,
      lineHeight: "24px",
      color: "#0F1012"
    } }, rechtsItem.rechts), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(ArrowIconBtn, { dir: "up", disabled: rowIdx === 0, onClick: () => move(rowIdx, -1) }), /* @__PURE__ */ React.createElement(ArrowIconBtn, { dir: "down", disabled: rowIdx === paren.length - 1, onClick: () => move(rowIdx, 1) }))));
  })), /* @__PURE__ */ React.createElement(FeedbackButton, { label: "Controleer", enabled: true }));
}
function ConnectNotch() {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: "12",
      height: "20",
      viewBox: "0 0 12 20",
      fill: "none",
      style: {
        position: "absolute",
        top: "50%",
        right: -11,
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: "#D0D5DD"
      },
      "aria-hidden": "true"
    },
    /* @__PURE__ */ React.createElement("path", { d: "M1 1l10 9-10 9", stroke: "currentColor", strokeWidth: "1", fill: "#FFFFFF" })
  );
}
function shuffleConnect(arr, seed = 1) {
  const a = arr.slice();
  let m = a.length, t, i, s = seed;
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
window.VraagConnect = VraagConnect;
})();
