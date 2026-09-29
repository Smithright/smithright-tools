# Fold authoring contract · v1

The content model is a plain JSON object. Treat `deck.json` as the canonical source for a repository build. A browser download is a separate editable copy until the author commits it. Preserve unrelated content and IDs when responding to a targeted edit.

## Deck fields

| Field | Contract |
| --- | --- |
| `schemaVersion` | Integer `1` |
| `id` | Lowercase slug, up to 64 characters; used for download names and draft scope |
| `title`, `author` | Plain text, up to 160 characters each |
| `slides` | Ordered array of 1–80 slides |

## Slide fields

Every slide has all these fields; no unknown fields are accepted.

| Field | Contract |
| --- | --- |
| `id` | Unique stable lowercase slug, up to 64 characters; never a display number |
| `layout` | `editorial`, `blueprint`, `system`, `isometric`, `cinematic`, `data`, or `type` |
| `eyebrow` | Short category text, up to 100 characters |
| `title` | Headline, up to 140 characters; `\n` requests line breaks |
| `body` | Supporting statement, up to 300 characters; `\n` requests line breaks |
| `accent` | Six-digit hex color, such as `#f8b85b` |
| `label` | Visible source, qualification, or footnote, up to 150 characters |
| `items` | Exactly 4 items for `blueprint` and `system`; exactly 3 for other layouts |
| `details` | Array of 0–12 objects with `title` (160 characters) and `body` (8,000 characters) |
| `notes` | Plain-text speaker notes, up to 4,000 characters; included in downloads |

An item has `label` (35 characters), `text` (80 characters), and optionally `value` (number from 0–100). `data` requires `value` for all three items. Items are positional: system order is clockwise from the top; blueprint order is intent → policy → execution → evidence. The isometric scene labels people, platform, and possibility. Cinematic uses the first two item descriptions as its chapter treatment.

IDs must start with a letter and contain only lowercase letters, digits, and hyphens. Player IDs such as `deck`, `editor`, and `overview`, plus the prefixes `details-` and `preview-`, are reserved. See the validator for the complete reserved set.

## A compact slide

```json
{
  "id": "next-frontier",
  "layout": "cinematic",
  "eyebrow": "CHAPTER TWO / THE OPPORTUNITY",
  "title": "A wider\nhorizon.",
  "body": "Build with a clear point of view.",
  "accent": "#f8b85b",
  "label": "A PROPOSED DIRECTION",
  "items": [
    {"label": "Atmosphere", "text": "Light + depth"},
    {"label": "Hierarchy", "text": "One focal point"},
    {"label": "Restraint", "text": "Space to feel"}
  ],
  "details": [
    {"title": "Why this direction", "body": "Add the supporting reasoning here."}
  ],
  "notes": "Pause before moving into the plan."
}
```

## Editing discipline

1. Identify the slide by stable ID, then the named field or item. Ask only when the requested target is genuinely ambiguous.
2. Preserve IDs when moving or editing slides. Mint a new ID when duplicating or inserting one. The array is the only slide order.
3. Use a short main argument above the fold. Put references, caveats, and longer explanation in `details`; do not shrink type to hide overflow.
4. Preserve facts, attribution, measurement units, and uncertainty. Never replace illustrative data with implied real results.
5. Run `node build.mjs`, then inspect the affected slide at presentation and mobile sizes. A valid schema does not prove visual fit.
6. Verify the export/reopen path after changing editing or rendering behavior. Reordering must preserve both details and notes.

The deck format accepts plain text, not HTML, SVG strings, script, remote URLs, or executable expressions. To add a new visual capability, implement it in `src/renderers.js`, add a named layout to `src/model.js`, and document its data contract. Original SVG shapes belong to the renderer; labels and content belong to the deck.

## Visual acceptance

- At the supported desktop viewport, the main composition fits above the detail link with no clipped text.
- On narrow screens, content reflows, remains readable, and never causes horizontal page scrolling.
- Motion has a communicative purpose, can be paused, and honors reduced motion. Meaning survives a static PDF.
- Color is not the sole carrier of information. Diagrams include accessible descriptions.
- Both print modes preserve the current order; detail text is included only when selected.
- New example assets must be original or carry explicit reuse permission and attribution. Avoid introducing a network dependency into the portable output.
