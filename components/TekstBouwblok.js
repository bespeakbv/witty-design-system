(function () {
const { useMemo } = React;
const Divider = ({ color }) => /* @__PURE__ */ React.createElement(
  "div",
  {
    className: "wt-divider",
    style: {
      width: 80,
      height: 1,
      background: color,
      marginTop: 16
    }
  }
);
const MediaPlay = () => (
  // Play-knop in witte cirkel — uit Figma ShapeBorderedColorLightV2
  /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none"
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "#fff",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)"
        }
      },
      /* @__PURE__ */ React.createElement("svg", { width: "26", height: "32", viewBox: "0 0 26.3 32.67", fill: "#0F1012", "aria-hidden": true }, /* @__PURE__ */ React.createElement("path", { d: "M0 4.2C0 2.29 0 1.33.4.8.75.34 1.28.04 1.86 0c.66-.04 1.46.47 3.07 1.5l18.88 12.14c1.39.9 2.09 1.34 2.33 1.91.21.5.21 1.06 0 1.56-.24.57-.94 1.02-2.33 1.91L4.93 31.17c-1.61 1.03-2.41 1.55-3.07 1.5A1.78 1.78 0 0 1 .4 31.87C0 31.34 0 30.38 0 28.47V4.2Z" }))
    )
  )
);
const MediaPlaceholder = ({ type, style }) => /* @__PURE__ */ React.createElement(
  "div",
  {
    className: "wt-media wt-media--placeholder",
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: "552 / 459",
      overflow: "hidden",
      background: "repeating-linear-gradient(135deg, #EEF2F5 0 12px, #E4E9EE 12px 24px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#667085",
      ...style
    },
    "aria-label": type === "video" ? "Video placeholder" : "Afbeelding placeholder"
  },
  /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    fontFamily: "var(--font-body)",
    fontSize: 13,
    fontWeight: 600
  } }, /* @__PURE__ */ React.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, type === "video" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2", stroke: "currentColor", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("path", { d: "M10 9.5v5l4.5-2.5L10 9.5z", fill: "currentColor" })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2", stroke: "currentColor", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "8.5", cy: "9.5", r: "1.5", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M4 17l5-5 4 4 3-3 4 4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }))), /* @__PURE__ */ React.createElement("span", null, type === "video" ? "Video vervangen" : "Afbeelding vervangen"))
);
const Media = ({ type, src, style, toonPlayknop = true }) => {
  const hasSrc = typeof src === "string" && src.trim().length > 0;
  if (!hasSrc) return /* @__PURE__ */ React.createElement(MediaPlaceholder, { type, style });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "wt-media",
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: "552 / 459",
        overflow: "hidden",
        background: "#eee",
        ...style
      }
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src,
        alt: "",
        style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
      }
    ),
    type === "video" && toonPlayknop && /* @__PURE__ */ React.createElement(MediaPlay, null)
  );
};
window.MediaPlaceholder = MediaPlaceholder;
const TitleAndDivider = ({ titel, toonTitel, dividerColor, titleColor }) => {
  if (!toonTitel) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("h2", { className: "wt-block-title", style: { color: titleColor } }, titel), /* @__PURE__ */ React.createElement(Divider, { color: dividerColor }));
};
const BodyBlock = ({ subtitel, body, toonSubtitel, titleColor, bodyColor }) => /* @__PURE__ */ React.createElement(
  "div",
  {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--body-inner-gap)"
    }
  },
  toonSubtitel && /* @__PURE__ */ React.createElement("h3", { className: "wt-subtitle", style: { color: titleColor } }, subtitel),
  /* @__PURE__ */ React.createElement("p", { className: "wt-body", style: { color: bodyColor } }, body)
);
function TekstBouwblok(props) {
  const {
    variant = "media-links",
    achtergrond = "standaard",
    onderSpacing = true,
    mediaType = "afbeelding",
    mediaSrc,
    mediaDimensions = "boxed",
    toonPlayknop = true,
    titel = "Titel",
    subtitel = "Subtitel",
    body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam. Quisque ut efficitur nibh, sed porttitor lacus. Nullam malesuada quam eget est ultrices consequat.",
    body2 = "Quisque ut efficitur nibh, sed porttitor lacus. Nullam malesuada quam eget est ultrices consequat. In finibus mauris eget orci semper.",
    toonTitel = true,
    toonSubtitel = true
  } = props;
  const palette = useMemo(() => {
    const map = {
      standaard: {
        bg: "var(--bg-standaard)",
        title: "var(--fg-on-standaard-title)",
        body: "var(--fg-on-standaard-body)",
        divider: "var(--fg-on-standaard-divider)"
      },
      licht: {
        bg: "var(--bg-licht)",
        title: "var(--fg-on-licht-title)",
        body: "var(--fg-on-licht-body)",
        divider: "var(--fg-on-licht-divider)"
      },
      donker: {
        bg: "var(--bg-donker)",
        title: "var(--fg-on-donker-title)",
        body: "var(--fg-on-donker-body)",
        divider: "var(--fg-on-donker-divider)"
      },
      neutral: {
        bg: "var(--bg-neutral)",
        title: "var(--fg-on-neutral-title)",
        body: "var(--fg-on-neutral-body)",
        divider: "var(--fg-on-neutral-divider)"
      }
    };
    return map[achtergrond] || map.standaard;
  }, [achtergrond]);
  const isMediaVariant = variant === "media-links" || variant === "media-rechts";
  const isFullMedia = isMediaVariant && mediaDimensions === "full";
  const outer = {
    background: palette.bg,
    width: "100%",
    paddingTop: isFullMedia ? 0 : "var(--block-pad-y)",
    paddingBottom: isFullMedia ? 0 : onderSpacing ? "var(--block-pad-y)" : 0
  };
  const inner = {
    maxWidth: 1216,
    margin: "0 auto",
    paddingLeft: "var(--block-pad-x)",
    paddingRight: "var(--block-pad-x)"
  };
  const textCol = /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--content-gap)",
        maxWidth: "var(--content-max-width)"
      }
    },
    /* @__PURE__ */ React.createElement(
      TitleAndDivider,
      {
        titel,
        toonTitel,
        titleColor: palette.title,
        dividerColor: palette.divider
      }
    ),
    /* @__PURE__ */ React.createElement(
      BodyBlock,
      {
        subtitel,
        body,
        toonSubtitel,
        titleColor: palette.title,
        bodyColor: palette.body
      }
    )
  );
  let content;
  if (variant === "een-kolom") {
    content = /* @__PURE__ */ React.createElement("div", { style: inner }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "var(--content-max-width)" } }, textCol));
  } else if (variant === "gecentreerd") {
    content = /* @__PURE__ */ React.createElement("div", { style: inner }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          maxWidth: "var(--content-max-width)",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "var(--content-gap)",
          alignItems: "center"
        }
      },
      toonTitel && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" } }, /* @__PURE__ */ React.createElement("h2", { className: "wt-block-title", style: { color: palette.title, textAlign: "center", width: "100%" } }, titel), /* @__PURE__ */ React.createElement(Divider, { color: palette.divider })),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "var(--body-inner-gap)",
            textAlign: "center",
            alignItems: "center",
            width: "100%"
          }
        },
        toonSubtitel && /* @__PURE__ */ React.createElement("h3", { className: "wt-subtitle", style: { color: palette.title, textAlign: "center" } }, subtitel),
        /* @__PURE__ */ React.createElement("p", { className: "wt-body", style: { color: palette.body, textAlign: "center" } }, body)
      )
    ));
  } else if (variant === "twee-kolommen") {
    content = /* @__PURE__ */ React.createElement("div", { style: inner }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--content-gap)" } }, /* @__PURE__ */ React.createElement(
      TitleAndDivider,
      {
        titel,
        toonTitel,
        titleColor: palette.title,
        dividerColor: palette.divider
      }
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--two-col-gap)",
          alignItems: "start"
        }
      },
      /* @__PURE__ */ React.createElement(
        BodyBlock,
        {
          subtitel,
          body,
          toonSubtitel,
          titleColor: palette.title,
          bodyColor: palette.body
        }
      ),
      /* @__PURE__ */ React.createElement(
        BodyBlock,
        {
          subtitel,
          body: body2,
          toonSubtitel,
          titleColor: palette.title,
          bodyColor: palette.body
        }
      )
    )));
  } else {
    const isRight = variant === "media-rechts";
    const isFull = mediaDimensions === "full";
    const mediaGap = "64px";
    const textHalf = /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          width: "100%",
          display: "flex",
          justifyContent: isRight ? "flex-end" : "flex-start"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: "var(--content-max-width)" } }, textCol)
    );
    const mediaHalf = /* @__PURE__ */ React.createElement(
      Media,
      {
        type: mediaType,
        src: mediaSrc,
        style: isFull ? { width: "100%", height: "100%", aspectRatio: "auto", minHeight: 460 } : { width: "100%" },
        toonPlayknop
      }
    );
    if (isFull) {
      content = /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1440, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: mediaGap,
            alignItems: "stretch",
            paddingRight: isRight ? 0 : "var(--block-pad-x)",
            paddingLeft: isRight ? "var(--block-pad-x)" : 0
          }
        },
        isRight ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", paddingTop: "var(--block-pad-y)", paddingBottom: onderSpacing ? "var(--block-pad-y)" : 0 } }, textHalf), mediaHalf) : /* @__PURE__ */ React.createElement(React.Fragment, null, mediaHalf, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", paddingTop: "var(--block-pad-y)", paddingBottom: onderSpacing ? "var(--block-pad-y)" : 0 } }, textHalf))
      ));
    } else {
      content = /* @__PURE__ */ React.createElement("div", { style: inner }, /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: mediaGap,
            alignItems: "center"
          }
        },
        isRight ? /* @__PURE__ */ React.createElement(React.Fragment, null, textHalf, mediaHalf) : /* @__PURE__ */ React.createElement(React.Fragment, null, mediaHalf, textHalf)
      ));
    }
  }
  return /* @__PURE__ */ React.createElement(
    "section",
    {
      className: `wt-block wt-block--${variant} wt-block--bg-${achtergrond}`,
      style: outer
    },
    content
  );
}
window.TekstBouwblok = TekstBouwblok;
})();
