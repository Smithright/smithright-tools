# Working on Fold

- Read README.md and AUTHORING.md. Use stable slide IDs for targeted content changes.
- Source is deck.json plus src/. Rebuild index.html with `node build.mjs`; do not edit the generated artifact directly.
- Keep the presentation dependency-free, offline-capable, and usable from a file URL and a hosted subfolder.
- Browser edit state is a local draft. Never label it published or saved to the source repository.
- Preserve printable detail content, accessible navigation, reduced-motion behavior, and the download/reopen round trip.
- Run the model and browser tests for player/editor changes. Review screenshots for visual changes. Keep generated test outputs out of Git.
- Do not add third-party art, fonts, analytics, CDN dependencies, or executable deck content without an explicit reason and documented provenance.
