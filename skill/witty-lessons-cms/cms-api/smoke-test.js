// Witty LCMS smoke test — idempotent re-save of the currently open lesson.
//
// Reads existing blocks from Apollo cache and saves them back unchanged. Proves
// that auth (cookies), endpoint detection, Apollo routing, and the current set
// of enum values are all valid for whichever environment the open tab points to.
//
// Use when: switching between acc/live, after a back-end deploy, or when a
// `save-les.js` run starts failing and you want to isolate whether the issue
// is in your input vs. the wider stack.
//
// Inline usage:
//   const __INLINE_LCMS_HOST_HINT = "witty.bespeak.nl";  // optional
//   $(cat smoke-test.js)
//
// Standalone:
//   dev-browser run smoke-test.js
//
// Output: ✓ pass with timing, or ✗ fail with the GraphQL error body.

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

const lcmsHostHint = (typeof __INLINE_LCMS_HOST_HINT !== 'undefined') ? __INLINE_LCMS_HOST_HINT : null;

const pages = await browser.listPages();
const lcmsTabs = pages.filter(p => p.url && p.url.includes(TAB_URL_HINT));
if (!lcmsTabs.length) throw new Error('No Witty LCMS tab found.');
let lcms;
if (lcmsHostHint) {
  lcms = lcmsTabs.find(p => hostnameFromUrl(p.url).includes(lcmsHostHint));
  if (!lcms) throw new Error(`No LCMS tab matches lcmsHostHint='${lcmsHostHint}'.`);
} else if (lcmsTabs.length > 1) {
  throw new Error('Multiple LCMS tabs open — set __INLINE_LCMS_HOST_HINT to disambiguate.');
} else {
  lcms = lcmsTabs[0];
}
const page = await browser.getPage(lcms.id);
const apiUrl = deriveGraphQLUrl(lcms.url);
console.log('LCMS tab:', hostnameFromUrl(lcms.url));
console.log('GraphQL: ', apiUrl);

const ctx = await page.evaluate(() => {
  const cache = window.__APOLLO_CLIENT__?.cache?.extract();
  if (!cache) throw new Error('Apollo cache not available.');
  const root = cache.ROOT_QUERY || {};
  const key = Object.keys(root).find(k => k.startsWith('getBuildingBlocks('));
  if (!key) throw new Error('No getBuildingBlocks query found in Apollo cache.');
  const m = key.match(/didacticToolId":"([^"]+)".+versionId":"([^"]+)"/);
  if (!m) throw new Error('Cannot parse didacticToolId/versionId from cache key.');
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
if (!ctx.blocks.length) {
  console.warn('Lesson has zero blocks — smoke test still meaningful but trivial.');
}

const t0 = Date.now();
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
    return { ok: true, body: JSON.stringify(r.data) };
  } catch (e) {
    return { ok: false, body: String(e) + ' :: ' + JSON.stringify(e.graphQLErrors || []).slice(0, 2000) };
  }
}, {
  vars: {
    input: {
      didacticToolId: ctx.didacticToolId,
      versionId: ctx.versionId,
      audience: null,
      buildingBlocks: ctx.blocks,
    },
  },
});
const ms = Date.now() - t0;

if (result.ok) {
  console.log(`✓ smoke test passed in ${ms}ms — env=${hostnameFromUrl(lcms.url)}, blocks=${ctx.blocks.length}`);
} else {
  console.log(`✗ smoke test failed in ${ms}ms`);
  console.log(result.body);
  throw new Error('smoke test failed — see above for diagnostics.');
}
