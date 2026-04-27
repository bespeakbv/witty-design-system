// Witty LCMS save runner — single GraphQL mutation, no UI traversal.
//
// Usage (inline, recommended):
//   dev-browser --connect <<EOF
//   const __INLINE_DUMMY_B64 = "...";
//   const __INLINE_LES = { ... };
//   $(cat builders.js)
//   $(cat save-les.js)
//   EOF
//
// Standalone (less common, requires les.json staged):
//   dev-browser run save-les.js   // reads ~/.dev-browser/tmp/les.json
//
// les.json shape:
// {
//   "didacticToolId": "ae6834b1-...",     // from CMS URL
//   "lcmsHostHint": "witty.bespeak.nl",   // optional — required when multiple LCMS tabs open
//   "apiUrl": "https://api.witty.bespeak.nl/graphql",  // optional — overrides auto-derive
//   "versionId": "...",                    // optional — falls back to Apollo cache
//   "audience": "MBO_4",                   // optional
//   "defaultAssetId": "...",               // optional — skip auto-upload of dummy.webp
//   "blocks": [ { "kind": "...", ... }, ... ]
// }

const TAB_URL_HINT = 'lcms.witty.';

// dev-browser's QuickJS sandbox has a stripped-down URL constructor (only `href`,
// no hostname/host/protocol), so we parse manually. The full URL API is available
// inside page.evaluate() — but not in the script-level code that runs here.
function hostnameFromUrl(url) {
  const m = String(url || '').match(/^https?:\/\/([^/?#]+)/i);
  return m ? m[1] : '';
}

function deriveGraphQLUrl(lcmsUrl) {
  const hostname = hostnameFromUrl(lcmsUrl);
  if (!hostname.startsWith('lcms.')) {
    throw new Error(`Unexpected LCMS host (expected 'lcms.<...>'): ${hostname}`);
  }
  return `https://api.${hostname.slice('lcms.'.length)}/graphql`;
}

// ---- asset upload --------------------------------------------------------

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
    console.warn('[uploadAsset] no bytes provided');
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
  console.log(`[uploadAsset] uploaded ${filename} → assetId=${result.id}`);
  return result.id;
}

// Inline-only: the standalone fs-fallback was removed because QuickJS decodes
// readFile output as UTF-8 and truncates WebP bytes at the first high byte.
function loadDummyAsset() {
  return (typeof __INLINE_DUMMY_B64 !== 'undefined' && __INLINE_DUMMY_B64) ? __INLINE_DUMMY_B64 : null;
}

// ---- main ----------------------------------------------------------------

let les;
if (typeof __INLINE_LES !== 'undefined' && __INLINE_LES) {
  les = __INLINE_LES;
} else {
  const lesText = await readFile('les.json');
  les = JSON.parse(lesText);
}

validateBlocks(les.blocks);
console.log('blocks to send:', les.blocks.length);

const needsDefaultAsset = les.blocks.some(b => blockNeedsAsset(b));

// Find the LCMS tab. If multiple are open, match les.lcmsHostHint against
// hostname only — never the full URL, to avoid path-fragment collisions.
const pages = await browser.listPages();
const lcmsTabs = pages.filter(p => p.url && p.url.includes(TAB_URL_HINT));
if (!lcmsTabs.length) throw new Error('No Witty LCMS tab found — open the building-blocks page of the target environment first.');
let lcms;
if (les.lcmsHostHint) {
  lcms = lcmsTabs.find(p => hostnameFromUrl(p.url).includes(les.lcmsHostHint));
  if (!lcms) throw new Error(`No LCMS tab matches lcmsHostHint='${les.lcmsHostHint}'. Open the right environment or adjust the hint.`);
} else if (lcmsTabs.length > 1) {
  throw new Error(
    `Multiple LCMS tabs open (${lcmsTabs.map(t => hostnameFromUrl(t.url)).join(', ')}). ` +
    `Set 'lcmsHostHint' in les.json (e.g. 'acc.test-k8s' or 'witty.bespeak.nl') to disambiguate.`
  );
} else {
  lcms = lcmsTabs[0];
}
const page = await browser.getPage(lcms.id);
const targetUrl = les.apiUrl || deriveGraphQLUrl(lcms.url);
console.log('LCMS tab:', hostnameFromUrl(lcms.url));
console.log('GraphQL: ', targetUrl);

let defaultAssetId = les.defaultAssetId || null;
if (!defaultAssetId && needsDefaultAsset) {
  const dummyBytes = loadDummyAsset();
  if (dummyBytes) {
    defaultAssetId = await uploadAsset({
      page, apiUrl: targetUrl, bytes: dummyBytes,
      filename: 'dummy.webp', mimeType: 'image/webp',
    });
    if (defaultAssetId) console.log('default assetId:', defaultAssetId);
  } else {
    console.warn('Image-required blocks present but no __INLINE_DUMMY_B64 set and no defaultAssetId in les.json — save will likely fail.');
  }
}

const buildingBlocks = les.blocks.map((b, i) => {
  const fn = BUILDERS[b.kind];
  if (!fn) throw new Error(`unknown kind: ${b.kind}`);
  const block = { ...b };
  if (defaultAssetId && !block.assetId) block.assetId = defaultAssetId;
  if (defaultAssetId && b.kind === 'quote' && !block.avatarAssetId) block.avatarAssetId = defaultAssetId;
  return fn(block, i);
});

// Always extract the live versionId from Apollo cache to detect concurrent edits.
const cacheVersionId = await page.evaluate(() => {
  const q = window?.__APOLLO_CLIENT__?.cache?.extract?.();
  const t = q ? Object.values(q).find(v => v?.__typename === 'DidacticToolDto') : null;
  return t?.versionId || null;
});

let versionId = les.versionId || cacheVersionId;
if (!versionId) throw new Error('versionId not found — pass it explicitly via les.json or open the building-blocks page so Apollo caches it.');
if (les.versionId && cacheVersionId && les.versionId !== cacheVersionId) {
  console.warn(
    `[versionId] caller passed '${les.versionId}' but Apollo cache holds '${cacheVersionId}'. ` +
    `Concurrent edit possible — using caller's versionId; re-open the tab and re-run if you want to pick up the latest state.`
  );
}

// Use Apollo client.mutate() — bypasses Chrome extensions (react-grab, react-scan)
// that wrap window.fetch and break cross-origin requests with "TypeError: Failed
// to fetch". Apollo's HttpLink captured fetch at init time, before extensions.
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
  vars: { input: { didacticToolId: les.didacticToolId, versionId, audience: les.audience || null, buildingBlocks } },
});

console.log('save status:', result.status);
console.log('response:', result.body.slice(0, 600));
