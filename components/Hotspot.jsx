// Hotspot.jsx — Witty bouwblok: afbeelding met klikbare punten die
// tooltips met titel/subtitle/body openen.
// Recreated from /Page-1/Hotspot (Figma node 1:1588).
//
// Layout: afbeelding (stage) met absoluut-gepositioneerde 44×44 dots
// (donker met wit plusje). Klik → dot wordt X, tooltip opent in een
// teal-50 kaart met pijl-minder layout. Tekst-kolom links of rechts
// van de afbeelding (op desktop). 
//
// Props:
//   achtergrond:   "standaard" | "licht" | "donker" | "neutral"
//   onderSpacing:  boolean
//   titel:         bloktitel (links van de afbeelding)
//   body:          korte introtekst (onder bloktitel)
//   afbeelding:    image URL
//   hotspots:      [{ x, y, titel, body }]   // x/y in % binnen stage
//   textPositie:   "links" | "rechts"       // positie van tekstkolom
//   startIndex:    nummer van hotspot die bij laden open staat (1-indexed, 0 = geen)

function HotspotDot({ open, onClick, style }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Sluit hotspot" : "Open hotspot"}
      style={{
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
        ...style,
      }}
    >
      {open ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function HotspotTooltip({ titel, body, style }) {
  return (
    <div
      style={{
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
        ...style,
      }}
      role="tooltip"
    >
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "24px",
        }}
      >
        {titel}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          textWrap: "pretty",
        }}
      >
        {body}
      </div>
    </div>
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
    { x: 78, y: 40, titel: "Bladnerf", body: "De transportbanen voor water en voedingsstoffen door het blad." },
  ],
  textPositie = "links",
  startIndex = 0,
}) {
  const { useState } = React;
  const [openIdx, setOpenIdx] = useState(startIndex - 1);

  const toggle = (i) => setOpenIdx((cur) => (cur === i ? -1 : i));

  return (
    <BlockFrame achtergrond={achtergrond} onderSpacing={onderSpacing} contentMaxWidth={1216}>
      {(p) => {
        const tekstKolom = (
          <div style={{ flex: "0 0 360px", maxWidth: 360, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 36,
                  lineHeight: "44px",
                  letterSpacing: "-0.01em",
                  color: p.title,
                }}
              >
                {titel}
              </h3>
              <div
                style={{
                  width: 80,
                  height: 1,
                  background: p.divider,
                }}
              />
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: "24px",
                color: p.body,
                textWrap: "pretty",
              }}
            >
              {body}
            </p>
          </div>
        );

        const stage = (
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: 0,
              aspectRatio: "4 / 3",
              background: afbeelding
                ? `url(${afbeelding}) center / cover no-repeat`
                : "var(--neutral-100)",
              overflow: "visible",
            }}
          >
            {hotspots.map((h, i) => {
              const isOpen = openIdx === i;
              // bepaal tooltip offset: horizontaal "rechts" als dot op linkerhelft, anders "links"
              const tooltipLeft = h.x < 55;
              // lodrechte positie onder dot (of boven als dicht bij onder)
              const tooltipBelow = h.y < 70;
              return (
                <React.Fragment key={i}>
                  <HotspotDot
                    open={isOpen}
                    onClick={() => toggle(i)}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  />
                  {isOpen && (
                    <HotspotTooltip
                      titel={h.titel}
                      body={h.body}
                      style={{
                        left: tooltipLeft ? `calc(${h.x}% + 32px)` : "auto",
                        right: tooltipLeft ? "auto" : `calc(${100 - h.x}% + 32px)`,
                        top: tooltipBelow ? `calc(${h.y}% + 12px)` : "auto",
                        bottom: tooltipBelow ? "auto" : `calc(${100 - h.y}% + 12px)`,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );

        return (
          <div
            style={{
              display: "flex",
              flexDirection: textPositie === "links" ? "row" : "row-reverse",
              gap: 64,
              alignItems: "flex-start",
            }}
          >
            {tekstKolom}
            {stage}
          </div>
        );
      }}
    </BlockFrame>
  );
}

window.Hotspot = Hotspot;
