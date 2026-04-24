// TekstBouwblok.jsx
// Witty — Tekst bouwblok
// Recreatie van /Page-1/Content uit "Tekst bouwblokken.fig"
//
// Props:
//   variant:         "media-links" | "media-rechts" | "een-kolom" | "gecentreerd" | "twee-kolommen"
//   achtergrond:     "standaard" | "licht" | "donker" | "neutral"
//   onderSpacing:    boolean                // extra ruimte onder het blok
//   mediaType:       "afbeelding" | "video" // alleen media-varianten
//   mediaSrc:        string                 // image url of video poster
//   mediaDimensions: "full" | "boxed"       // edge-to-edge of binnen padding
//   titel:           string
//   subtitel:        string
//   body:            string  (voor een-kolom / gecentreerd / media-*)
//   body2:           string  (voor twee-kolommen)
//   toonTitel:       boolean
//   toonSubtitel:    boolean

const { useMemo } = React;

const Divider = ({ color }) => (
  <div
    className="wt-divider"
    style={{
      width: 80,
      height: 1,
      background: color,
      marginTop: 16,
    }}
  />
);

const MediaPlay = () => (
  // Play-knop in witte cirkel — uit Figma ShapeBorderedColorLightV2
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: "50%",
        background: "#fff",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)",
      }}
    >
      <svg width="26" height="32" viewBox="0 0 26.3 32.67" fill="#0F1012" aria-hidden>
        <path d="M0 4.2C0 2.29 0 1.33.4.8.75.34 1.28.04 1.86 0c.66-.04 1.46.47 3.07 1.5l18.88 12.14c1.39.9 2.09 1.34 2.33 1.91.21.5.21 1.06 0 1.56-.24.57-.94 1.02-2.33 1.91L4.93 31.17c-1.61 1.03-2.41 1.55-3.07 1.5A1.78 1.78 0 0 1 .4 31.87C0 31.34 0 30.38 0 28.47V4.2Z" />
      </svg>
    </div>
  </div>
);

// MediaPlaceholder — getoond wanneer er géén echte media-src is. Eindgebruikers
// (onderwijskundigen) vervangen dit later via de lesauteurs-omgeving.
const MediaPlaceholder = ({ type, style }) => (
  <div
    className="wt-media wt-media--placeholder"
    style={{
      position: "relative",
      width: "100%",
      aspectRatio: "552 / 459",
      overflow: "hidden",
      background:
        "repeating-linear-gradient(135deg, #EEF2F5 0 12px, #E4E9EE 12px 24px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#667085",
      ...style,
    }}
    aria-label={type === "video" ? "Video placeholder" : "Afbeelding placeholder"}
  >
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {type === "video" ? (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor"/>
          </>
        ) : (
          <>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"/>
            <path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        )}
      </svg>
      <span>{type === "video" ? "Video vervangen" : "Afbeelding vervangen"}</span>
    </div>
  </div>
);

const Media = ({ type, src, style, toonPlayknop = true }) => {
  const hasSrc = typeof src === "string" && src.trim().length > 0;
  if (!hasSrc) return <MediaPlaceholder type={type} style={style} />;
  return (
    <div
      className="wt-media"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "552 / 459",
        overflow: "hidden",
        background: "#eee",
        ...style,
      }}
    >
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {type === "video" && toonPlayknop && <MediaPlay />}
    </div>
  );
};

window.MediaPlaceholder = MediaPlaceholder;

// ——— Text block pieces ———
const TitleAndDivider = ({ titel, toonTitel, dividerColor, titleColor }) => {
  if (!toonTitel) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2 className="wt-block-title" style={{ color: titleColor }}>
        {titel}
      </h2>
      <Divider color={dividerColor} />
    </div>
  );
};

const BodyBlock = ({ subtitel, body, toonSubtitel, titleColor, bodyColor }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--body-inner-gap)",
    }}
  >
    {toonSubtitel && (
      <h3 className="wt-subtitle" style={{ color: titleColor }}>
        {subtitel}
      </h3>
    )}
    <p className="wt-body" style={{ color: bodyColor }}>
      {body}
    </p>
  </div>
);

