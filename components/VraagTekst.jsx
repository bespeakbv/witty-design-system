// VraagTekst.jsx — Vraag met tekst-antwoorden (single of multi)
// Toont 4 witte pil-kaarten met radio/checkbox + tekst.
// Bij feedback-state: correcte opties krijgen groene rand + "Juiste antwoord" badge.
//
// Layout: "alleen-tekst" (default) | "media-links" | "media-rechts"
// Bij media-layouts wordt de rechter/linker helft gevuld met een afbeelding of video.

function VraagTekst({
  achtergrond = "standaard",
  eyebrow = "Vraag 3 of kop titel",
  intro = "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  titel = "Vestibulum placerat ipsum vel malesuada vehicula.",
  instructie = "Instructie",
  multi = false,
  opties = [
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: true },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false },
    { tekst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false },
  ],
  toonFeedback = false,
  layout = "alleen-tekst",
  mediaType = "afbeelding",
  mediaSrc,
  toonPlayknop = true,
}) {
  const [picked, setPicked] = React.useState(() => new Set());

  const toggle = (i) => {
    const next = new Set(picked);
    if (multi) {
      if (next.has(i)) next.delete(i); else next.add(i);
    } else {
      next.clear();
      next.add(i);
    }
    setPicked(next);
  };

  const hasPick = picked.size > 0;

  return (
    <VraagShell
      achtergrond={achtergrond}
      eyebrow={eyebrow}
      intro={intro}
      titel={titel}
      instructie={instructie}
      layout={layout}
      mediaType={mediaType}
      mediaSrc={mediaSrc}
      toonPlayknop={toonPlayknop}
    >
      {opties.map((opt, i) => {
        const sel = picked.has(i);
        const showCorrect = toonFeedback && opt.correct;
        return (
          <OptionCard
            key={i}
            selected={sel}
            correct={showCorrect}
            onClick={() => toggle(i)}
          >
            {multi ? <CheckBox selected={sel} correct={showCorrect} /> : <RadioDot selected={sel} correct={showCorrect} />}
            <span style={{ flex: 1 }}>{opt.tekst}</span>
            {showCorrect && <CorrectBadge />}
          </OptionCard>
        );
      })}
      <FeedbackButton label="Controleer" enabled={hasPick} />
    </VraagShell>
  );
}

window.VraagTekst = VraagTekst;