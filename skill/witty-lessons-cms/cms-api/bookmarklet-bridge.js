// Witty CMS bookmarklet — bridge logic.
//
// This file is concatenated AFTER builders.js by build-bookmarklet.sh, then
// wrapped in an async IIFE and URL-encoded into a `javascript:` URL the user
// drags into their bookmarks bar. `BUILDERS`, `validateBlocks`, and helpers
// from builders.js are in scope here.
//
// Flow:
//   1. user designs a lesson in claude.ai (artifact)
//   2. clicks "Exporteer voor CMS" → JSON blocks copied to clipboard
//   3. switches to LCMS tab on the target lesson
//   4. clicks this bookmarklet
//   5. bookmarklet reads clipboard, builds DTOs, saves via Apollo

function __wittyToast(msg, color) {
  const t = document.createElement('div');
  t.style.cssText =
    'position:fixed;top:20px;right:20px;z-index:2147483647;' +
    'background:' + (color || '#222') + ';color:#fff;padding:14px 22px;' +
    'border-radius:8px;font-family:system-ui,-apple-system,sans-serif;' +
    'font-size:14px;font-weight:500;box-shadow:0 4px 16px rgba(0,0,0,0.2);' +
    'max-width:520px;line-height:1.4;white-space:pre-line;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 7000);
  return t;
}

// Safety: only run on LCMS tabs.
if (!location.hostname.startsWith('lcms.witty.')) {
  __wittyToast('Niet op een LCMS-tab. Open eerst de building-blocks pagina.', '#c0392b');
  return;
}

const __apollo = window.__APOLLO_CLIENT__;
if (!__apollo) {
  __wittyToast('Apollo client niet gevonden. Wacht tot de pagina volledig geladen is en probeer opnieuw.', '#c0392b');
  return;
}

// Read clipboard payload.
let __payload;
try {
  const text = await navigator.clipboard.readText();
  __payload = JSON.parse(text);
} catch (e) {
  __wittyToast('Kon clipboard niet lezen of parseren als JSON.\n' + (e.message || e), '#c0392b');
  return;
}

if (!__payload || !Array.isArray(__payload.blocks)) {
  __wittyToast('Clipboard bevat geen geldig {blocks: [...]} object.', '#c0392b');
  return;
}

// Pull existing context from Apollo cache.
const __cache = __apollo.cache.extract();
const __root = __cache.ROOT_QUERY || {};
const __key = Object.keys(__root).find(function (k) { return k.startsWith('getBuildingBlocks('); });
if (!__key) {
  __wittyToast('Geen lopende building-blocks query in cache. Refresh de pagina.', '#c0392b');
  return;
}
const __m = __key.match(/didacticToolId":"([^"]+)".+versionId":"([^"]+)"/);
if (!__m) {
  __wittyToast('Kon didacticToolId/versionId niet uit cache parsen.', '#c0392b');
  return;
}
const __didacticToolId = __m[1];
const __versionId = __m[2];

// Count existing blocks for the confirm prompt.
function __resolveRefs(val) {
  if (val == null) return val;
  if (Array.isArray(val)) return val.map(__resolveRefs);
  if (typeof val === 'object') {
    if (val.__ref) return __resolveRefs(__cache[val.__ref]);
    const out = {};
    for (const k in val) out[k] = __resolveRefs(val[k]);
    return out;
  }
  return val;
}
const __existing = __resolveRefs(__root[__key].buildingBlocks) || [];

// Confirm before overwrite.
const __ok = confirm(
  'Witty CMS-import\n\n' +
  '→ ' + __payload.blocks.length + ' nieuwe blokken vervangen ' + __existing.length + ' bestaande blokken.\n\n' +
  'Doorgaan? (afbeeldingen handmatig uploaden na save)'
);
if (!__ok) {
  __wittyToast('Geannuleerd.', '#7f8c8d');
  return;
}

// Build DTOs via the BUILDERS table from builders.js.
let __buildingBlocks;
try {
  __buildingBlocks = __payload.blocks.map(function (b, i) {
    const fn = BUILDERS[b.kind];
    if (!fn) throw new Error('block[' + i + ']: onbekend kind \'' + b.kind + '\'');
    return fn(b, i);
  });
} catch (e) {
  __wittyToast('Build-fout: ' + (e.message || e), '#c0392b');
  return;
}

// GraphQL DocumentNode (manually built — same shape as save-les.js).
const __doc = {
  kind: 'Document',
  definitions: [{
    kind: 'OperationDefinition', operation: 'mutation',
    name: { kind: 'Name', value: 'UpdateBuildingBlocksForDidacticTool' },
    variableDefinitions: [{
      kind: 'VariableDefinition',
      variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
      type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateBuildingBlocksForDidacticToolInput' } } },
    }],
    selectionSet: { kind: 'SelectionSet', selections: [{
      kind: 'Field', name: { kind: 'Name', value: 'updateBuildingBlocksForDidacticTool' },
      arguments: [{ kind: 'Argument', name: { kind: 'Name', value: 'input' }, value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } } }],
      selectionSet: { kind: 'SelectionSet', selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }] },
    }]},
  }],
};

// Save via Apollo.mutate (bypasses extension-wrapped fetch).
const __t0 = Date.now();
try {
  await __apollo.mutate({
    mutation: __doc,
    variables: { input: { didacticToolId: __didacticToolId, versionId: __versionId, audience: null, buildingBlocks: __buildingBlocks } },
    fetchPolicy: 'no-cache',
  });
  const __ms = Date.now() - __t0;
  __wittyToast(
    '✓ ' + __buildingBlocks.length + ' blokken opgeslagen in ' + __ms + 'ms.\n' +
    'Refresh de pagina om de nieuwe les te zien. Upload daarna eventuele afbeeldingen handmatig.',
    '#27ae60'
  );
} catch (e) {
  const __errs = (e && e.graphQLErrors) ? JSON.stringify(e.graphQLErrors).slice(0, 400) : '';
  __wittyToast('✗ Save faalde: ' + (e.message || e) + '\n' + __errs, '#c0392b');
}