// ——— Main component ———
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
    toonSubtitel = true,
  } = props;

  // Achtergrond → palette
  const palette = useMemo(() => {
    const map = {
      standaard: {
        bg: "var(--bg-standaard)",
        title: "var(--fg-on-standaard-title)",
        body: "var(--fg-on-standaard-body)",
        divider: "var(--fg-on-standaard-divider)",
      },
      licht: {
        bg: "var(--bg-licht)",
        title: "var(--fg-on-licht-title)",
        body: "var(--fg-on-licht-body)",
        divider: "var(--fg-on-licht-divider)",
      },
      donker: {
        bg: "var(--bg-donker)",
        title: "var(--fg-on-donker-title)",
        body: "var(--fg-on-donker-body)",
        divider: "var(--fg-on-donker-divider)",
      },
      neutral: {
        bg: "var(--bg-neutral)",
        title: "var(--fg-on-neutral-title)",
        body: "var(--fg-on-neutral-body)",
        divider: "var(--fg-on-neutral-divider)",
      },
    };
    return map[achtergrond] || map.standaard;
  }, [achtergrond]);

  // Outer frame props gedeeld door alle varianten
  // "Full" media dimensions: media raakt boven/onder ook en blok heeft
  // geen verticale padding (zodat media edge-to-edge loopt).
  const isMediaVariant = variant === "media-links" || variant === "media-rechts";
  const isFullMedia = isMediaVariant && mediaDimensions === "full";
  const outer = {
    background: palette.bg,
    width: "100%",
    paddingTop: isFullMedia ? 0 : "var(--block-pad-y)",
    paddingBottom: isFullMedia ? 0 : (onderSpacing ? "var(--block-pad-y)" : 0),
  };

  const inner = {
    maxWidth: 1216,
    margin: "0 auto",
    paddingLeft: "var(--block-pad-x)",
    paddingRight: "var(--block-pad-x)",
  };

  const textCol = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--content-gap)",
        maxWidth: "var(--content-max-width)",
      }}
    >
      <TitleAndDivider
        titel={titel}
        toonTitel={toonTitel}
        titleColor={palette.title}
        dividerColor={palette.divider}
      />
      <BodyBlock
        subtitel={subtitel}
        body={body}
        toonSubtitel={toonSubtitel}
        titleColor={palette.title}
        bodyColor={palette.body}
      />
    </div>
  );

  // ─── VARIANT RENDERERS ───────────────────────────────────────────────
  let content;

  if (variant === "een-kolom") {
    content = (
      <div style={inner}>
        <div style={{ maxWidth: "var(--content-max-width)" }}>{textCol}</div>
      </div>
    );
  } else if (variant === "gecentreerd") {
    // Gecentreerd = tekstkolom gecentreerd op de pagina, tekst erbinnen
    // ook gecentreerd (titel, divider, subtitel, body).
    content = (
      <div style={inner}>
        <div
          style={{
            maxWidth: "var(--content-max-width)",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "var(--content-gap)",
            alignItems: "center",
          }}
        >
          {toonTitel && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
              <h2 className="wt-block-title" style={{ color: palette.title, textAlign: "center", width: "100%" }}>
                {titel}
              </h2>
              <Divider color={palette.divider} />
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--body-inner-gap)",
              textAlign: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {toonSubtitel && (
              <h3 className="wt-subtitle" style={{ color: palette.title, textAlign: "center" }}>
                {subtitel}
              </h3>
            )}
            <p className="wt-body" style={{ color: palette.body, textAlign: "center" }}>
              {body}
            </p>
          </div>
        </div>
      </div>
    );
  } else if (variant === "twee-kolommen") {
    // Titel + divider lopen over de volledige breedte van beide kolommen.
    // Daaronder: twee bodies naast elkaar.
    content = (
      <div style={inner}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--content-gap)" }}>
          {/* Titel over volledige breedte */}
          <TitleAndDivider
            titel={titel}
            toonTitel={toonTitel}
            titleColor={palette.title}
            dividerColor={palette.divider}
          />
          {/* Twee bodies onder elkaar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--two-col-gap)",
              alignItems: "start",
            }}
          >
            <BodyBlock
              subtitel={subtitel}
              body={body}
              toonSubtitel={toonSubtitel}
              titleColor={palette.title}
              bodyColor={palette.body}
            />
            <BodyBlock
              subtitel={subtitel}
              body={body2}
              toonSubtitel={toonSubtitel}
              titleColor={palette.title}
              bodyColor={palette.body}
            />
          </div>
        </div>
      </div>
    );
  } else {
    // media-links / media-rechts — 50/50 verdeling
    const isRight = variant === "media-rechts";
    const isFull = mediaDimensions === "full";

    // Kleinere gap voor media-varianten (136px two-col-gap was bedoeld voor
    // tekst/tekst waar kolommen ademruimte nodig hebben). Bij media/tekst
    // zit de media strak tegen het midden.
    const mediaGap = "64px";

    // Text column cell: text is left-aligned within its half (or right-aligned
    // on right-media variant, so text "hugs" the media edge).
    const textHalf = (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: isRight ? "flex-end" : "flex-start",
        }}
      >
        <div style={{ width: "100%", maxWidth: "var(--content-max-width)" }}>
          {textCol}
        </div>
      </div>
    );

    const mediaHalf = (
      <Media
        type={mediaType}
        src={mediaSrc}
        style={isFull
          ? { width: "100%", height: "100%", aspectRatio: "auto", minHeight: 460 }
          : { width: "100%" }}
        toonPlayknop={toonPlayknop}
      />
    );

    if (isFull) {
      // Full = media raakt alle 3 randen (boven/onder + zijrand). Media stretched,
      // tekst krijgt verticale padding om luchtig te blijven. Nog steeds 50/50.
      content = (
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: mediaGap,
              alignItems: "stretch",
              paddingRight: isRight ? 0 : "var(--block-pad-x)",
              paddingLeft: isRight ? "var(--block-pad-x)" : 0,
            }}
          >
            {isRight ? (
              <>
                <div style={{ display: "flex", alignItems: "center", paddingTop: "var(--block-pad-y)", paddingBottom: onderSpacing ? "var(--block-pad-y)" : 0 }}>
                  {textHalf}
                </div>
                {mediaHalf}
              </>
            ) : (
              <>
                {mediaHalf}
                <div style={{ display: "flex", alignItems: "center", paddingTop: "var(--block-pad-y)", paddingBottom: onderSpacing ? "var(--block-pad-y)" : 0 }}>
                  {textHalf}
                </div>
              </>
            )}
          </div>
        </div>
      );
    } else {
      // Boxed = beide kolommen binnen max-width + padding. 50/50.
      content = (
        <div style={inner}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: mediaGap,
              alignItems: "center",
            }}
          >
            {isRight ? (
              <>{textHalf}{mediaHalf}</>
            ) : (
              <>{mediaHalf}{textHalf}</>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <section
      className={`wt-block wt-block--${variant} wt-block--bg-${achtergrond}`}
      style={outer}
    >
      {content}
    </section>
  );
}

window.TekstBouwblok = TekstBouwblok;
