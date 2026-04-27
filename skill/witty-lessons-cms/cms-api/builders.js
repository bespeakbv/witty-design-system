// Witty LCMS — shared building-block builders.
//
// Sourced into save-les.js and add-block.js via:
//   $(cat builders.js)
//   $(cat save-les.js)
//
// Single source of truth for: enum maps, Quill helpers, per-kind builders,
// the BUILDERS lookup table, and per-kind required-field validation.
//
// All 16 menu types are implemented:
//   tekst · stelling · vraag-tekst · vraag-afb · poll · volgorde · quote ·
//   hotspot · connect · stepper · chat · accordion · kaarten · lijst · link · media

// ---- enum maps -----------------------------------------------------------

const BG_MAP = {
  standaard: 'WHITE',
  licht:     'NEUTRAL_LIGHT',
  neutraal:  'NEUTRAL_LIGHT',
  donker:    'BRAND_DARK',
};

const LAYOUT_MAP = {
  'een-kolom':     'ONE_COLUMN',
  'twee-kolommen': 'TWO_COLUMNS',
  'gecentreerd':   'TEXT_CENTERED',
  'media-links':   'IMAGE_LEFT',
  'media-rechts':  'IMAGE_RIGHT',
  'default':       'DEFAULT',
};

// ---- Quill Delta helpers --------------------------------------------------

// Plain text → Quill Delta JSON string.
const toDelta = (txt) => txt ? JSON.stringify({ ops: [{ insert: String(txt).replace(/\n*$/, '') + '\n' }] }) : '';

// Structured paragraphs with optional heading levels → Quill Delta.
// parts: [{ text: '...', header?: 1|2 }, ...]
function toDeltaStructured(parts) {
  const ops = [];
  for (const p of parts) {
    if (!p || !p.text) continue;
    ops.push({ insert: String(p.text) });
    ops.push(p.header ? { insert: '\n', attributes: { header: p.header } } : { insert: '\n' });
  }
  return ops.length ? JSON.stringify({ ops }) : '';
}

// ---- misc helpers ---------------------------------------------------------

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = (Math.random() * 16) | 0;
  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
});

const SPACING = { __typename: 'SpacingDto', bottom: 'DEFAULT', top: 'DEFAULT' };

// ---- block builders -------------------------------------------------------

function buildTekst(b, order) {
  // Combine titel/subtitel/body when any are present (artifact-shape from
  // claude.ai export); fall back to plain body/kolom1 when only one field set.
  let contentColumnOne;
  if (b.titel || b.subtitel) {
    const parts = [];
    if (b.titel)    parts.push({ text: b.titel,    header: 1 });
    if (b.subtitel) parts.push({ text: b.subtitel, header: 2 });
    if (b.body)     parts.push({ text: b.body });
    contentColumnOne = toDeltaStructured(parts);
  } else {
    contentColumnOne = toDelta(b.body || b.kolom1 || '');
  }
  return {
    __typename: 'ContentBuildingBlockDto',
    id: b.id, order, type: 'CONTENT',
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: LAYOUT_MAP[b.variant] || 'ONE_COLUMN',
    contentColumnOne,
    contentColumnTwo: b.kolom2 ? toDelta(b.kolom2) : null,
    assetId: b.assetId || null,
    assetColumnTwoId: b.assetColumnTwoId || null,
    objectFit: 'BOXED', spacing: SPACING, list: null,
  };
}

function buildStelling(b, order) {
  return {
    __typename: 'StandBuildingBlockDto',
    id: b.id, order, type: 'STAND',
    stand: b.vraag || b.stand || '',
    instruction: b.instructie || '',
    agreeText: b.labelJuist || 'Juist',
    disagreeText: b.labelOnjuist || 'Onjuist',
    correctOption: (b.correct === 'onjuist' || b.juistIsJuist === false) ? 'DISAGREE' : 'AGREE',
    correctFeedbackText:   toDelta(b.feedbackJuist || ''),
    incorrectFeedbackText: toDelta(b.feedbackOnjuist || ''),
    background: BG_MAP[b.achtergrond] || 'NEUTRAL_LIGHT',
    layout: 'TEXT_CENTERED', objectFit: 'BOXED',
    assetId: null, text: null, title: null,
  };
}

