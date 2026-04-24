// Quote.jsx — Witty bouwblok: pullquote met avatar + auteur
// Recreated from /Page-1/Quote (Figma node 1:1926).
//
// Layout (desktop, uit Figma Viewport=🖥️ Desktop):
//   - Blok padding: 96px v, 112px h; content-area max 800px (Figma 800x260)
//   - Tekst-kolom: 592px breed, avatar: 176px, gap 32px
//   - Quote: Lexend 36/44 bold, auteursregel 16/24 regular
//
// Props:
//   achtergrond:  "standaard" | "licht" | "donker" | "neutral"
//   onderSpacing: boolean
//   tekst:        quote body
//   auteur:       author name
//   avatarSrc:    image URL for the avatar (leeg → placeholder met initialen)
//   toonAvatar:   boolean
//   avatarPositie: "rechts" | "links"
//   metQuotes:    boolean — toont curly “ ” om de quote

function QuoteAvatar({ src, naam, palette }) {
  const size = 176;
  if (!src) {
    // Fallback: cirkel met initialen
    const initials = (naam || "A")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <div
        style={{
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
          flexShrink: 0,
        }}
        aria-label={`Avatar van ${naam}`}
      >
        {initials}
      </div>
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid var(--white)",
        boxShadow: palette && palette.bg === "var(--bg-donker)"
          ? "0 0 0 1px rgba(255,255,255,0.25)"
          : "0 0 0 1px var(--neutral-200)",
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={`Avatar van ${naam}`}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
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
  metQuotes = false,
}) {
  return (
    <BlockFrame achtergrond={achtergrond} onderSpacing={onderSpacing} contentMaxWidth={800}>
      {(p) => {
        const tekstKolom = (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 36,
                lineHeight: "44px",
                letterSpacing: "-0.01em",
                color: p.title,
                textWrap: "pretty",
              }}
            >
              {metQuotes ? `“${tekst}”` : tekst}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: "24px",
                color: p.title,
                opacity: 0.85,
              }}
            >
              {auteur}
            </p>
          </div>
        );

        const avatar = toonAvatar ? (
          <QuoteAvatar src={avatarSrc} naam={auteur} palette={p} />
        ) : null;

        return (
          <div
            style={{
              display: "flex",
              flexDirection: avatarPositie === "links" ? "row" : "row-reverse",
              alignItems: "center",
              gap: 32,
            }}
          >
            {avatar}
            {tekstKolom}
          </div>
        );
      }}
    </BlockFrame>
  );
}

window.Quote = Quote;
