# Fold

**A presentation for the room. A document for the curious.**

One clear screen, with optional depth below it. Fold is an editable, portable HTML presentation template with seven original design examples. Open `index.html` directly; presenting and editing require no installation, account, server, or network connection.

[Open the live example](https://smithright.github.io/smithright-tools/presentation-template/) · [Authoring contract](AUTHORING.md)

## Try it

1. Download this folder, then open **index.html** in a modern browser.
2. Use the arrow buttons or **← / →** to navigate. **Overview** shows the whole deck. Stable links such as `#living-system` survive reordering.
3. Choose **Read** for a continuous document, or **Explore the details** below a slide. **Present** enters browser fullscreen.
4. Choose **Edit**, change a headline, and select **Apply changes**. Drag a slide in the sidebar or use its **↑ / ↓** buttons. Undo and redo are available.
5. **Download HTML**, close the editor, and open the downloaded file. Your content and order travel with it. **Download JSON** saves the editable content model; **Open JSON** loads it again.

Browser drafts are local to this browser and this source version. Restoring a draft is explicit. Browser storage may be unavailable or cleared; a download is the portable copy. Editing a hosted deck does **not** update its repository or publish a new version. Downloads include speaker notes; remove private notes before sharing. There is no multi-user synchronization.

## Seven design examples

| Stable ID | Design language | Best suited to |
| --- | --- | --- |
| `the-fold` | Swiss editorial typography and SVG geometry | A clear opening proposition |
| `precision` | Technical SVG blueprint | Architectures and bounded processes |
| `living-system` | Animated feedback diagram | Explaining recurring system behavior |
| `dimensional` | Isometric SVG scene | Platforms and ecosystems |
| `new-world` | Cinematic, game-studio-inspired vector environment | Chapter openings and ambitious visions |
| `evidence` | Restrained data comparison | Comparisons with a shared measurement scale |
| `your-turn` | Expressive typography and orbital geometry | A memorable close |

All artwork is original inline SVG. Fonts use the system stack. The animations and chart values are illustrative, not live or measured results. The default deck makes no external requests. Motion can be paused and respects reduced-motion preferences. Mobile layouts reflow vertically; the desktop presentation uses a 16:9 canvas.

## Print or save as PDF

Choose **Print / PDF**:

- **Slides only:** one 16:9 canvas per page, in the current order.
- **Slides + details:** each canvas followed by its supporting content. Long detail text can continue over additional pages.

In the browser print dialog, select Save as PDF, landscape, no margins, and background graphics. Disable browser headers and footers. Chrome/Chromium is the verified PDF path. The example exports to 7 or 14 pages. Speaker notes are not printed. Interactive motion becomes a static diagram.

Shortcuts: **← / →**, **Page Up / Page Down**, **Home / End**; **F** fullscreen; **I** overview; **S** reading mode. In edit mode, **Ctrl/Cmd+Z** undoes a deck change outside text fields. Standard text editing shortcuts remain native inside fields.

## Author with an agent

Use [AUTHORING.md](AUTHORING.md) as the authoring contract. Content lives in `deck.json`, including the order. `src/model.js` is the executable validator shared by the build and browser. It rejects unknown fields, duplicate or reserved IDs, unsupported layouts, malformed colors, and invalid chart values before replacing a deck.

Example requests:

> On `precision`, change the four node labels to Discover, Decide, Deliver, and Verify. Preserve the ID and layout.

> Move `evidence` before `new-world`. Keep the chart values and details attached to the same slide.

> Add a cinematic chapter opener after `dimensional`. Use the ID `next-frontier`, an amber accent, and one detail section describing the opportunity.

An agent can edit JSON and rebuild, or return JSON for **Open JSON**. There is no dependency on a particular agent provider.

## Build

Only Node.js 20+ is needed to regenerate the portable HTML. No package installation is required for this command:

```sh
node build.mjs
```

To build another source file, with paths relative to this folder:

```sh
node build.mjs my-deck.json my-deck.html
```

The generated `index.html` is checked in so opening the template works immediately. Edit `deck.json` or `src/` and rebuild; do not hand-edit the generated file. The browser's HTML export contains the current deck and the same runtime, including the editor.

## GitHub Pages

The output is a static HTML file. It works at a repository subpath without a router, base-path configuration, CDN, or build service.

For a copied repository, select **Settings → Pages → Deploy from a branch**, choose the branch containing `presentation-template/index.html`, and choose **/ (root)**. The deck will be at `https://<owner>.github.io/<repository>/presentation-template/`. Add an empty `.nojekyll` file at the publishing root when serving a branch directly.

This repository also includes a scoped validation workflow. It rebuilds and checks the committed artifact, exercises browser editing and exports, and uploads test screenshots and PDFs. Publishing is a separate action from these checks.

The initial live example is served from `gh-pages`, containing only the generated presentation, its license, a version receipt, and a root redirect. Updating source in a pull request does not update that preview. After rebuilding and verification, update `gh-pages/presentation-template/index.html` to publish; keep its version receipt aligned with the source commit and SHA-256.

## Source map

| File | Responsibility |
| --- | --- |
| `deck.json` | Versioned content, order, IDs, notes, and detail sections |
| `src/model.js` | Strict content validation |
| `src/renderers.js` | Original SVG scenes and semantic slide rendering |
| `src/styles.css` | Seven art directions, responsive reading, editor, and print |
| `src/app.js` | Navigation, editor, reorder, drafts, undo, import/export |
| `src/shell.html` | Accessible player/editor controls and embedded-source slots |
| `build.mjs` | Dependency-free single-file builder |
| `tests/` | Source validation and complete browser workflows |

## Verify changes

Test dependencies are development-only:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm build
pnpm test
```

The browser suite tests local offline use, hosted subfolder use, stable links, every example's desktop and mobile layout, fullscreen, reordering, undo/redo, downloads and reopening, draft restoration, malformed imports, text escaping, and storage-disabled recovery. It produces screenshots, both PDF modes, and `test-results/verification.json`.

Environment overrides for an existing test runtime: `PLAYWRIGHT_MODULE`, `PDF_LIB_MODULE`, and `CHROME_PATH`. The runtime itself does not need them.

## Scope and license

Version 0.1.0. Chromium desktop and mobile-sized rendering are verified; Safari, Firefox, touch dragging, and physical mobile devices need additional testing. The up/down reorder buttons provide a drag-free path. Very long headlines may need editorial adjustment; the model's length limits are not a guarantee that arbitrary text fits a specific composition. Adding new diagram topologies or artwork requires a renderer, not arbitrary executable markup in a deck.

The new code and original example artwork in **this folder** are MIT licensed; see [LICENSE](LICENSE). Other repository folders retain their existing licensing. Reuse, remix, and publish your own decks with the license notice retained.
