(function () {
function RadioDot({ selected = false, correct = false }) {
  const stroke = correct ? "#12B76A" : selected ? "#0F1012" : "#D0D5DD";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": true,
      style: {
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: `2px solid ${stroke}`,
        display: "grid",
        placeItems: "center",
        background: "#fff",
        flexShrink: 0
      }
    },
    selected && /* @__PURE__ */ React.createElement("div", { style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: correct ? "#12B76A" : "#0F1012"
    } })
  );
}
function CheckBox({ selected = false, correct = false }) {
  const stroke = correct ? "#12B76A" : selected ? "#0F1012" : "#D0D5DD";
  const fill = selected ? correct ? "#12B76A" : "#0F1012" : "transparent";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": true,
      style: {
        width: 20,
        height: 20,
        borderRadius: 4,
        border: `2px solid ${stroke}`,
        background: fill,
        display: "grid",
        placeItems: "center",
        flexShrink: 0
      }
    },
    selected && /* @__PURE__ */ React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M2.5 6L5 8.5L9.5 3.5", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))
  );
}
function OptionCard({
  children,
  selected = false,
  correct = false,
  radius,
  onClick,
  height = 56,
  padding = "16px 24px",
  stroke = "#D0D5DD",
  as = "button",
  extraStyle = {}
}) {
  const Tag = as;
  const brd = correct ? "#12B76A" : selected ? "#0F1012" : stroke;
  const r = radius != null ? radius : "var(--wt-radius)";
  return /* @__PURE__ */ React.createElement(
    Tag,
    {
      type: as === "button" ? "button" : void 0,
      onClick,
      style: {
        background: "#FFFFFF",
        border: `1px solid ${brd}`,
        borderRadius: r,
        padding,
        minHeight: height,
        display: "flex",
        alignItems: "center",
        gap: 16,
        font: "inherit",
        fontFamily: "var(--font-body)",
        fontSize: 16,
        lineHeight: "24px",
        color: "#0F1012",
        textAlign: "left",
        cursor: onClick ? "pointer" : "default",
        width: "100%",
        ...extraStyle
      }
    },
    children
  );
}
function CorrectBadge({ label = "Juiste antwoord" }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    border: "1px solid #12B76A",
    borderRadius: 999,
    color: "#027A48",
    background: "#ECFDF3",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 600,
    whiteSpace: "nowrap"
  } }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M5 12l5 5L20 7", stroke: "#12B76A", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" })), label);
}
function FeedbackButton({ label = "Controleer", enabled = false, onClick }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick,
      disabled: !enabled,
      style: {
        width: "100%",
        border: "none",
        background: enabled ? "#0F1012" : "#D0D5DD",
        color: enabled ? "#fff" : "#667085",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: 16,
        lineHeight: "24px",
        padding: "16px 24px",
        borderRadius: "var(--wt-radius)",
        cursor: enabled ? "pointer" : "not-allowed",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 8
      }
    },
    label,
    /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14M13 6l6 6-6 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))
  );
}
Object.assign(window, { RadioDot, CheckBox, OptionCard, CorrectBadge, FeedbackButton });
})();
