(function () {
function QuoteAvatar({ src, naam, palette }) {
  const size = 176;
  if (!src) {
    const initials = (naam || "A").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--neutral-100)",
          color: "var(--ink-muted)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid var(--white)",
          boxShadow: "0 0 0 1px var(--neutral-200)",
          flexShrink: 0
        },
        "aria-label": `Avatar van ${naam}`
      },
      initials
    );
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid var(--white)",
        boxShadow: palette && palette.bg === "var(--bg-donker)" ? "0 0 0 1px rgba(255,255,255,0.25)" : "0 0 0 1px var(--neutral-200)",
        flexShrink: 0
      }
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src,
        alt: `Avatar van ${naam}`,
        style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
      }
    )
  );
}
function Quote({
  achtergrond = "standaard",
  onderSpacing = true,
  tekst = "Ut suscipit mi id lacinia luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  auteur = "Annemarie Docter",
  avatarSrc = "assets/avatar-annemarie.jpg",
  toonAvatar = true,
  avatarPositie = "rechts",
  metQuotes = false
}) {
  return /* @__PURE__ */ React.createElement(BlockFrame, { achtergrond, onderSpacing, contentMaxWidth: 800 }, (p) => {
    const tekstKolom = /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 } }, /* @__PURE__ */ React.createElement(
      "p",
      {
        style: {
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 36,
          lineHeight: "44px",
          letterSpacing: "-0.01em",
          color: p.title,
          textWrap: "pretty"
        }
      },
      metQuotes ? `\u201C${tekst}\u201D` : tekst
    ), /* @__PURE__ */ React.createElement(
      "p",
      {
        style: {
          margin: 0,
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          color: p.title,
          opacity: 0.85
        }
      },
      auteur
    ));
    const avatar = toonAvatar ? /* @__PURE__ */ React.createElement(QuoteAvatar, { src: avatarSrc, naam: auteur, palette: p }) : null;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: avatarPositie === "links" ? "row" : "row-reverse",
          alignItems: "center",
          gap: 32
        }
      },
      avatar,
      tekstKolom
    );
  });
}
window.Quote = Quote;
})();
