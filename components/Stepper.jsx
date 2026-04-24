// Stepper.jsx — Witty bouwblok: doorklikbare stappen (titel + subtitel + body)
// Recreated from /Page-1/Stepper (Figma node 1:1740).
//
// Layout: titel-kolom links (Lexend 36/44), body-kolom rechts
// (subtitel + body). Onderaan prev/next + "N van M". Varianten:
//   - één-kolom:   alleen body-kolom onder de titel
//   - twee-kolom:  titel links, subtitel+body rechts (default, matches Figma)
// Achtergronden: standaard/licht/donker/neutral.
//
// Props:
//   achtergrond:    "standaard" | "licht" | "donker" | "neutral"
//   onderSpacing:   boolean
//   layout:         "een-kolom" | "twee-kolommen"
//   stappen:        [{ titel, subtitel, body }]

function Stepper({
  achtergrond = "donker",
  onderSpacing = true,
  layout = "twee-kolommen",
  stappen = [
    {
      titel: "Titel",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam. Quisque ut efficitur nibh, sed porttitor lacus. Nullam malesuada quam eget est ultrices consequat. In finibu.",
    },
    {
      titel: "Stap twee",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam.",
    },
    {
      titel: "Stap drie",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam.",
    },
    {
      titel: "Stap vier",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam.",
    },
    {
      titel: "Stap vijf",
      subtitel: "Subtitel",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et augue sed nunc ullamcorper venenam.",
    },
  ],
}) {
  const { useState } = React;
  const total = Math.max(1, stappen.length);
  const [idx, setIdx] = useState(0);
  const stap = stappen[idx] || stappen[0];

  return (
    <BlockFrame achtergrond={achtergrond} onderSpacing={onderSpacing} contentMaxWidth={1216}>
      {(p) => {
        const titelBlok = (
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
              {stap.titel}
            </h3>
            <div style={{ width: 80, height: 1, background: p.divider }} />
          </div>
        );

        const bodyBlok = (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stap.subtitel && (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: "24px",
                  color: p.title,
                }}
              >
                {stap.subtitel}
              </div>
            )}
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
              {stap.body}
            </p>
          </div>
        );

        const content =
          layout === "een-kolom" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 640 }}>
              {titelBlok}
              {bodyBlok}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "488px 1fr",
                gap: 136,
                alignItems: "start",
              }}
            >
              {titelBlok}
              {bodyBlok}
            </div>
          );

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {content}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
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
        );
      }}
    </BlockFrame>
  );
}

window.Stepper = Stepper;