function buildVraagTekst(b, order) {
  const answers = (b.opties || []).map((o, i) => ({
    __typename: 'AnswerDto', id: o.id, order: i, text: o.tekst, correct: !!o.correct, assetId: null,
  }));
  return {
    __typename: 'MpcBuildingBlockDto',
    id: b.id, order, type: 'MPC', subType: 'mpc',
    question: b.titel || b.vraag || '',
    instruction: b.instructie || '',
    introduction: b.intro ? toDelta(b.intro) : null,
    helpText: null,
    correctFeedbackText: b.feedback ? toDelta(b.feedback) : null,
    incorrectFeedbackText: null,
    sorting: 'RANDOMIZED',
    voteOption: b.multi ? 'MULTIPLE' : 'SINGLE',
    answers,
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: LAYOUT_MAP[b.layout] || 'TEXT_CENTERED',
    objectFit: 'BOXED', assetId: null, title: null,
  };
}

function buildPoll(b, order) {
  const answers = (b.opties || []).map((o, i) => ({
    __typename: 'PollAnswerDto', id: o.id, order: i, text: o.tekst, voteCount: o.stemmen || 0,
  }));
  return {
    __typename: 'PollBuildingBlockDto',
    id: b.id, order, type: 'POLL',
    question: b.titel || b.vraag || '',
    instruction: b.instructie || '',
    introduction: b.intro ? toDelta(b.intro) : '',
    voteOption: b.multi ? 'MULTIPLE' : 'SINGLE',
    answers,
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: 'DEFAULT',
  };
}

function buildVolgorde(b, order) {
  const answers = (b.opties || []).map((o, i) => ({
    __typename: 'SortQuestionAnswerDto', order: i, text: o.tekst || o, id: uuid(),
  }));
  return {
    __typename: 'SortQuestionBuildingBlockDto',
    id: b.id, order, type: 'SORT_QUESTION',
    question: b.titel || '',
    instruction: b.instructie || '',
    answers,
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: 'TWO_COLUMNS', objectFit: 'FULL',
    introduction: null, correctFeedbackText: null, incorrectFeedbackText: null,
    assetId: null, title: null,
  };
}

function buildQuote(b, order) {
  return {
    __typename: 'QuoteBuildingBlockDto',
    id: b.id, order, type: 'QUOTE',
    quote: b.tekst || '',
    name: b.auteur || '',
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: b.avatarPositie === 'rechts' ? 'IMAGE_RIGHT' : 'IMAGE_LEFT',
    assetId: b.avatarAssetId || null,
  };
}

function buildHotspot(b, order) {
  return {
    __typename: 'HotspotBuildingBlockDto',
    id: b.id, order, type: 'HOTSPOT',
    content: toDelta(b.body || ''),
    spots: (b.hotspots || []).map(h => ({
      __typename: 'SpotDto', id: uuid(), x: h.x, y: h.y,
      content: toDelta(`${h.titel}\n${h.body}`),
    })),
    background: BG_MAP[b.achtergrond] || 'NEUTRAL_LIGHT',
    layout: b.textPositie === 'rechts' ? 'IMAGE_LEFT' : 'IMAGE_RIGHT',
    assetId: b.assetId || null,
  };
}

// Connect: each pair becomes one item with a nested correctAnswer.
// Verified against acc cache 2026-04-27: items[i].content (Delta, left side) ↔
// items[i].correctAnswer.content (plain string, right side). buildingBlockId is
// auto-wired by the back-end for new blocks (omitted here).
function buildConnect(b, order) {
  const items = (b.paren || []).map(p => ({
    __typename: 'QuestionConnectItemDto',
    id: uuid(),
    content: toDelta(p.links || ''),
    assetId: p.linksAssetId || null,
    correctAnswer: {
      __typename: 'QuestionConnectItemAnswerDto',
      id: uuid(),
      content: p.rechts || '',
      assetId: p.rechtsAssetId || null,
    },
  }));
  return {
    __typename: 'QuestionConnectBuildingBlockDto',
    id: b.id, order, type: 'QUESTION_CONNECT',
    question: b.titel || '',
    instruction: b.instructie || '',
    introduction: '', title: '', items,
    questionConnectType: b.metAfbeelding ? 'IMAGE_TEXT' : 'TEXT_TEXT',
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: 'CENTERED',
    correctFeedbackText: '', incorrectFeedbackText: '',
  };
}

