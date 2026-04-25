(function () {
function Stepper({
  achtergrond = "donker",
  onderSpacing = true,
  layout = "twee-kolommen",
  stappen = [
    {
      titel: "Titel",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam. Quisque ut efficitur nibh, sed porttitor lacus. Nullam malesuada quam eget est ultrices consequat. In finibu."
    },
    {
      titel: "Stap twee",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam."
    },
    {
      titel: "Stap drie",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam."
    },
    {
      titel: "Stap vier",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam."
    },
    {
      titel: "Stap vijf",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam."
    }
  ]
}) {
  const { useState } = React;
  const total = Math.max(1, stappen.length);
  const [idx, setIdx] = useState(0);
  const stap = stappen[idx] || stappen[0];
  return /* @__PURE__ */ React.createElement(BlockFrame, { achtergrond, onderSpacing, contentMaxWidth: 1216 }, (p) => {
    const titelBlok = /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(
      "h3",
      {
        style: {
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 36,
          lineHeight: "44px",
          letterSpacing: "-0.01em",
          color: p.title
        }
      },
      stap.titel
    ), /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 1, background: p.divider } }));
    const bodyBlok = /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, stap.subtitel && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 20,
          lineHeight: "24px",
          color: p.title
        }
      },
      stap.subtitel
    ), /* @__PURE__ */ React.createElement(
      "p",
      {
        style: {
          margin: 0,
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          color: p.body,
          textWrap: "pretty"
        }
      },
      stap.body
    ));
    const content = layout === "een-kolom" ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 32, maxWidth: 640 } }, titelBlok, bodyBlok) : /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "488px 1fr",
          gap: 136,
          alignItems: "start"
        }
      },
      titelBlok,
      bodyBlok
    );
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 48 } }, content, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "flex-end"
        }
      },
      /* @__PURE__ */ React.createElement(
        PageNav,
        {
          index: idx,
          total,
          onPrev: () => setIdx((i) => Math.max(0, i - 1)),
          onNext: () => setIdx((i) => Math.min(total - 1, i + 1)),
          palette: p
        }
      )
    ));
  });
}
window.Stepper = Stepper;
})();
