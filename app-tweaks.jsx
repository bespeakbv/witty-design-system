// app-tweaks.jsx — TweaksPanel rendering per block kind.
// Relies on globals from app.jsx (Seg, Toggle, Field, VARIANTS, BACKGROUNDS, ...).

// ── Options editor (add/remove/edit + correct) ─────────────────────────
function OptiesEditor({ opties, onChange, showCorrect = true, showImage = false, optionLabel = "Opties" }) {
  const update = (i, patch) => {
    const next = opties.map((o, idx) => (idx === i ? { ...o, ...patch } : o));
    onChange(next);
  };
  const toggleCorrect = (i) => {
    const next = opties.map((o, idx) => (idx === i ? { ...o, correct: !o.correct } : o));
    onChange(next);
  };
  const add = () => {
    const base = { tekst: "Nieuwe optie" };
    if (showCorrect) base.correct = false;
    if (showImage) base.afbeelding = "assets/vraag-img-1.jpg";
    onChange([...opties, base]);
  };
  const remove = (i) => {
    onChange(opties.filter((_, idx) => idx !== i));
  };
  return (
    <Field label={optionLabel}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opties.map((o, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--neutral-200)",
              borderRadius: 6,
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              background: o.correct ? "var(--teal-50)" : "#fff",
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--neutral-500)", fontWeight: 700, flex: 1 }}>
                Optie {i + 1}
              </span>
              {showCorrect && (
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                  <input
                    type="checkbox"
                    checked={!!o.correct}
                    onChange={() => toggleCorrect(i)}
                    style={{ margin: 0 }}
                  />
                  Correct
                </label>
              )}
              <button
                onClick={() => remove(i)}
                disabled={opties.length <= 2}
                style={{
                  all: "unset",
                  cursor: opties.length <= 2 ? "not-allowed" : "pointer",
                  color: opties.length <= 2 ? "var(--neutral-300)" : "var(--neutral-500)",
                  fontSize: 14,
                  padding: "0 4px",
                  lineHeight: 1,
                }}
                aria-label="Verwijderen"
                title={opties.length <= 2 ? "Minimaal 2 opties" : "Verwijderen"}
              >×</button>
            </div>
            <input
              className="tw-text"
              value={o.tekst}
              onChange={(e) => update(i, { tekst: e.target.value })}
            />
            {showImage && (
              <Seg
                value={o.afbeelding}
                options={[
                  { v: "assets/vraag-img-1.jpg", label: "Img 1" },
                  { v: "assets/vraag-img-2.jpg", label: "Img 2" },
                ]}
                onChange={(v) => update(i, { afbeelding: v })}
              />
            )}
          </div>
        ))}
        <button
          onClick={add}
          style={{
            all: "unset",
            cursor: "pointer",
            textAlign: "center",
            padding: "6px 8px",
            border: "1px dashed var(--neutral-200)",
            borderRadius: 6,
            color: "var(--teal-700)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          + Optie toevoegen
        </button>
      </div>
    </Field>
  );
}

// ── Connect paren editor ───────────────────────────────────────────────
function ParenEditor({ paren, onChange, showImage }) {
  const update = (i, patch) => onChange(paren.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const add = () => onChange([...paren, { links: "Links", rechts: "Rechts", afbeelding: "assets/vraag-img-1.jpg" }]);
  const remove = (i) => onChange(paren.filter((_, idx) => idx !== i));
  return (
    <Field label="Paren (links → rechts)">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {paren.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--neutral-200)",
              borderRadius: 6,
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--neutral-500)", fontWeight: 700, flex: 1 }}>
                Paar {i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                disabled={paren.length <= 2}
                style={{
                  all: "unset",
                  cursor: paren.length <= 2 ? "not-allowed" : "pointer",
                  color: paren.length <= 2 ? "var(--neutral-300)" : "var(--neutral-500)",
                  fontSize: 14,
                  padding: "0 4px",
                }}
              >×</button>
            </div>
            <input
              className="tw-text"
              placeholder="Links"
              value={p.links}
              onChange={(e) => update(i, { links: e.target.value })}
            />
            <input
              className="tw-text"
              placeholder="Rechts"
              value={p.rechts}
              onChange={(e) => update(i, { rechts: e.target.value })}
            />
            {showImage && (
              <Seg
                value={p.afbeelding}
                options={[
                  { v: "assets/vraag-img-1.jpg", label: "Img 1" },
                  { v: "assets/vraag-img-2.jpg", label: "Img 2" },
                ]}
                onChange={(v) => update(i, { afbeelding: v })}
              />
            )}
          </div>
        ))}
        <button
          onClick={add}
          style={{
            all: "unset",
            cursor: "pointer",
            textAlign: "center",
            padding: "6px 8px",
            border: "1px dashed var(--neutral-200)",
            borderRadius: 6,
            color: "var(--teal-700)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          + Paar toevoegen
        </button>
      </div>
    </Field>
  );
}

