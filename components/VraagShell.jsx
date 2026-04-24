// VraagShell.jsx
// Gedeelde header + wrapper voor alle vraag-bouwblokken.
// Levert: eyebrow (Vraag-nummer), intro tekst, titel (bold), divider, instructie.
// Gedeeld tussen: Vraag tekst, Vraag afbeeldingen, Poll, Stelling, Volgorde, Connect.
//
// Props:
//   achtergrond:  "standaard" | "licht" | "donker" | "neutral"
//   eyebrow/intro/titel/instructie: tekst
//   layout:       "alleen-tekst" | "media-links" | "media-rechts"
//                 (enkel Vraag-tekst gebruikt dit; andere blokken blijven alleen-tekst)
//   mediaType:    "afbeelding" | "video"
//   mediaSrc:     URL (leeg = placeholder)
//   toonPlayknop: boolean
//   onderSpacing: boolean
//   children: opties + feedback-knop. Kan ook een functie zijn die de palette
//             ontvangt voor kleur-aware rendering.

const vraagPalette = {
  standaard: { bg: "#FFFFFF",      title: "#0F1012", body: "#0F1012", muted: "#3D4148", divider: "#D0D5DD", eyebrow: "#37837D", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" },
  licht:     { bg: "#F4FBFA",      title: "#0F1012", body: "#0F1012", muted: "#3D4148", divider: "#D0D5DD", eyebrow: "#37837D", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" },
  donker:    { bg: "#1F4F4C",      title: "#FFFFFF", body: "#FFFFFF", muted: "rgba(255,255,255,0.82)", divider: "rgba(255,255,255,0.40)", eyebrow: "#8FD4CE", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" },
  neutral:   { bg: "#F9FAFB",      title: "#0F1012", body: "#0F1012", muted: "#3D4148", divider: "#D0D5DD", eyebrow: "#37837D", cardBg: "#FFFFFF", cardStroke: "#D0D5DD" },
};

// ── Interne helper: de vraag-header (eyebrow + intro + titel + divider + instructie)
function VraagHeader({ p, eyebrow, intro, titel, instructie }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {eyebrow && (
          <div style={{
            fontWeight: 700, fontSize: 16, lineHeight: "24px",
            color: p.eyebrow, fontFamily: "var(--font-body)",
          }}>{eyebrow}</div>
        )}
        {intro && (
          <div style={{
            fontSize: 16, lineHeight: "24px",
            color: p.body, fontFamily: "var(--font-body)",
          }}>{intro}</div>
        )}
        {titel && (
          <h3 style={{
            fontFamily: "var(--font-body)", fontWeight: 700,
            fontSize: 20, lineHeight: "24px",
            color: p.title, margin: 0,
          }}>{titel}</h3>
        )}
      </div>
      {instructie && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ width: 80, height: 1, background: p.divider }} />
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "24px",
            color: p.muted,
          }}>{instructie}</div>
        </div>
      )}
    </div>
  );
}

// ── Interne helper: media-tegel die het hele helft vult (full-bleed).
// Gebruikt window.MediaPlaceholder als er geen src is.
function VraagMedia({ type = "afbeelding", src, toonPlayknop = true, style }) {
  const hasSrc = typeof src === "string" && src.trim().length > 0;
  if (!hasSrc) {
    // Vierkant/alleen-hoog placeholder
    const Placeholder = window.MediaPlaceholder;
    if (Placeholder) {
      return <Placeholder type={type} style={{ aspectRatio: "auto", height: "100%", ...style }} />;
    }
    // Fallback als component nog niet geladen is
    return (
      <div style={{
        background: "repeating-linear-gradient(135deg, #EEF2F5 0 12px, #E4E9EE 12px 24px)",
        width: "100%", height: "100%", ...style,
      }} />
    );
  }
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {type === "video" && toonPlayknop && (
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            width: 84, height: 84, borderRadius: "50%",
            background: "#FFFFFF",
            display: "grid", placeItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0F1012"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}
    </div>
  );
}

function VraagShell({
  achtergrond = "standaard",
  eyebrow, intro, titel, instructie,
  children,
  onderSpacing = true,
  layout = "alleen-tekst",
  mediaType = "afbeelding",
  mediaSrc,
  toonPlayknop = true,
}) {
  const p = vraagPalette[achtergrond] || vraagPalette.standaard;
  const isMediaLinks  = layout === "media-links";
  const isMediaRechts = layout === "media-rechts";
  const isMedia       = isMediaLinks || isMediaRechts;

  // Kinderen: functie ontvangt de palette voor kleur-aware rendering.
  const renderChildren = () => (typeof children === "function" ? children(p) : children);

  if (isMedia) {
    // 50/50 layout — media full-bleed op één helft, tekst op de andere helft.
    // Layout-specs overgenomen uit Figma "Type=Full image left/right".
    const textColumn = (
      <div style={{
        padding: `96px 0 ${onderSpacing ? 96 : 0}px 0`,
        display: "flex", flexDirection: "column", gap: 40,
        // Tekst ademt binnen zijn helft (max 592 ~ Figma).
        maxWidth: 592, width: "100%",
      }}>
        <VraagHeader p={p} eyebrow={eyebrow} intro={intro} titel={titel} instructie={instructie} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {renderChildren()}
        </div>
      </div>
    );
    const mediaColumn = (
      <div style={{ width: "100%", minHeight: 560, display: "flex" }}>
        <VraagMedia type={mediaType} src={mediaSrc} toonPlayknop={toonPlayknop} />
      </div>
    );

    // Horizontal padding hanging: de tekstkolom krijgt een "pad" naar de media-rand
    // toe van 64px (Figma: gap 136, maar hier visueel rustiger op 64).
    return (
      <section
        className={`wt-vraag wt-vraag--${achtergrond}`}
        style={{
          background: p.bg, width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "stretch",
          minHeight: 680,
        }}
      >
        {isMediaLinks ? (
          <>
            {mediaColumn}
            <div style={{ paddingLeft: 64, paddingRight: 112, display: "flex", alignItems: "center" }}>
              {textColumn}
            </div>
          </>
        ) : (
          <>
            <div style={{ paddingLeft: 112, paddingRight: 64, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              {textColumn}
            </div>
            {mediaColumn}
          </>
        )}
      </section>
    );
  }

  // Alleen-tekst → gestandaardiseerde shell met max-breedte.
  return (
    <section
      className={`wt-vraag wt-vraag--${achtergrond}`}
      style={{
        background: p.bg,
        width: "100%",
        paddingTop: 96,
        paddingBottom: onderSpacing ? 96 : 0,
      }}
    >
      <div style={{ maxWidth: 1216, margin: "0 auto", paddingLeft: 112, paddingRight: 112 }}>
        <div style={{
          display: "flex", flexDirection: "column", gap: 24,
          maxWidth: 760,
        }}>
          <VraagHeader p={p} eyebrow={eyebrow} intro={intro} titel={titel} instructie={instructie} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
            {renderChildren()}
          </div>
        </div>
      </div>
    </section>
  );
}

window.VraagShell = VraagShell;
window.vraagPalette = vraagPalette;
