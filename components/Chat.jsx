// Chat.jsx — Witty bouwblok: scripted gesprek / dialoog
// Recreated from /Page-1/Chat (Figma node 1:1857).
//
// Eén ballon heeft:
//   - auteur:  "links" of "rechts"  (links = Annemarie/student, rechts = Michel/docent)
//   - titel?:  optionele vetgedrukte kop
//   - tekst:   body
//   - eerste-in-serie? → toont avatar + tail. Opeenvolgende van dezelfde auteur
//     lijnen uit, zonder tail, zonder herhaalde avatar.
//
// Kleur: links gebruikt neutral-50, rechts gebruikt teal-50 (branded light)
// zoals Figma. Radius 8px behalve de "oor"-hoek naar de avatar (0).
//
// Props:
//   achtergrond:   "standaard" | "licht" | "donker" | "neutral"
//   onderSpacing:  boolean
//   titel:         optionele bloktitel (boven gesprek)
//   berichten:     [{ auteur, titel?, tekst, avatarSrc? }]
//   avatars:       { links: url, rechts: url }  — overschrijft per-bericht avatarSrc als niet gezet
//   personen:      [{ naam, positie }] — optioneel; naam verschijnt boven eerste bubble per run
//                  (Slack-stijl). Lookup op positie ("links"/"rechts").

const CHAT_DEFAULTS = {
  avatars: {
    links: "assets/avatar-annemarie.jpg",
    rechts: "assets/avatar-michel.jpg",
  },
};

// Een SVG-"tail" die als oortje aan de ballon hangt
function BubbleTail({ kleur, links }) {
  // pad afgeleid uit Figma (BackgroundNeutralLightDirectionLeft / Right)
  if (links) {
    // Tail uitstekend naar links-onder
    return (
      <svg
        width="10"
        height="15"
        viewBox="0 0 9.335 14.243"
        style={{ position: "absolute", left: -8, bottom: 12, color: kleur }}
        aria-hidden="true"
      >
        <path
          d="M 9.236 0.363 C 8.304 3.805 4.594 5.68 1.271 4.388 L 0.685 4.16 C 0.181 3.964 -0.232 4.594 0.148 4.978 L 9.335 14.243 L 9.335 0 L 9.236 0.363 Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg
      width="10"
      height="15"
      viewBox="0 0 9.335 14.243"
      style={{ position: "absolute", right: -8, bottom: 12, color: kleur }}
      aria-hidden="true"
    >
      <path
        d="M 0.099 0.363 C 1.031 3.805 4.741 5.68 8.064 4.388 L 8.65 4.16 C 9.154 3.964 9.567 4.594 9.187 4.978 L 0 14.243 L 0 0 L 0.099 0.363 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatAvatar({ src, size = 56 }) {
  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--neutral-100)",
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid var(--white)",
        boxShadow: "0 0 0 1px var(--neutral-200)",
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

function ChatBubble({ bericht, isFirstInRun, isLastInRun, avatars, naam, palette }) {
  const isLinks = bericht.auteur !== "rechts";
  // Kleur van de bubble
  const bubbleKleur = isLinks
    ? (palette.bg === "var(--bg-neutral)" ? "var(--white)" : "var(--neutral-50)")
    : "#DEF2F1"; // teal-50 / branded light bubble
  const textKleur = "var(--ink)";
  const subtitleKleur = "var(--ink)";
  const tailKleur = bubbleKleur;
  const avatarSrc = bericht.avatarSrc || (isLinks ? avatars.links : avatars.rechts);

  // Radius: anker-hoek op de tail-kant is 0
  const radius = isLinks
    ? "8px 8px 8px 0px"
    : "8px 8px 0px 8px";

  const bubble = (
    <div
      style={{
        position: "relative",
        maxWidth: 488,
        minWidth: 0,
        borderRadius: radius,
        background: bubbleKleur,
        padding: "8px 16px",
        color: textKleur,
      }}
    >
      {isLastInRun && <BubbleTail kleur={tailKleur} links={isLinks} />}
      {isFirstInRun && naam && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 12,
            lineHeight: "16px",
            letterSpacing: "0.02em",
            color: "var(--ink-muted, #6B7280)",
            marginBottom: 4,
            textAlign: isLinks ? "left" : "right",
          }}
        >
          {naam}
        </div>
      )}
      {bericht.titel && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            color: subtitleKleur,
          }}
        >
          {bericht.titel}
        </div>
      )}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          color: textKleur,
          textWrap: "pretty",
        }}
      >
        {bericht.tekst}
      </div>
    </div>
  );

  const avatarSlot = (
    <div style={{ width: 56, display: "flex", justifyContent: "center", flexShrink: 0 }}>
      {isLastInRun && <ChatAvatar src={avatarSrc} />}
    </div>
  );

  // Spacing tussen opeenvolgende bubbles van dezelfde spreker is kleiner
  const marginTop = isFirstInRun ? 16 : 4;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isLinks ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 16,
        marginTop,
      }}
    >
      {avatarSlot}
      {bubble}
    </div>
  );
}

function Chat({
  achtergrond = "standaard",
  onderSpacing = true,
  titel,
  berichten = [
    { auteur: "rechts", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
    { auteur: "rechts", titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
    { auteur: "links",  titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
    { auteur: "links",  titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
  ],
  avatars = CHAT_DEFAULTS.avatars,
  personen = [],
}) {
  // Bereken voor elk bericht of het first/last-in-run is van dezelfde auteur.
  const flags = berichten.map((m, i) => {
    const prev = berichten[i - 1];
    const next = berichten[i + 1];
    return {
      isFirstInRun: !prev || prev.auteur !== m.auteur,
      isLastInRun: !next || next.auteur !== m.auteur,
    };
  });

  // Lookup naam by positie ("links"/"rechts") — undefined als niet gevonden,
  // dan rendert ChatBubble geen naam-regel.
  const naamFor = (positie) => {
    const match = personen.find((p) => p && p.positie === positie);
    return match ? match.naam : undefined;
  };

  return (
    <BlockFrame achtergrond={achtergrond} onderSpacing={onderSpacing} contentMaxWidth={800}>
      {(p) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {titel && (
            <h3
              style={{
                margin: "0 0 24px 0",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                lineHeight: "32px",
                letterSpacing: "-0.01em",
                color: p.title,
              }}
            >
              {titel}
            </h3>
          )}
          {berichten.map((b, i) => (
            <ChatBubble
              key={i}
              bericht={b}
              isFirstInRun={flags[i].isFirstInRun}
              isLastInRun={flags[i].isLastInRun}
              avatars={avatars}
              naam={naamFor(b.auteur === "rechts" ? "rechts" : "links")}
              palette={p}
            />
          ))}
        </div>
      )}
    </BlockFrame>
  );
}

window.Chat = Chat;
