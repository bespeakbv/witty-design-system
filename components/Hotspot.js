(function () {
function HotspotDot({ open, onClick, style }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick,
      "aria-label": open ? "Sluit hotspot" : "Open hotspot",
      style: {
        all: "unset",
        position: "absolute",
        width: 44,
        height: 44,
        borderRadius: 999,
        background: "var(--ink-muted)",
        color: "var(--white)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(15,16,18,0.25)",
        transform: "translate(-50%, -50%)",
        transition: "background 160ms ease",
        ...style
      }
    },
    open ? /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })) : /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M12 5v14M5 12h14", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }))
  );
}
function HotspotTooltip({ titel, body, style }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        width: 320,
        borderRadius: 8,
        background: "var(--teal-50)",
        padding: "16px 16px",
        boxShadow: "0px 4px 6px -2px rgba(15,16,18,0.08), 0px 12px 16px -4px rgba(15,16,18,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        color: "var(--ink)",
        ...style
      },
      role: "tooltip"
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "24px"
        }
      },
      titel
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          textWrap: "pretty"
        }
      },
      body
    )
  );
}
function Hotspot({
  achtergrond = "standaard",
  onderSpacing = true,
  titel = "Titel",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam.",
  afbeelding = "assets/hotspot-image.jpg",
  hotspots = [
    { x: 38, y: 28, titel: "Bladsteel", body: "De steel waaraan het blad vastzit aan de plant." },
    { x: 58, y: 62, titel: "Bladschijf", body: "Het groene, platte deel van het blad dat zonlicht opvangt voor fotosynthese." },
    { x: 78, y: 40, titel: "Bladnerf", body: "De transportbanen voor water en voedingsstoffen door het blad." }
  ],
  textPositie = "links",
  startIndex = 0
}) {
  const { useState } = React;
  const [openIdx, setOpenIdx] = useState(startIndex - 1);
  const toggle = (i) => setOpenIdx((cur) => cur === i ? -1 : i);
  return /* @__PURE__ */ React.createElement(BlockFrame, { achtergrond, onderSpacing, contentMaxWidth: 1216 }, (p) => {
    const tekstKolom = /* @__PURE__ */ React.createElement("div", { style: { flex: "0 0 360px", maxWidth: 360, display: "flex", flexDirection: "column", gap: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(
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
      titel
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          width: 80,
          height: 1,
          background: p.divider
        }
      }
    )), /* @__PURE__ */ React.createElement(
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
      body
    ));
    const stage = /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          aspectRatio: "4 / 3",
          background: afbeelding ? `url(${afbeelding}) center / cover no-repeat` : "var(--neutral-100)",
          overflow: "visible"
        }
      },
      hotspots.map((h, i) => {
        const isOpen = openIdx === i;
        const tooltipLeft = h.x < 55;
        const tooltipBelow = h.y < 70;
        return /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement(
          HotspotDot,
          {
            open: isOpen,
            onClick: () => toggle(i),
            style: { left: `${h.x}%`, top: `${h.y}%` }
          }
        ), isOpen && /* @__PURE__ */ React.createElement(
          HotspotTooltip,
          {
            titel: h.titel,
            body: h.body,
            style: {
              left: tooltipLeft ? `calc(${h.x}% + 32px)` : "auto",
              right: tooltipLeft ? "auto" : `calc(${100 - h.x}% + 32px)`,
              top: tooltipBelow ? `calc(${h.y}% + 12px)` : "auto",
              bottom: tooltipBelow ? "auto" : `calc(${100 - h.y}% + 12px)`
            }
          }
        ));
      })
    );
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: textPositie === "links" ? "row" : "row-reverse",
          gap: 64,
          alignItems: "flex-start"
        }
      },
      tekstKolom,
      stage
    );
  });
}
window.Hotspot = Hotspot;
})();