// ── TekstBlok tweaks ───────────────────────────────────────────────────
function TekstBlokTweaks({ b, patch }) {
  return (
    <>
      <Field label="Variant">
        <Seg value={b.variant} options={VARIANTS} onChange={(v) => patch({ variant: v })} />
      </Field>
      <Field label="Achtergrond">
        <Seg value={b.achtergrond} options={BACKGROUNDS} onChange={(v) => patch({ achtergrond: v })} />
      </Field>
      <Toggle
        label="Spacing onderzijde"
        checked={b.onderSpacing}
        onChange={(v) => patch({ onderSpacing: v })}
      />
      {(b.variant === "media-links" || b.variant === "media-rechts") && (
        <>
          <Field label="Media type">
            <Seg value={b.mediaType} options={MEDIA_TYPES} onChange={(v) => patch({ mediaType: v })} />
          </Field>
          <Field label="Media afmetingen">
            <Seg value={b.mediaDimensions} options={MEDIA_DIMS} onChange={(v) => patch({ mediaDimensions: v })} />
          </Field>
          {b.mediaType === "video" && (
            <Toggle
              label="Toon playknop"
              checked={b.toonPlayknop}
              onChange={(v) => patch({ toonPlayknop: v })}
            />
          )}
        </>
      )}
      <Toggle label="Toon titel"    checked={b.toonTitel}    onChange={(v) => patch({ toonTitel: v })} />
      <Toggle label="Toon subtitel" checked={b.toonSubtitel} onChange={(v) => patch({ toonSubtitel: v })} />
      <Field label="Titel">
        <input className="tw-text" value={b.titel} onChange={(e) => patch({ titel: e.target.value })} />
      </Field>
      <Field label="Subtitel">
        <input className="tw-text" value={b.subtitel} onChange={(e) => patch({ subtitel: e.target.value })} />
      </Field>
      <Field label="Body">
        <textarea className="tw-text" value={b.body} onChange={(e) => patch({ body: e.target.value })} />
      </Field>
      {b.variant === "twee-kolommen" && (
        <Field label="Body kolom 2">
          <textarea className="tw-text" value={b.body2} onChange={(e) => patch({ body2: e.target.value })} />
        </Field>
      )}
    </>
  );
}

// ── Gedeelde vraag-header tweaks ──────────────────────────────────────
function VraagHeaderTweaks({ b, patch }) {
  return (
    <>
      <Field label="Achtergrond">
        <Seg value={b.achtergrond} options={BACKGROUNDS} onChange={(v) => patch({ achtergrond: v })} />
      </Field>
      <Field label="Eyebrow (vraag-nummer)">
        <input className="tw-text" value={b.eyebrow || ""} onChange={(e) => patch({ eyebrow: e.target.value })} />
      </Field>
      <Field label="Intro">
        <textarea className="tw-text" value={b.intro || ""} onChange={(e) => patch({ intro: e.target.value })} />
      </Field>
      <Field label="Vraag (titel)">
        <input className="tw-text" value={b.titel || ""} onChange={(e) => patch({ titel: e.target.value })} />
      </Field>
      <Field label="Instructie">
        <input className="tw-text" value={b.instructie || ""} onChange={(e) => patch({ instructie: e.target.value })} />
      </Field>
      <Toggle
        label="Toon feedback-state (juist / onjuist visualisatie)"
        checked={!!b.toonFeedback}
        onChange={(v) => patch({ toonFeedback: v })}
      />
    </>
  );
}