function buildStepper(b, order) {
  const blocks = (b.stappen || []).map((s, i) => {
    const parts = [];
    if (s.titel)    parts.push({ text: s.titel,    header: 1 });
    if (s.subtitel) parts.push({ text: s.subtitel, header: 2 });
    if (s.body)     parts.push({ text: s.body });
    return {
      __typename: 'ContentBuildingBlockDto',
      order: i, type: 'CONTENT',
      background: 'WHITE', layout: 'ONE_COLUMN',
      contentColumnOne: toDeltaStructured(parts),
      contentColumnTwo: null, assetId: null, assetColumnTwoId: null,
      objectFit: 'BOXED', spacing: SPACING, list: null,
    };
  });
  return {
    __typename: 'CarouselBuildingBlockDto',
    id: b.id, order, type: 'CAROUSEL',
    background: BG_MAP[b.achtergrond] || 'WHITE',
    blocks, spacing: SPACING, layout: 'DEFAULT',
  };
}

function buildChat(b, order) {
  const persons = (b.personen || []).map((p, i) => ({
    __typename: 'PersonDto', id: uuid(), order: i, name: p.naam,
    direction: p.positie === 'rechts' ? 'RIGHT' : 'LEFT',
    assetId: p.assetId || null,
  }));
  const messages = (b.berichten || []).map((m, i) => ({
    __typename: 'MessageDto', id: uuid(), order: i,
    message: toDelta(m.tekst),
    personIndex: typeof m.persoonIndex === 'number' ? m.persoonIndex : 0,
  }));
  return {
    __typename: 'ConversationBuildingBlockDto',
    id: b.id, order, type: 'CONVERSATION',
    interval: 0, persons, messages,
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: 'DEFAULT',
  };
}

function buildAccordion(b, order) {
  return {
    __typename: 'AccordionBuildingBlockDto',
    id: b.id, order, type: 'ACCORDION',
    title: b.titel || '',
    introduction: toDelta(b.intro || ''),
    background: BG_MAP[b.achtergrond] || 'WHITE',
    accordionItems: (b.items || []).map((item, i) => ({
      __typename: 'AccordionItemDto',
      id: uuid(),
      title: item.titel || '',
      content: toDelta(item.body || ''),
      sortOrder: i,
    })),
  };
}

// Kaarten = pre-existing reference-card library entries selected by ID.
// Accepts either `cardIds: [uuid]` (minimal new-block input) or `cards: [{id,...}]`
// (full nested objects, e.g. when rebuilding from cache).
function buildKaarten(b, order) {
  const cards = b.cards
    ? b.cards.map(c => ({ __typename: 'ReferenceCardDto', ...c }))
    : (b.cardIds || []).map(id => ({ __typename: 'ReferenceCardDto', id }));
  return {
    __typename: 'ReferenceCardsCarouselBuildingBlockDto',
    id: b.id, order, type: 'REFERENCE_CARDS_CAROUSEL',
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: 'DEFAULT',
    title: b.titel || '',
    content: toDelta(b.body || ''),
    cards,
  };
}

function buildLijst(b, order) {
  return {
    __typename: 'ListBuildingBlockDto',
    id: b.id, order, type: 'LIST',
    alignment: b.alignment === 'horizontaal' ? 'HORIZONTAL' : 'VERTICAL',
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: b.layout || 'ONE_COLUMN_WITH_IMAGE',
    items: (b.items || []).map((item, i) => ({
      __typename: 'ListItemDto',
      id: uuid(),
      title: item.titel || '',
      subtitle: item.subtitel || '',
      content: toDelta(item.body || ''),
      sortOrder: i,
      assetId: item.assetId || null,
    })),
    spacing: SPACING,
  };
}

function buildLink(b, order) {
  return {
    __typename: 'LinkBuildingBlockDto',
    id: b.id, order, type: 'LINK',
    title: b.titel || '',
    instruction: b.instructie || b.body || '',
    url: b.url || '',
    linkLabel: b.linkLabel || b.cta || 'Open',
    openInNewWindow: b.openInNewWindow !== false,
    assetId: b.assetId || null,
    background: BG_MAP[b.achtergrond] || 'WHITE',
  };
}

