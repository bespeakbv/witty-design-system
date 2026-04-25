(function () {
const vraagPalette = {
  standaard: { bg: "#FFFFFF", title: "#0F1012", body: "#0F1012", muted: "#3D4148", divider: "#D0D5DD", eyebrow: "#37837D", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" },
  licht: { bg: "#F4FBFA", title: "#0F1012", body: "#0F1012", muted: "#3D4148", divider: "#D0D5DD", eyebrow: "#37837D", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" },
  donker: { bg: "#1F4F4C", title: "#FFFFFF", body: "#FFFFFF", muted: "rgba(255,255,255,0.82)", divider: "rgba(255,255,255,0.40)", eyebrow: "#8FD4CE", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" },
  neutral: { bg: "#F9FAFB", title: "#0F1012", body: "#0F1012", muted: "#3D4148", divider: "#D0D5DD", eyebrow: "#37837D", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" }
};
function VraagHeader({ p, eyebrow, intro, titel, instructie }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, eyebrow && /* @__PURE__ */ React.createElement("div", { style: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "24px",
    color: p.eyebrow,
    fontFamily: "var(--font-body)"
  } }, eyebrow), intro && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 16,
    lineHeight: "24px",
    color: p.body,
    fontFamily: "var(--font-body)"
  } }, intro), titel && /* @__PURE__ */ React.createElement("h3", { style: {
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontSize: 20,
    lineHeight: "24px",
    color: p.title,
    margin: 0
  } }, titel)), instructie && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 1, background: p.divider } }), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--font-body)",
    fontSize: 16,
    lineHeight: "24px",
    color: p.muted
  } }, instructie)));
}
function VraagMedia({ type = "afbeelding", src, toonPlayknop = true, style }) {
  const hasSrc = typeof src === "string" && src.trim().length > 0;
  if (!hasSrc) {
    const Placeholder = window.MediaPlaceholder;
    if (Placeholder) {
      return /* @__PURE__ */ React.createElement(Placeholder, { type, style: { aspectRatio: "auto", height: "100%", ...style } });
    }
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: "repeating-linear-gradient(135deg, #EEF2F5 0 12px, #E4E9EE 12px 24px)",
      width: "100%",
      height: "100%",
      ...style
    } });
  }
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style } }, /* @__PURE__ */ React.createElement("img", { src, alt: "", style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }), type === "video" && toonPlayknop && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    pointerEvents: "none"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 84,
    height: 84,
    borderRadius: "50%",
    background: "#FFFFFF",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  } }, /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "#0F1012" }, /* @__PURE__ */ React.createElement("path", { d: "M8 5v14l11-7z" })))));
}
function VraagShell({
  achtergrond = "standaard",
  eyebrow,
  intro,
  titel,
  instructie,
  children,
  onderSpacing = true,
  layout = "alleen-tekst",
  mediaType = "afbeelding",
  mediaSrc,
  toonPlayknop = true
}) {
  const p = vraagPalette[achtergrond] || vraagPalette.standaard;
  const isMediaLinks = layout === "media-links";
  const isMediaRechts = layout === "media-rechts";
  const isMedia = isMediaLinks || isMediaRechts;
  const renderChildren = () => typeof children === "function" ? children(p) : children;
  if (isMedia) {
    const textColumn = /* @__PURE__ */ React.createElement("div", { style: {
      padding: `96px 0 ${onderSpacing ? 96 : 0}px 0`,
      display: "flex",
      flexDirection: "column",
      gap: 40,
      // Tekst ademt binnen zijn helft (max 592 ~ Figma).
      maxWidth: 592,
      width: "100%"
    } }, /* @__PURE__ */ React.createElement(VraagHeader, { p, eyebrow, intro, titel, instructie }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, renderChildren()));
    const mediaColumn = /* @__PURE__ */ React.createElement("div", { style: { width: "100%", minHeight: 560, display: "flex" } }, /* @__PURE__ */ React.createElement(VraagMedia, { type: mediaType, src: mediaSrc, toonPlayknop }));
    return /* @__PURE__ */ React.createElement(
      "section",
      {
        className: `wt-vraag wt-vraag--${achtergrond}`,
        style: {
          background: p.bg,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "stretch",
          minHeight: 680
        }
      },
      isMediaLinks ? /* @__PURE__ */ React.createElement(React.Fragment, null, mediaColumn, /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 64, paddingRight: 112, display: "flex", alignItems: "center" } }, textColumn)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 112, paddingRight: 64, display: "flex", alignItems: "center", justifyContent: "flex-end" } }, textColumn), mediaColumn)
    );
  }
  return /* @__PURE__ */ React.createElement(
    "section",
    {
      className: `wt-vraag wt-vraag--${achtergrond}`,
      style: {
        background: p.bg,
        width: "100%",
        paddingTop: 96,
        paddingBottom: onderSpacing ? 96 : 0
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1216, margin: "0 auto", paddingLeft: 112, paddingRight: 112 } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: 24,
      maxWidth: 760
    } }, /* @__PURE__ */ React.createElement(VraagHeader, { p, eyebrow, intro, titel, instructie }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16, marginTop: 8 } }, renderChildren())))
  );
}
window.VraagShell = VraagShell;
window.vraagPalette = vraagPalette;
})();
