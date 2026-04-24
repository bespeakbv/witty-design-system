// MediaCarousel.jsx — Witty bouwblok: serie van media (afbeelding/video)
// met prev/next navigatie + page counter.
// Recreated from /Page-1/Media (Figma node 1:1684).
//
// Layout: stage (afbeelding of video) bovenin; dunne balk met "N van M" en
// prev/next onderaan. Media is contained binnen block-padding; in "full"-mode
// raakt de media de bloksranden.
//
// Props:
//   achtergrond:    "standaard" | "licht" | "donker" | "neutral"
//   onderSpacing:   boolean
//   items:          [{ src, soort: "afbeelding"|"video", alt }]
//   mediaDimensions: "boxed" | "full"
//   toonPlayknop:   boolean
//   startIndex:     number (1-indexed default 1; intern 0-indexed)

function MediaPlay({ small = false }) {
  const size = small ? 56 : 96;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(15,16,18,0.15)",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <svg width={size * 0.32} height={size * 0.38} viewBox="0 0 12 14">
        <path d="M0 0 L12 7 L0 14 Z" fill="var(--ink)" />
      </svg>
    </div>
  );
}

function MediaCarousel({
  achtergrond = "standaard",
  onderSpacing = true,
  items = [
    { src: "assets/media-carousel.jpg", soort: "video", alt: "Video thumbnail" },
    { src: "assets/media-carousel.jpg", soort: "afbeelding", alt: "Afbeelding" },
  ],
  mediaDimensions = "boxed",
  toonPlayknop = true,
}) {
  const { useState } = React;
  const [idx, setIdx] = useState(0);
  const total = Math.max(1, items.length);
  const current = items[idx] || items[0] || {};
  const soort = current.soort || "afbeelding";

  const stage = (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        background: current.src
          ? `url(${current.src}) center / cover no-repeat`
          : "var(--neutral-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label={current.alt || ""}
    >
      {soort === "video" && toonPlayknop && <MediaPlay />}
    </div>
  );

  const isFull = mediaDimensions === "full";

  return (
    <BlockFrame achtergrond={achtergrond} onderSpacing={onderSpacing} contentMaxWidth={isFull ? "100%" : 1216}>
      {(p) => (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          // "full" => haak uit het maxWidth-frame via negatieve margin
          marginLeft: isFull ? "calc(-1 * var(--block-pad-x))" : 0,
          marginRight: isFull ? "calc(-1 * var(--block-pad-x))" : 0,
        }}>
          {stage}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingLeft: isFull ? "var(--block-pad-x)" : 0,
              paddingRight: isFull ? "var(--block-pad-x)" : 0,
            }}
          >
            <PageNav
              index={idx}
              total={total}
              onPrev={() => setIdx((i) => Math.max(0, i - 1))}
              onNext={() => setIdx((i) => Math.min(total - 1, i + 1))}
              palette={p}
            />
          </div>
        </div>
      )}
    </BlockFrame>
  );
}

window.MediaCarousel = MediaCarousel;
window.MediaPlayButton = MediaPlay;
