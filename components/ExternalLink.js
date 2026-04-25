(function () {
function IconLinkExternal({ color = "currentColor" }) {
  return /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M7.5 4.167H5.333c-1.4 0-2.1 0-2.635.272a2.5 2.5 0 00-1.093 1.093c-.272.535-.272 1.235-.272 2.635v4.667c0 1.4 0 2.1.272 2.635a2.5 2.5 0 001.093 1.093c.535.272 1.235.272 2.635.272h4.667c1.4 0 2.1 0 2.635-.272a2.5 2.5 0 001.093-1.093c.272-.535.272-1.235.272-2.635V12.5M12.5 2.5h5m0 0v5m0-5L9.583 10.417",
      stroke: color,
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ));
}
function IconDownload({ color = "currentColor" }) {
  return /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M17.5 12.5v1c0 1.4 0 2.1-.272 2.635a2.5 2.5 0 01-1.093 1.093c-.535.272-1.235.272-2.635.272H6.5c-1.4 0-2.1 0-2.635-.272a2.5 2.5 0 01-1.093-1.093C2.5 15.6 2.5 14.9 2.5 13.5v-1M14.167 8.333L10 12.5m0 0L5.833 8.333M10 12.5v-10",
      stroke: color,
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ));
}
function ExternalLink({
  achtergrond = "standaard",
  onderSpacing = true,
  type = "link",
  titel = "Titel",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur laoreet vel nisl quis laoreet. Vivamus leo tellus, rhoncus vitae.",
  linkTekst,
  href = "#",
  toonAfbeelding = true,
  afbeelding = "assets/external-link-thumb.jpg"
}) {
  const label = linkTekst || (type === "download" ? "Download" : "Open boek");
  return /* @__PURE__ */ React.createElement(BlockFrame, { achtergrond, onderSpacing, contentMaxWidth: 1216 }, (p) => {
    const cardBg = achtergrond === "standaard" ? "var(--neutral-50)" : achtergrond === "neutral" || achtergrond === "licht" ? "var(--white)" : "rgba(255,255,255,0.06)";
    const bodyColor = achtergrond === "donker" ? "rgba(255,255,255,0.72)" : "var(--ink-muted)";
    const titleColor = achtergrond === "donker" ? "var(--white)" : "var(--ink)";
    const linkColor = achtergrond === "donker" ? "#7FD4CE" : "var(--teal-700)";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: toonAfbeelding ? "1fr 240px" : "1fr",
          background: cardBg,
          minHeight: 184,
          alignItems: "stretch",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 40px",
            gap: 16
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(
          "h3",
          {
            style: {
              margin: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 24,
              lineHeight: "32px",
              letterSpacing: "-0.01em",
              color: titleColor
            }
          },
          titel
        ), /* @__PURE__ */ React.createElement(
          "p",
          {
            style: {
              margin: 0,
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: "24px",
              color: bodyColor,
              textWrap: "pretty"
            }
          },
          body
        )),
        /* @__PURE__ */ React.createElement(
          "a",
          {
            href,
            target: type === "link" ? "_blank" : void 0,
            rel: type === "link" ? "noopener noreferrer" : void 0,
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "24px",
              color: linkColor,
              textDecoration: "none",
              alignSelf: "flex-start"
            }
          },
          /* @__PURE__ */ React.createElement("span", null, label),
          type === "download" ? /* @__PURE__ */ React.createElement(IconDownload, null) : /* @__PURE__ */ React.createElement(IconLinkExternal, null)
        )
      ),
      toonAfbeelding && /* @__PURE__ */ React.createElement(
        "div",
        {
          "aria-hidden": "true",
          style: {
            minHeight: 184,
            background: afbeelding ? `url(${afbeelding}) center / cover no-repeat` : "var(--neutral-100)"
          }
        }
      )
    );
  });
}
window.ExternalLink = ExternalLink;
})();