// ── VraagTekst / VraagAfb / Poll / Stelling / Volgorde / Connect tweaks ─
function VraagTekstTweaks({ b, patch }) {
  const layout = b.layout || "alleen-tekst";
  const isMedia = layout === "media-links" || layout === "media-rechts";
  return (
    <>
      <VraagHeaderTweaks b={b} patch={patch} />
      <Field label="Layout">
        <Seg value={layout} options={VRAAG_TEKST_LAYOUTS} onChange={(v) => patch({ layout: v })} />
      </Field>
      {isMedia && (
        <Field label="Mediatype">
          <Seg
            value={b.mediaType || "afbeelding"}
            options={MEDIA_TYPES}
            onChange={(v) => patch({ mediaType: v })}
          />
        </Field>
      )}
      {isMedia && (b.mediaType || "afbeelding") === "video" && (
        <Toggle
          label="Toon play-knop"
          checked={b.toonPlayknop !== false}
          onChange={(v) => patch({ toonPlayknop: v })}
        />
      )}
      <Field label="Selectie-modus">
        <Seg value={!!b.multi} options={MULTI_MODES} onChange={(v) => patch({ multi: v })} />
      </Field>
      <OptiesEditor opties={b.opties} onChange={(o) => patch({ opties: o })} showCorrect />
    </>
  );
}
function VraagAfbTweaks({ b, patch }) {
  return (
    <>
      <VraagHeaderTweaks b={b} patch={patch} />
      <Field label="Selectie-modus">
        <Seg value={!!b.multi} options={MULTI_MODES} onChange={(v) => patch({ multi: v })} />
      </Field>
      <OptiesEditor opties={b.opties} onChange={(o) => patch({ opties: o })} showCorrect showImage />
    </>
  );
}
function PollTweaks({ b, patch }) {
  return (
    <>
      <VraagHeaderTweaks b={b} patch={patch} />
      <Field label="Selectie-modus">
        <Seg value={!!b.multi} options={MULTI_MODES} onChange={(v) => patch({ multi: v })} />
      </Field>
      <OptiesEditor
        opties={b.opties}
        onChange={(o) => patch({ opties: o })}
        showCorrect={false}
        optionLabel="Opties (met stemmen)"
      />
    </>
  );
}
function StellingTweaks({ b, patch }) {
  return (
    <>
      <VraagHeaderTweaks b={b} patch={patch} />
      <Field label="Juiste antwoord">
        <Seg value={!!b.juistIsJuist} options={STELLING_CORRECT} onChange={(v) => patch({ juistIsJuist: v })} />
      </Field>
    </>
  );
}
function VolgordeTweaks({ b, patch }) {
  return (
    <>
      <VraagHeaderTweaks b={b} patch={patch} />
      <OptiesEditor
        opties={b.opties}
        onChange={(o) => patch({ opties: o })}
        showCorrect={false}
        optionLabel="Opties (in juiste volgorde)"
      />
    </>
  );
}
function ConnectTweaks({ b, patch }) {
  return (
    <>
      <VraagHeaderTweaks b={b} patch={patch} />
      <Field label="Type">
        <Seg value={!!b.metAfbeelding} options={CONNECT_MODES} onChange={(v) => patch({ metAfbeelding: v })} />
      </Field>
      <ParenEditor paren={b.paren} onChange={(p) => patch({ paren: p })} showImage={!!b.metAfbeelding} />
    </>
  );
}

// ── Nieuwe content-types: Quote / ExternalLink / MediaCarousel / Chat / Hotspot / Stepper ──

function BaseBlockTweaks({ b, patch }) {
  return (
    <>
      <Field label="Achtergrond">
        <Seg value={b.achtergrond} options={BACKGROUNDS} onChange={(v) => patch({ achtergrond: v })} />
      </Field>
      <Toggle label="Onder-spacing" checked={b.onderSpacing !== false} onChange={(v) => patch({ onderSpacing: v })} />
    </>
  );
}

