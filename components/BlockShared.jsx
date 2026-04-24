// BlockShared.jsx — helpers shared by the "content" bouwblokken
// (Quote, ExternalLink, MediaCarousel, Chat, Hotspot, Stepper).
//
// Exposes:
//   window.blockPalette(achtergrond) → { bg, title, body, divider, subtle }
//   window.BlockFrame                → outer frame with block padding + content-max-width

function blockPalette(achtergrond = "standaard") {
  const map = {
    standaard: {
      bg: "var(--bg-standaard)",
      title: "var(--fg-on-standaard-title)",
      body: "var(--fg-on-standaard-body)",
      divider: "var(--fg-on-standaard-divider)",
      subtle: "var(--neutral-50)",
    },
    licht: {
      bg: "var(--bg-licht)",
      title: "var(--fg-on-licht-title)",
      body: "var(--fg-on-licht-body)",
      divider: "var(--fg-on-licht-divider)",
      subtle: "rgba(55,131,125,0.08)",
    },
    donker: {
      bg: "var(--bg-donker)",
      title: "var(--fg-on-donker-title)",
      body: "var(--fg-on-donker-body)",
      divider: "var(--fg-on-donker-divider)",
      subtle: "rgba(255,255,255,0.08)",
    },
    neutral: {
      bg: "var(--bg-neutral)",
      title: "var(--fg-on-neutral-title)",
      body: "var(--fg-on-neutral-body)",
      divider: "var(--fg-on-neutral-divider)",
      subtle: "var(--white)",
    },
  };
  return map[achtergrond] || map.standaard;
}

// BlockFrame — the standard block wrapper: full-width rectangle, bg color,
// vertical padding (96/64), and an inner constrained content area.
function BlockFrame({ achtergrond = "standaard", onderSpacing = true, children, contentMaxWidth = 1216 }) {
  const p = blockPalette(achtergrond);
  return (
    <section
      style={{
        width: "100%",
        background: p.bg,
        paddingTop: "var(--block-pad-y)",
        paddingBottom: onderSpacing ? "var(--block-pad-y)" : 0,
        paddingLeft: "var(--block-pad-x)",
        paddingRight: "var(--block-pad-x)",
      }}
    >
      <div style={{ maxWidth: contentMaxWidth, margin: "0 auto", width: "100%" }}>
        {typeof children === "function" ? children(p) : children}
      </div>
    </section>
  );
}

// Small page-nav controls (prev / "N van M" / next) — used by MediaCarousel,
// Stepper, Hotspot gallery.
function PageNav({ index, total, onPrev, onNext, palette, size = "md" }) {
  const paletteSafe = palette || blockPalette("standaard");
  const isDark = paletteSafe.bg.includes("bg-donker") || paletteSafe.bg === "var(--bg-donker)";
  const atFirst = index <= 0;
  const atLast = index >= total - 1;
  const dim = size === "sm" ? 36 : 44;

  const btn = (dir, disabled, onClick) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Vorige" : "Volgende"}
      style={{
        all: "unset",
        width: dim,
        height: dim,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--wt-radius)",
        background: disabled
          ? (isDark ? "rgba(255,255,255,0.10)" : "var(--neutral-100)")
          : (isDark ? "var(--white)" : "var(--ink-muted)"),
        color: disabled
          ? (isDark ? "rgba(255,255,255,0.35)" : "var(--neutral-500)")
          : (isDark ? "var(--ink)" : "var(--white)"),
        transition: "background 160ms ease",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        {dir === "prev" ? (
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        color: paletteSafe.title,
      }}
    >
      {btn("prev", atFirst, onPrev)}
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "24px",
          minWidth: 60,
          textAlign: "center",
        }}
      >
        {index + 1} van {total}
      </span>
      {btn("next", atLast, onNext)}
    </div>
  );
}

Object.assign(window, { blockPalette, BlockFrame, PageNav });
