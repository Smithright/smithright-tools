/* Shared validation for the browser, build, and tests. No code or HTML in decks. */
(function (root) {
  'use strict';
  const layouts = ['editorial', 'blueprint', 'system', 'isometric', 'cinematic', 'data', 'type'];
  const reserved = new Set(['deck','deck-data','editor','overview','position','toast','layout','motion','fullscreen','previous','next','undo','redo','read-mode','edit-mode','print-open','draft-banner','restore-draft','dismiss-draft','close-editor','save-status','add-slide','slide-list','slide-form','slide-id','item-fields','detail-fields','add-detail','download-html','download-json','import-json','json-file','overview-open','overview-grid','print-dialog','print-now']);
  function validate(deck) {
    const fail = message => { throw new Error(message); };
    const object = (value, path) => { if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${path} must be an object.`); };
    const text = (value, path, max = 4000) => { if (typeof value !== 'string' || value.length > max) fail(`${path} must be text of at most ${max} characters.`); };
    const keys = (value, allowed, path) => { for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${path}: unknown field “${key}”.`); };
    object(deck, 'Deck');
    keys(deck, ['schemaVersion', 'id', 'title', 'author', 'slides'], 'Deck');
    if (deck.schemaVersion !== 1) fail('Use schemaVersion 1.');
    text(deck.id, 'Deck id', 64);
    if (!/^[a-z][a-z0-9-]*$/.test(deck.id)) fail('Deck id must use lowercase letters, numbers, and hyphens.');
    text(deck.title, 'Deck title', 160); text(deck.author, 'Deck author', 160);
    if (!Array.isArray(deck.slides) || deck.slides.length < 1 || deck.slides.length > 80) fail('A deck needs 1–80 slides.');
    const ids = new Set();
    deck.slides.forEach((slide, index) => {
      const at = `Slide ${index + 1}`; object(slide, at);
      keys(slide, ['id', 'layout', 'eyebrow', 'title', 'body', 'accent', 'label', 'items', 'details', 'notes'], at);
      text(slide.id, `${at} id`, 64);
      if (!/^[a-z][a-z0-9-]*$/.test(slide.id) || ids.has(slide.id)) fail(`${at}: use a unique lowercase slide id.`);
      if (reserved.has(slide.id) || /^(details-|preview-)/.test(slide.id)) fail(`${at}: “${slide.id}” is reserved for the player. Choose another id.`);
      ids.add(slide.id);
      if (!layouts.includes(slide.layout)) fail(`${at}: unknown layout.`);
      for (const [field, max] of Object.entries({eyebrow:100, title:140, body:300, label:150, notes:4000})) text(slide[field], `${at} ${field}`, max);
      if (!/^#[0-9a-f]{6}$/i.test(slide.accent)) fail(`${at}: accent must be a six-digit hex color.`);
      const count = ['blueprint', 'system'].includes(slide.layout) ? 4 : 3;
      if (!Array.isArray(slide.items) || slide.items.length !== count) fail(`${at}: ${slide.layout} needs exactly ${count} items.`);
      slide.items.forEach((item, i) => {
        object(item, `${at} item ${i+1}`); keys(item, ['label','text','value'], `${at} item ${i+1}`);
        text(item.label, `${at} item label`, 35); text(item.text, `${at} item text`, 80);
        if (slide.layout === 'data' && (!Number.isFinite(item.value) || item.value < 0 || item.value > 100)) fail(`${at}: chart values must be numbers from 0 to 100.`);
        if ('value' in item && (!Number.isFinite(item.value) || item.value < 0 || item.value > 100)) fail(`${at}: item value must be between 0 and 100.`);
      });
      if (!Array.isArray(slide.details) || slide.details.length > 12) fail(`${at}: use at most 12 detail sections.`);
      slide.details.forEach((detail, i) => { object(detail, `${at} detail ${i+1}`); keys(detail, ['title','body'], `${at} detail ${i+1}`); text(detail.title, `${at} detail title`, 160); text(detail.body, `${at} detail body`, 8000); });
    });
    return deck;
  }
  root.FoldModel = {layouts, validate};
})(globalThis);