function QuoteTweaks({ b, patch }) {
  return (
    <>
      <BaseBlockTweaks b={b} patch={patch} />
      <Toggle label="Toon avatar" checked={b.toonAvatar !== false} onChange={(v) => patch({ toonAvatar: v })} />
      <Field label="Avatar positie">
        <Seg value={b.avatarPositie || "rechts"} options={AVATAR_POSITIES} onChange={(v) => patch({ avatarPositie: v })} />
      </Field>
      <Toggle label="Aanhalingstekens om quote" checked={!!b.metQuotes} onChange={(v) => patch({ metQuotes: v })} />
      <Field label="Quote">
        <textarea className="tw-text" value={b.tekst || ""} onChange={(e) => patch({ tekst: e.target.value })} />
      </Field>
      <Field label="Auteur">
        <input className="tw-text" value={b.auteur || ""} onChange={(e) => patch({ auteur: e.target.value })} />
      </Field>
      <Field label="Avatar URL">
        <input className="tw-text" value={b.avatarSrc || ""} onChange={(e) => patch({ avatarSrc: e.target.value })} />
      </Field>
    </>
  );
}

function ExternalLinkTweaks({ b, patch }) {
  return (
    <>
      <BaseBlockTweaks b={b} patch={patch} />
      <Field label="Type">
        <Seg value={b.type || "link"} options={EXTERNAL_LINK_TYPES} onChange={(v) => patch({ type: v })} />
      </Field>
      <Toggle label="Toon afbeelding" checked={b.toonAfbeelding !== false} onChange={(v) => patch({ toonAfbeelding: v })} />
      <Field label="Titel">
        <input className="tw-text" value={b.titel || ""} onChange={(e) => patch({ titel: e.target.value })} />
      </Field>
      <Field label="Body">
        <textarea className="tw-text" value={b.body || ""} onChange={(e) => patch({ body: e.target.value })} />
      </Field>
      <Field label="Linktekst (leeg = standaard)">
        <input className="tw-text" value={b.linkTekst || ""} onChange={(e) => patch({ linkTekst: e.target.value })} />
      </Field>
      <Field label="URL">
        <input className="tw-text" value={b.href || ""} onChange={(e) => patch({ href: e.target.value })} />
      </Field>
      <Field label="Afbeelding URL">
        <input className="tw-text" value={b.afbeelding || ""} onChange={(e) => patch({ afbeelding: e.target.value })} />
      </Field>
    </>
  );
}

function MediaItemsEditor({ items, onChange }) {
  const update = (i, p) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...p } : it)));
  const add = () => onChange([...items, { src: "assets/media-carousel.jpg", soort: "afbeelding", alt: "Nieuwe slide" }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <Field label="Media items">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ border: "1px solid var(--neutral-200)", borderRadius: 6, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--neutral-500)", fontWeight: 700, flex: 1 }}>Item {i + 1}</span>
              <button onClick={() => remove(i)} disabled={items.length <= 1}
                style={{ all: "unset", cursor: items.length <= 1 ? "not-allowed" : "pointer", color: "var(--neutral-500)", fontSize: 11 }}>
                Verwijder
              </button>
            </div>
            <Seg value={it.soort || "afbeelding"} options={MEDIA_ITEM_SOORT} onChange={(v) => update(i, { soort: v })} />
            <input className="tw-text" placeholder="URL" value={it.src || ""} onChange={(e) => update(i, { src: e.target.value })} />
            <input className="tw-text" placeholder="Alt-tekst" value={it.alt || ""} onChange={(e) => update(i, { alt: e.target.value })} />
          </div>
        ))}
        <button onClick={add}
          style={{ all: "unset", cursor: "pointer", textAlign: "center", padding: "6px 8px",
                   border: "1px dashed var(--neutral-200)", borderRadius: 6, fontSize: 11, color: "var(--ink-muted)" }}>
          + Item toevoegen
        </button>
      </div>
    </Field>
  );
}

function MediaCarouselTweaks({ b, patch }) {
  return (
    <>
      <BaseBlockTweaks b={b} patch={patch} />
      <Field label="Media afmetingen">
        <Seg value={b.mediaDimensions || "boxed"} options={MEDIA_DIMS} onChange={(v) => patch({ mediaDimensions: v })} />
      </Field>
      <Toggle label="Toon play-knop (op video)" checked={b.toonPlayknop !== false} onChange={(v) => patch({ toonPlayknop: v })} />
      <MediaItemsEditor items={b.items || []} onChange={(items) => patch({ items })} />
    </>
  );
}

