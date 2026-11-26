# Brand Delivery Studio

A local-first browser workspace for preparing, documenting and packaging professional brand identity deliverables.

## Features

- **Project workspace:** create, rename, duplicate, search, delete and back up brand projects. Changes autosave to IndexedDB.
- **Logo asset library:** import SVG, PNG, JPEG, WebP and PDF files; organize categories; preview artwork against light, dark and transparent backgrounds; export SVG/PNG/JPEG at common sizes.
- **SVG safety:** SVG files are parsed as XML, scripts and embedded active content are removed, event handlers and external references are stripped, and the sanitized working copy is stored separately from the original upload.
- **Logo variations:** prepare original, monochrome black, monochrome white and grayscale versions without changing source artwork.
- **Brand colors:** edit a categorized palette, extract explicit HEX fills/strokes from SVG assets, generate tonal tints, calculate WCAG contrast ratios, and export CSS, JSON and a color specification PDF.
- **Typography:** store TTF, OTF, WOFF and WOFF2 font files locally, assign typographic roles, preview specimens and export CSS and a specification PDF.
- **Favicons:** generate 16–512px PNGs, a correctly structured ICO file, a web manifest and HTML integration snippet.
- **Brand guidelines:** edit, reorder, include or exclude sections and export selectable-text PDF pages in A4 portrait, A4 landscape or US Letter formats.
- **Export center:** select deliverable groups and create an organized ZIP archive in the browser.
- **Restorable backups:** export and restore projects, including imported asset and font binaries.
- **Interface:** responsive desktop-first layout, light/dark themes, autosave indicator, undo/redo for project-level edits and keyboard shortcuts.

## Requirements

- Node.js 20 or newer
- npm
- A modern browser (Firefox, Chrome, Safari or Edge)

## Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL (normally `http://localhost:5173`).

## Production build

```bash
npm run typecheck
npm run build
npm run preview
```

The production output is written to `dist/`.

## Deploy to Vercel

Import this repository into Vercel and keep the default Vite settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

No environment variables, database, authentication or server functions are required.

## Local data and privacy

Project records, imported artwork and font binaries are stored in IndexedDB in the current browser profile. The application does not send these files to a server. The interface theme is stored in LocalStorage. A browser data reset, profile deletion or private-browsing session may remove local projects; export a restorable project backup regularly.

The font preview loads uploaded font files through browser `FontFace`. Uploaded fonts are not automatically licensed for redistribution. Check each font's licence before adding it to a client package.

## Project structure

```text
src/
  app/                 Application shell, project dashboard and navigation
  components/          Shared interface primitives
  features/             Overview, assets, variations, colors, type, favicon, guidelines, export and settings
  services/             IndexedDB, file validation, SVG sanitization, PDF/ZIP and project backup
  types/                Project and asset types
  utils/                Color, project and download helpers
  styles.css            Design system and responsive layout
```

## Known limitations

- PDF source files are retained as project assets, but PDF rendering and conversion are not implemented. Import a PNG or SVG rendition when you need to preview or export that artwork.
- Logo composition changes (horizontal/stacked rearrangement) are not inferred. Import the designer-approved composition as a separate asset.
- SVG color conversion handles explicit fill/stroke attributes and inline declarations. Complex CSS selectors, external references, masks and advanced filter behavior may require manual review in a dedicated vector editor.
- Favicon ICO uses PNG payloads in a standards-compliant ICO container; very old clients that require DIB/BMP ICO entries may need a separate legacy conversion.
- PDF guideline content uses built-in PDF standard fonts. Custom uploaded fonts are documented and packaged when selected but are not embedded in the generated PDFs.
- Image processing is browser-native. Very large source artwork may be constrained by the device's available memory and canvas limits.
- Undo/redo covers edits made through the project workspace during the current session; it is not a complete multi-step image editor history.
- This is a client-only application. There is no cross-device sync or collaborative editing.

## Licence

Project source is provided for personal and commercial use by the repository owner. Third-party dependencies retain their respective licences.


## Build verification

The repository includes a GitHub Actions workflow that runs the TypeScript checks and Vite production build on pushes and pull requests to `main`.
