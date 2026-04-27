// Witty LCMS add-block runner — append/prepend a single block to an existing
// didactic-tool without re-specifying the whole lesson.
//
// Reads existing blocks from Apollo cache, inserts the new one at the requested
// position, renumbers `order`, and POSTs the same UpdateBuildingBlocksForDidacticTool
// mutation that save-les.js uses.
//
// Usage (inline, recommended):
//   dev-browser --connect <<EOF
//   const __INLINE_DUMMY_B64 = "...";
//   const __INLINE_BLOCK = { kind: "tekst", variant: "media-links", body: "..." };
//   const __INLINE_POSITION = "first";  // or "last", or a number 0…N
//   const __INLINE_LCMS_HOST_HINT = "witty.bespeak.nl";  // optional
//   $(cat builders.js)
//   $(cat add-block.js)
//   EOF

const TAB_URL_HINT = 'lcms.witty.';

// QuickJS sandbox URL has only `href` — parse hostname manually.
function hostnameFromUrl(url) {
  const m = String(url || '').match(/^https?:\/\/([^/?#]+)/i);
  return m ? m[1] : '';
}

function deriveGraphQLUrl(lcmsUrl) {
  const hostname = hostnameFromUrl(lcmsUrl);
  if (!hostname.startsWith('lcms.')) {
    throw new Error(`Unexpected LCMS host: ${hostname}`);
  }
  return `https://api.${hostname.slice('lcms.'.length)}/graphql`;
}

async function uploadAsset(args) {
  const { page, apiUrl, bytes, filename, mimeType } = args;
  const restUrl = apiUrl.replace(/\/graphql\/?$/, '/rest/assets');
  let b64;
  if (typeof bytes === 'string') {
    b64 = bytes;
  } else if (bytes && bytes.length !== undefined) {
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    b64 = btoa(s);
  } else {
    return null;
  }
  const result = await page.evaluate(async ({ url, b64, filename, mimeType }) => {
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const fd = new FormData();
    fd.append('file', new Blob([u8], { type: mimeType }), filename);
    const r = await fetch(url, { method: 'POST', credentials: 'include', body: fd });
    const text = await r.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) {}
    return { status: r.status, body: text.slice(0, 500), id: json?.id || null };
  }, { url: restUrl, b64, filename, mimeType });
  if (result.status >= 400 || !result.id) {
    console.warn(`[uploadAsset] failed: status=${result.status}, body=${result.body}`);
    return null;
  }
  return result.id;
}

function loadDummyAsset() {
  return (typeof __INLINE_DUMMY_B64 !== 'undefined' && __INLINE_DUMMY_B64) ? __INLINE_DUMMY_B64 : null;
}

// ---- main ----------------------------------------------------------------

let block, position, lcmsHostHint;
if (typeof __INLINE_BLOCK !== 'undefined' && __INLINE_BLOCK) {
  block = __INLINE_BLOCK;
  position = (typeof __INLINE_POSITION !== 'undefined') ? __INLINE_POSITION : 'last';
  lcmsHostHint = (typeof __INLINE_LCMS_HOST_HINT !== 'undefined') ? __INLINE_LCMS_HOST_HINT : null;
} else {
  const txt = await readFile('block.json');
  const parsed = JSON.parse(txt);
  block = parsed.block;
  position = parsed.position || 'last';
  lcmsHostHint = parsed.lcmsHostHint || null;
}

if (!block || !block.kind) throw new Error('block.kind is required');
if (!BUILDERS[block.kind]) throw new Error(`unknown kind: ${block.kind}`);

const pages = await browser.listPages();
const lcmsTabs = pages.filter(p => p.url && p.url.includes(TAB_URL_HINT));
if (!lcmsTabs.length) throw new Error('No Witty LCMS tab found.');
let lcms;
if (lcmsHostHint) {
  lcms = lcmsTabs.find(p => hostnameFromUrl(p.url).includes(lcmsHostHint));
  if (!lcms) throw new Error(`No LCMS tab matches lcmsHostHint='${lcmsHostHint}'.`);
} else if (lcmsTabs.length > 1) {
  throw new Error(`Multiple LCMS tabs open — set lcmsHostHint to disambiguate.`);
} else {
  lcms = lcmsTabs[0];
}
const page = await browser.getPage(lcms.id);
const apiUrl = deriveGraphQLUrl(lcms.url);
console.log('LCMS tab:', hostnameFromUrl(lcms.url));

// Read didacticToolId, versionId, and full blocks array from Apollo cache.
// Cache stores GraphQL responses with __ref pointers; resolve them recursively
// so the result is a flat self-contained array we can re-send to the mutation.
const ctx = await page.evaluate(() => {
  const cache = window.__APOLLO_CLIENT__?.cache?.extract();
  if (!cache) throw new Error('Apollo cache not available on this page.');
  const root = cache.ROOT_QUERY || {};
  const key = Object.keys(root).find(k => k.startsWith('getBuildingBlocks('));
  if (!key) throw new Error('No getBuildingBlocks query found in Apollo cache.');
  const m = key.match(/didacticToolId":"([^"]+)".+versionId":"([^"]+)"/);
  if (!m) throw new Error('Could not parse didacticToolId/versionId from cache key.');
  function resolve(val) {
    if (val === null || val === undefined) return val;
    if (Array.isArray(val)) return val.map(resolve);
    if (typeof val === 'object') {
      if (val.__ref) return resolve(cache[val.__ref]);
      const out = {};
      for (const [k, v] of Object.entries(val)) out[k] = resolve(v);
      return out;
    }
    return val;
  }
  return {
    didacticToolId: m[1],
    versionId: m[2],
    blocks: resolve(root[key].buildingBlocks) || [],
  };
});
console.log(`existing blocks: ${ctx.blocks.length}, didacticToolId: ${ctx.didacticToolId}`);

let resolvedAssetId = block.assetId || block.avatarAssetId || null;
if (!resolvedAssetId && blockNeedsAsset(block)) {
  const dummyB64 = loadDummyAsset();
  if (dummyB64) {
    resolvedAssetId = await uploadAsset({
      page, apiUrl, bytes: dummyB64,
      filename: 'dummy.webp', mimeType: 'image/webp',
    });
    if (resolvedAssetId) console.log('uploaded dummy asset:', resolvedAssetId);
  } else {
    console.warn('Block needs asset but no __INLINE_DUMMY_B64 set — save will likely fail.');
  }
}

const blockInput = { ...block };
if (resolvedAssetId && !blockInput.assetId) blockInput.assetId = resolvedAssetId;
if (resolvedAssetId && block.kind === 'quote' && !blockInput.avatarAssetId) blockInput.avatarAssetId = resolvedAssetId;
const newDto = BUILDERS[block.kind](blockInput, 0);

// Insert at requested position and renumber `order`. Existing blocks come straight
// from cache so they're already in DTO shape — no re-building required.
let combined;
if (position === 'first' || position === 0) {
  combined = [newDto, ...ctx.blocks];
} else if (position === 'last' || position === undefined) {
  combined = [...ctx.blocks, newDto];
} else if (typeof position === 'number') {
  const i = Math.max(0, Math.min(position, ctx.blocks.length));
  combined = [...ctx.blocks.slice(0, i), newDto, ...ctx.blocks.slice(i)];
} else {
  throw new Error(`Invalid position: ${position}`);
}
const renumbered = combined.map((b, i) => ({ ...b, order: i }));

const result = await page.evaluate(async ({ vars }) => {
  const c = window.__APOLLO_CLIENT__;
  const docNode = {
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
  try {
    const r = await c.mutate({ mutation: docNode, variables: vars, fetchPolicy: 'no-cache' });
    return { status: 200, ok: true, body: JSON.stringify(r.data) };
  } catch (e) {
    return { status: 500, ok: false, body: String(e) + ' :: ' + JSON.stringify(e.graphQLErrors || []).slice(0, 2000) };
  }
}, {
  vars: {
    input: {
      didacticToolId: ctx.didacticToolId,
      versionId: ctx.versionId,
      audience: null,
      buildingBlocks: renumbered,
    },
  },
});

console.log(`save status: ${result.status}, blocks: ${ctx.blocks.length} → ${renumbered.length}`);
console.log('response:', result.body.slice(0, 600));