function BerichtenEditor({ berichten, onChange }) {
  const update = (i, p) => onChange(berichten.map((m, idx) => (idx === i ? { ...m, ...p } : m)));
  const add = () => onChange([...berichten, { auteur: "rechts", tekst: "Nieuw bericht." }]);
  const remove = (i) => onChange(berichten.filter((_, idx) => idx !== i));
  return (
    <Field label="Berichten">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {berichten.map((m, i) => (
          <div key={i} style={{ border: "1px solid var(--neutral-200)", borderRadius: 6, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--neutral-500)", fontWeight: 700, flex: 1 }}>Bericht {i + 1}</span>
              <button onClick={() => remove(i)} disabled={berichten.length <= 1}
                style={{ all: "unset", cursor: berichten.length <= 1 ? "not-allowed" : "pointer", color: "var(--neutral-500)", fontSize: 11 }}>
                Verwijder
              </button>
            </div>
            <Seg value={m.auteur || "rechts"} options={CHAT_AUTEUR} onChange={(v) => update(i, { auteur: v })} />
            <input className="tw-text" placeholder="Titel (optioneel)" value={m.titel || ""} onChange={(e) => update(i, { titel: e.target.value })} />
            <textarea className="tw-text" placeholder="Tekst" value={m.tekst || ""} onChange={(e) => update(i, { tekst: e.target.value })} />
          </div>
        ))}
        <button onClick={add}
          style={{ all: "unset", cursor: "pointer", textAlign: "center", padding: "6px 8px",
                   border: "1px dashed var(--neutral-200)", borderRadius: 6, fontSize: 11, color: "var(--ink-muted)" }}>
          + Bericht toevoegen
        </button>
      </div>
    </Field>
  );
}

function ChatTweaks({ b, patch }) {
  const avatars = b.avatars || { links: "assets/avatar-annemarie.jpg", rechts: "assets/avatar-michel.jpg" };
  return (
    <>
      <BaseBlockTweaks b={b} patch={patch} />
      <Field label="Blok titel (optioneel)">
        <input className="tw-text" value={b.titel || ""} onChange={(e) => patch({ titel: e.target.value })} />
      </Field>
      <Field label="Avatar links (URL)">
        <input className="tw-text" value={avatars.links || ""} onChange={(e) => patch({ avatars: { ...avatars, links: e.target.value } })} />
      </Field>
      <Field label="Avatar rechts (URL)">
        <input className="tw-text" value={avatars.rechts || ""} onChange={(e) => patch({ avatars: { ...avatars, rechts: e.target.value } })} />
      </Field>
      <BerichtenEditor berichten={b.berichten || []} onChange={(berichten) => patch({ berichten })} />
    </>
  );
}

function HotspotsEditor({ hotspots, onChange }) {
  const update = (i, p) => onChange(hotspots.map((h, idx) => (idx === i ? { ...h, ...p } : h)));
  const add = () => onChange([...hotspots, { x: 50, y: 50, titel: "Nieuwe hotspot", body: "Beschrijving." }]);
  const remove = (i) => onChange(hotspots.filter((_, idx) => idx !== i));
  return (
    <Field label="Hotspots (x/y in % van de afbeelding)">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {hotspots.map((h, i) => (
          <div key={i} style={{ border: "1px solid var(--neutral-200)", borderRadius: 6, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--neutral-500)", fontWeight: 700, flex: 1 }}>Hotspot {i + 1}</span>
              <button onClick={() => remove(i)} disabled={hotspots.length <= 1}
                style={{ all: "unset", cursor: hotspots.length <= 1 ? "not-allowed" : "pointer", color: "var(--neutral-500)", fontSize: 11 }}>
                Verwijder
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <input className="tw-text" type="number" min="0" max="100" placeholder="x %" value={h.x ?? 50}
                     onChange={(e) => update(i, { x: Number(e.target.value) })} />
              <input className="tw-text" type="number" min="0" max="100" placeholder="y %" value={h.y ?? 50}
                     onChange={(e) => update(i, { y: Number(e.target.value) })} />
            </div>
            <input className="tw-text" placeholder="Titel" value={h.titel || ""} onChange={(e) => update(i, { titel: e.target.value })} />
            <textarea className="tw-text" placeholder="Body" value={h.body || ""} onChange={(e) => update(i, { body: e.target.value })} />
          </div>
        ))}
        <button onClick={add}
          style={{ all: "unset", cursor: "pointer", textAlign: "center", padding: "6px 8px",
                   border: "1px dashed var(--neutral-200)", borderRadius: 6, fontSize: 11, color: "var(--ink-muted)" }}>
          + Hotspot toevoegen
        </button>
      </div>
    </Field>
  );
}

function HotspotTweaks({ b, patch }) {
  return (
    <>
      <BaseBlockTweaks b={b} patch={patch} />
      <Field label="Tekstkolom positie">
        <Seg value={b.textPositie || "links"} options={HOTSPOT_TEXT_POSITIES} onChange={(v) => patch({ textPositie: v })} />
      </Field>
      <Field label="Titel">
        <input className="tw-text" value={b.titel || ""} onChange={(e) => patch({ titel: e.target.value })} />
      </Field>
      <Field label="Body">
        <textarea className="tw-text" value={b.body || ""} onChange={(e) => patch({ body: e.target.value })} />
      </Field>
      <Field label="Afbeelding URL">
        <input className="tw-text" value={b.afbeelding || ""} onChange={(e) => patch({ afbeelding: e.target.value })} />
      </Field>
      <HotspotsEditor hotspots={b.hotspots || []} onChange={(hotspots) => patch({ hotspots })} />
    </>
  );
}

function StappenEditor({ stappen, onChange }) {
  const update = (i, p) => onChange(stappen.map((s, idx) => (idx === i ? { ...s, ...p } : s)));
  const add = () => onChange([...stappen, { titel: "Nieuwe stap", subtitel: "Subtitel", body: "Body." }]);
  const remove = (i) => onChange(stappen.filter((_, idx) => idx !== i));
  return (
    <Field label="Stappen">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stappen.map((s, i) => (
          <div key={i} style={{ border: "1px solid var(--neutral-200)", borderRadius: 6, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--neutral-500)", fontWeight: 700, flex: 1 }}>Stap {i + 1}</span>
              <button onClick={() => remove(i)} disabled={stappen.length <= 1}
                style={{ all: "unset", cursor: stappen.length <= 1 ? "not-allowed" : "pointer", color: "var(--neutral-500)", fontSize: 11 }}>
                Verwijder
              </button>
            </div>
            <input className="tw-text" placeholder="Titel" value={s.titel || ""} onChange={(e) => update(i, { titel: e.target.value })} />
            <input className="tw-text" placeholder="Subtitel" value={s.subtitel || ""} onChange={(e) => update(i, { subtitel: e.target.value })} />
            <textarea className="tw-text" placeholder="Body" value={s.body || ""} onChange={(e) => update(i, { body: e.target.value })} />
          </div>
        ))}
        <button onClick={add}
          style={{ all: "unset", cursor: "pointer", textAlign: "center", padding: "6px 8px",
                   border: "1px dashed var(--neutral-200)", borderRadius: 6, fontSize: 11, color: "var(--ink-muted)" }}>
          + Stap toevoegen
        </button>
      </div>
    </Field>
  );
}

function StepperTweaks({ b, patch }) {
  return (
    <>
      <BaseBlockTweaks b={b} patch={patch} />
      <Field label="Layout">
        <Seg value={b.layout || "twee-kolommen"} options={STEPPER_LAYOUTS} onChange={(v) => patch({ layout: v })} />
      </Field>
      <StappenEditor stappen={b.stappen || []} onChange={(stappen) => patch({ stappen })} />
    </>
  );
}

const KIND_TWEAKS = {
  "tekst":          TekstBlokTweaks,
  "quote":          QuoteTweaks,
  "external-link":  ExternalLinkTweaks,
  "media-carousel": MediaCarouselTweaks,
  "chat":           ChatTweaks,
  "hotspot":        HotspotTweaks,
  "stepper":        StepperTweaks,
  "vraag-tekst":    VraagTekstTweaks,
  "vraag-afb":      VraagAfbTweaks,
  "poll":           PollTweaks,
  "stelling":       StellingTweaks,
  "volgorde":       VolgordeTweaks,
  "connect":        ConnectTweaks,
};

Object.assign(window, { KIND_TWEAKS, OptiesEditor, ParenEditor });
