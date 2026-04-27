// app-claudeai-glue.js — runtime glue voor het claude.ai-artifact.
//
// Bevat twee event-handlers die voorheen inline in elk artifact werden
// gegenereerd. Door ze hier te hosten kan claude.ai de skeleton-code niet
// meer gedeeltelijk weglaten — er is nog maar één scriptregel om te missen.
//
//   1) #tweaks-toggle   — schakelt tweaks-on class via parent-postMessage
//   2) #cms-export      — strip + remap TWEAK_DEFAULTS.blocks → CMS-shape,
//                         schrijft naar clipboard, met modal-fallback voor
//                         iframes waar Permissions-Policy clipboard blokkeert.
//
// Dit bestand staat NIET in een IIFE; het opereert direct op de DOM en hoeft
// geen lokale scope. Loadt na app-main.js zodat alle elementen bestaan.

(function () {
  // ── #tweaks-toggle ─────────────────────────────────────────────────────
  var toggleBtn = document.getElementById("tweaks-toggle");
  if (toggleBtn) {
    function syncToggle() {
      var on = document.body.classList.contains("tweaks-on");
      toggleBtn.setAttribute("aria-pressed", String(on));
      toggleBtn.textContent = on ? "Tweaks uit" : "Tweaks aan";
    }
    toggleBtn.addEventListener("click", function () {
      var on = document.body.classList.contains("tweaks-on");
      window.postMessage({ type: on ? "__deactivate_edit_mode" : "__activate_edit_mode" }, "*");
    });
    new MutationObserver(syncToggle).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    syncToggle();
  }

  // ── #cms-export ────────────────────────────────────────────────────────
  // Strip artifact-only data + runtime URIs, copy clean blocks JSON to
  // clipboard. The Witty CMS bookmarklet picks it up on the LCMS-tab.
  var exportBtn = document.getElementById("cms-export");
  if (!exportBtn) return;

  // Replace data:/blob: URIs with null (CMS expects assetId UUIDs;
  // user uploads images manually after import).
  function cleanValue(v) {
    if (typeof v === "string") {
      if (v.startsWith("data:") || v.startsWith("blob:") || v.indexOf("claudeusercontent.com") !== -1) return null;
      return v;
    }
    if (Array.isArray(v)) return v.map(cleanValue);
    if (v && typeof v === "object") {
      var out = {};
      for (var k in v) out[k] = cleanValue(v[k]);
      return out;
    }
    return v;
  }

  // Strip artifact-only top-level fields (id/naam are display-only hooks
  // for the tweaks panel). Critically: only at TOP level — nested naam
  // fields (personen[i].naam) stay intact.
  function stripValue(v) {
    var cleaned = cleanValue(v);
    if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned)) {
      delete cleaned.id;
      delete cleaned.naam;
    }
    return cleaned;
  }

  // Per-kind remap from artifact-shape to CMS-builder-shape.
  function remapBlock(b) {
    var s = stripValue(b);
    if (s.kind === "external-link") {
      return {
        kind: "link",
        achtergrond: s.achtergrond,
        titel: s.titel,
        instructie: s.body,
        url: s.href,
        linkLabel: s.linkTekst,
      };
    }
    if (s.kind === "media-carousel") {
      return null;  // skipped — CMS Media is single-asset, not a carousel
    }
    if (s.kind === "chat") {
      // Build map auteur ("links"/"rechts") → persoonIndex.
      var seen = {};
      var personen = [];
      if (Array.isArray(s.personen) && s.personen.length) {
        s.personen.forEach(function (p, i) {
          personen.push({ naam: p.naam || ("Persoon " + (i + 1)), positie: p.positie });
          if (p.positie) seen[p.positie] = i;
        });
      }
      (s.berichten || []).forEach(function (m) {
        if (m.auteur && !(m.auteur in seen)) {
          seen[m.auteur] = personen.length;
          personen.push({ naam: "Persoon " + (personen.length + 1), positie: m.auteur });
        }
      });
      return {
        kind: "chat",
        achtergrond: s.achtergrond,
        personen: personen,
        berichten: (s.berichten || []).map(function (m) {
          var idx = (typeof m.persoonIndex === "number")
            ? m.persoonIndex
            : (m.auteur in seen ? seen[m.auteur] : 0);
          return { tekst: m.tekst, titel: m.titel, persoonIndex: idx };
        }),
      };
    }
    return s;
  }

  // Modal-dialog fallback when navigator.clipboard is blocked by
  // Permissions-Policy (claude.ai artifact iframes do this).
  function showExportDialog(payload, summary) {
    var existing = document.getElementById("cms-export-dialog");
    if (existing) existing.remove();

    var backdrop = document.createElement("div");
    backdrop.id = "cms-export-dialog";
    backdrop.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:rgba(16,24,40,0.5);" +
      "display:flex;align-items:center;justify-content:center;padding:24px;" +
      "font-family:var(--font-body),system-ui,sans-serif;";

    var card = document.createElement("div");
    card.style.cssText =
      "background:#fff;border-radius:12px;padding:20px;max-width:680px;width:100%;" +
      "max-height:80vh;display:flex;flex-direction:column;gap:12px;" +
      "box-shadow:0 20px 60px rgba(16,24,40,0.3);";

    var title = document.createElement("h3");
    title.textContent = "Exporteer voor CMS";
    title.style.cssText = "margin:0;font-size:18px;font-weight:700;color:var(--ink);";

    var info = document.createElement("p");
    info.textContent = summary + " — selecteer alles en kopieer (Cmd+A, Cmd+C), plak daarna in de LCMS-tab via de Witty-bookmarklet.";
    info.style.cssText = "margin:0;font-size:13px;color:var(--ink-muted,#6B7280);line-height:1.5;";

    var ta = document.createElement("textarea");
    ta.value = payload;
    ta.readOnly = true;
    ta.style.cssText =
      "flex:1;min-height:300px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;" +
      "font-size:12px;border:1px solid var(--neutral-200,#E5E7EB);border-radius:8px;" +
      "padding:12px;resize:vertical;width:100%;box-sizing:border-box;color:var(--ink);";

    var actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:8px;justify-content:flex-end;";

    var copyBtn = document.createElement("button");
    copyBtn.textContent = "Selecteer alles";
    copyBtn.style.cssText =
      "padding:8px 14px;border-radius:6px;border:1px solid var(--neutral-200,#E5E7EB);" +
      "background:#fff;color:var(--ink);font-weight:600;font-size:13px;cursor:pointer;";
    copyBtn.onclick = function () {
      ta.focus();
      ta.select();
      try {
        var ok = document.execCommand && document.execCommand("copy");
        if (ok) {
          copyBtn.textContent = "✓ Gekopieerd";
          copyBtn.style.background = "var(--teal-600,#0D9488)";
          copyBtn.style.color = "#fff";
          copyBtn.style.borderColor = "var(--teal-600,#0D9488)";
        } else {
          copyBtn.textContent = "Selectie klaar — Cmd+C";
        }
      } catch (e) {
        copyBtn.textContent = "Selectie klaar — Cmd+C";
      }
    };

    var closeBtn = document.createElement("button");
    closeBtn.textContent = "Sluiten";
    closeBtn.style.cssText =
      "padding:8px 14px;border-radius:6px;border:none;" +
      "background:var(--ink,#1F2937);color:#fff;font-weight:600;font-size:13px;cursor:pointer;";
    closeBtn.onclick = function () { backdrop.remove(); };

    actions.appendChild(copyBtn);
    actions.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(ta);
    card.appendChild(actions);
    backdrop.appendChild(card);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) backdrop.remove();
    });
    document.body.appendChild(backdrop);

    setTimeout(function () { ta.focus(); ta.select(); }, 50);
  }

  exportBtn.addEventListener("click", async function () {
    var origText = exportBtn.textContent;
    var payload, summary, mapped, skipped;
    try {
      var blocks = (window.TWEAK_DEFAULTS && window.TWEAK_DEFAULTS.blocks) || [];
      skipped = 0;
      mapped = blocks.map(remapBlock).filter(function (b) {
        if (b === null) { skipped++; return false; }
        return true;
      });
      payload = JSON.stringify({ blocks: mapped }, null, 2);
      summary = mapped.length + " blokken klaar" + (skipped ? " (" + skipped + " overgeslagen)" : "");
    } catch (e) {
      exportBtn.classList.add("cms-export--err");
      exportBtn.textContent = "✗ " + (e.message || "Fout");
      setTimeout(function () { exportBtn.classList.remove("cms-export--err"); exportBtn.textContent = origText; }, 3000);
      return;
    }

    // Try modern Clipboard API first; fall back to dialog if blocked.
    var copiedDirectly = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(payload);
        copiedDirectly = true;
      } catch (e) {
        // Permission denied or policy blocked — fall through to dialog.
      }
    }

    if (copiedDirectly) {
      exportBtn.classList.add("cms-export--ok");
      exportBtn.textContent = "✓ " + summary + " — gekopieerd";
      setTimeout(function () { exportBtn.classList.remove("cms-export--ok"); exportBtn.textContent = origText; }, 2500);
    } else {
      showExportDialog(payload, summary);
    }
  });
})();
