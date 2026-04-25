(function () {
const CHAT_DEFAULTS = {
  avatars: {
    links: "assets/avatar-annemarie.jpg",
    rechts: "assets/avatar-michel.jpg"
  }
};
function BubbleTail({ kleur, links }) {
  if (links) {
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "10",
        height: "15",
        viewBox: "0 0 9.335 14.243",
        style: { position: "absolute", left: -8, bottom: 12, color: kleur },
        "aria-hidden": "true"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M 9.236 0.363 C 8.304 3.805 4.594 5.68 1.271 4.388 L 0.685 4.16 C 0.181 3.964 -0.232 4.594 0.148 4.978 L 9.335 14.243 L 9.335 0 L 9.236 0.363 Z",
          fill: "currentColor"
        }
      )
    );
  }
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: "10",
      height: "15",
      viewBox: "0 0 9.335 14.243",
      style: { position: "absolute", right: -8, bottom: 12, color: kleur },
      "aria-hidden": "true"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M 0.099 0.363 C 1.031 3.805 4.741 5.68 8.064 4.388 L 8.65 4.16 C 9.154 3.964 9.567 4.594 9.187 4.978 L 0 14.243 L 0 0 L 0.099 0.363 Z",
        fill: "currentColor"
      }
    )
  );
}
function ChatAvatar({ src, size = 56 }) {
  if (!src) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--neutral-100)",
          flexShrink: 0
        },
        "aria-hidden": "true"
      }
    );
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid var(--white)",
        boxShadow: "0 0 0 1px var(--neutral-200)",
        flexShrink: 0
      }
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src,
        alt: "",
        style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
      }
    )
  );
}
function ChatBubble({ bericht, isFirstInRun, isLastInRun, avatars, palette }) {
  const isLinks = bericht.auteur !== "rechts";
  const bubbleKleur = isLinks ? palette.bg === "var(--bg-neutral)" ? "var(--white)" : "var(--neutral-50)" : "#DEF2F1";
  const textKleur = "var(--ink)";
  const subtitleKleur = "var(--ink)";
  const tailKleur = bubbleKleur;
  const avatarSrc = bericht.avatarSrc || (isLinks ? avatars.links : avatars.rechts);
  const radius = isLinks ? "8px 8px 8px 0px" : "8px 8px 0px 8px";
  const bubble = /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "relative",
        maxWidth: 488,
        minWidth: 0,
        borderRadius: radius,
        background: bubbleKleur,
        padding: "8px 16px",
        color: textKleur
      }
    },
    isLastInRun && /* @__PURE__ */ React.createElement(BubbleTail, { kleur: tailKleur, links: isLinks }),
    bericht.titel && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "24px",
          color: subtitleKleur
        }
      },
      bericht.titel
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          color: textKleur,
          textWrap: "pretty"
        }
      },
      bericht.tekst
    )
  );
  const avatarSlot = /* @__PURE__ */ React.createElement("div", { style: { width: 56, display: "flex", justifyContent: "center", flexShrink: 0 } }, isLastInRun && /* @__PURE__ */ React.createElement(ChatAvatar, { src: avatarSrc }));
  const marginTop = isFirstInRun ? 16 : 4;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: isLinks ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 16,
        marginTop
      }
    },
    avatarSlot,
    bubble
  );
}
function Chat({
  achtergrond = "standaard",
  onderSpacing = true,
  titel,
  berichten = [
    { auteur: "rechts", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
    { auteur: "rechts", titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
    { auteur: "links", titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." },
    { auteur: "links", titel: "Titel", tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor." }
  ],
  avatars = CHAT_DEFAULTS.avatars
}) {
  const flags = berichten.map((m, i) => {
    const prev = berichten[i - 1];
    const next = berichten[i + 1];
    return {
      isFirstInRun: !prev || prev.auteur !== m.auteur,
      isLastInRun: !next || next.auteur !== m.auteur
    };
  });
  return /* @__PURE__ */ React.createElement(BlockFrame, { achtergrond, onderSpacing, contentMaxWidth: 800 }, (p) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, titel && /* @__PURE__ */ React.createElement(
    "h3",
    {
      style: {
        margin: "0 0 24px 0",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 24,
        lineHeight: "32px",
        letterSpacing: "-0.01em",
        color: p.title
      }
    },
    titel
  ), berichten.map((b, i) => /* @__PURE__ */ React.createElement(
    ChatBubble,
    {
      key: i,
      bericht: b,
      isFirstInRun: flags[i].isFirstInRun,
      isLastInRun: flags[i].isLastInRun,
      avatars,
      palette: p
    }
  ))));
}
window.Chat = Chat;
})();