function buildMedia(b, order) {
  return {
    __typename: 'MediaBuildingBlockDto',
    id: b.id, order, type: 'MEDIA',
    background: BG_MAP[b.achtergrond] || 'WHITE',
    layout: 'DEFAULT',
    assetId: b.assetId || null,
  };
}

const BUILDERS = {
  tekst: buildTekst,
  stelling: buildStelling,
  'vraag-tekst': buildVraagTekst,
  'vraag-afb': buildVraagTekst,
  poll: buildPoll,
  volgorde: buildVolgorde,
  quote: buildQuote,
  hotspot: buildHotspot,
  connect: buildConnect,
  stepper: buildStepper,
  chat: buildChat,
  accordion: buildAccordion,
  kaarten: buildKaarten,
  lijst: buildLijst,
  link: buildLink,
  media: buildMedia,
};

// ---- input validation -----------------------------------------------------

const REQUIRED = {
  tekst:         (b) => !!(b.body || b.kolom1)                                     || 'tekst: body or kolom1 is required',
  stelling:      (b) => !!(b.vraag || b.stand)                                     || 'stelling: vraag is required',
  'vraag-tekst': (b) => !!((b.titel || b.vraag) && Array.isArray(b.opties) && b.opties.length) || 'vraag-tekst: titel and non-empty opties[] are required',
  'vraag-afb':   (b) => !!((b.titel || b.vraag) && Array.isArray(b.opties) && b.opties.length) || 'vraag-afb: titel and non-empty opties[] are required',
  poll:          (b) => !!((b.titel || b.vraag) && Array.isArray(b.opties) && b.opties.length) || 'poll: titel and non-empty opties[] are required',
  volgorde:      (b) => Array.isArray(b.opties) && b.opties.length >= 2            || 'volgorde: opties[] needs at least 2 items',
  quote:         (b) => !!(b.tekst && b.auteur)                                    || 'quote: tekst and auteur are required',
  hotspot:       (b) => Array.isArray(b.hotspots) && b.hotspots.length >= 1        || 'hotspot: at least 1 hotspot required',
  connect:       (b) => Array.isArray(b.paren) && b.paren.length >= 2              || 'connect: paren[] needs at least 2 pairs',
  stepper:       (b) => Array.isArray(b.stappen) && b.stappen.length >= 2          || 'stepper: stappen[] needs at least 2 steps',
  chat:          (b) => Array.isArray(b.personen) && Array.isArray(b.berichten) && b.berichten.length >= 1 || 'chat: personen[] and berichten[] are required',
  accordion:     (b) => Array.isArray(b.items) && b.items.length >= 1              || 'accordion: items[] needs at least 1 item',
  kaarten:       (b) => (Array.isArray(b.cardIds) && b.cardIds.length >= 1) || (Array.isArray(b.cards) && b.cards.length >= 1) || 'kaarten: cardIds[] or cards[] required',
  lijst:         (b) => Array.isArray(b.items) && b.items.length >= 1              || 'lijst: items[] needs at least 1 item',
  link:          (b) => !!(b.titel && b.url)                                       || 'link: titel and url are required',
  media:         (b) => !!b.assetId                                                || 'media: assetId is required',
};

function validateBlocks(blocks) {
  const errors = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const fn = BUILDERS[b.kind];
    if (!fn) { errors.push(`block[${i}]: unknown kind '${b.kind}'`); continue; }
    const check = REQUIRED[b.kind];
    const result = check ? check(b) : true;
    if (result !== true) errors.push(`block[${i}] (${b.kind}): ${result}`);
  }
  if (errors.length) throw new Error(`Input validation failed:\n  - ${errors.join('\n  - ')}`);
}

// ---- asset-detection ------------------------------------------------------

const KINDS_NEEDING_ASSET = new Set(['hotspot', 'quote', 'chat', 'media']);
const KINDS_OPTIONAL_ASSET = new Set(['tekst', 'connect', 'vraag-afb', 'stepper', 'lijst', 'link', 'kaarten']);

function blockNeedsAsset(b) {
  if (b.assetId || b.avatarAssetId) return false;
  if (KINDS_NEEDING_ASSET.has(b.kind)) return true;
  if (KINDS_OPTIONAL_ASSET.has(b.kind) && /(media|image|afbeelding)/i.test((b.variant || b.layout || '') + JSON.stringify(b))) return true;
  return false;
}
