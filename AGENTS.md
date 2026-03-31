# AGENTS.md

## Project overview

This is a CSS style library that generates plain CSS from the Guardian's
`@guardian/source` React/Emotion component library. The generators extract
design tokens, theme values, and component styles from `@guardian/source` and
output standalone `.css` and `.scss` files that can be consumed without React or
Emotion.

The output is published as an npm package via the `dist/` directory.

## Repository structure

```
src/
  components/
    generate/       Component CSS generators (button, checkbox, icons, etc.)
    common.js       Shared utilities for component generators (esbuild bundling,
                    PostCSS pipeline, Emotion parsing)
    preview/        Vite-based preview app for visually testing components
      playground/   Web components for the interactive playground UI
  visuals/
    generate/       Visual token generators (colors, charts — CSS/SCSS/JS)
    common.js       Shared visuals utilities
    constants.js    Prefix constants for visuals CSS variables
  source/
    generate/       Source foundation generators (palette, typography, breakpoints, mq)
    common.js       Shared source utilities
    constants.js    Prefix constants for source CSS variables
  utils.js          Shared build utilities (paths, CSS formatting, generated comments)
  cli.js            CLI formatting helpers (ANSI colours, logGeneratedFiles)
  vite/             Vite plugin for purging unused CSS (exported to consumers)

scripts/
  build.sh          Full build: clean, generate, build indexes, copy JS, run tsc
  run-generators.js Imports all generators and runs them in parallel (single process)
  build-indexes.js  Builds all.css/all.scss barrel files by concatenating dist/ contents
  build-watch.js    File watcher that re-runs individual generators on change

dist/               Build output (components/, visuals/, source/, vite/)
```

## Build system

### Full build (`npm run build` / `./scripts/build.sh`)

1. Cleans `dist/`
2. Runs all generators in parallel via `scripts/run-generators.js`
3. Builds index files (`all.css`, `all.scss`) via `scripts/build-indexes.js`
4. Copies JS files that need `.d.ts` generation into `dist/`
5. Runs `tsc` to generate type declarations

### Generators

Each generator file in `src/*/generate/` exports a `generate()` function that:
- Returns `{ files: string[] }` — the list of files it wrote to `dist/`
- Is called by `run-generators.js`, which also handles logging via `logGeneratedFiles`

Files named `common.js` in generate directories are shared helpers, not generators.

### Component generators

Component generators use `loadContextFromPath` (in `src/components/common.js`)
to bundle `@guardian/source` module files with esbuild, execute them in a Node
VM context, and extract the style functions/theme objects. This avoids importing
React/Emotion at the top level.

`loadContextFromSource` is a variant that accepts source code as a string with a
resolve directory, used by the icons generator to bundle all icons in a single
esbuild call.

The CSS output is processed through PostCSS (nesting, autoprefixer, selector
deduplication) and Prettier before being written to disk.

### Watch mode (`npm run build-watch` / `node scripts/build-watch.js`)

- Uses `fs.watch` on generator directories
- Debounces rapid file system events (100ms per file)
- On change, dynamically imports and calls the changed generator's `generate()`
- Re-runs `build-indexes.js` only when visuals or source generators change
  (not for component generators)
- Uses cache-busting query strings on dynamic imports to bypass Node's module cache

## Preview app

The Vite dev server (`npm run components.dev`) serves `src/components/preview/`
with `publicDir` set to `dist/`. This means `dist/` contents are served at `/`,
so CSS is referenced as `/components/button.css` (not `/dist/components/...`).

The preview uses custom web components (`<component-playground>`,
`<icon-playground>`) for interactive demos with live class toggling.

## Key conventions

- Generator files must export `generate()` returning `{ files: string[] }`
- Generated CSS files include a comment header crediting the generating script
- CSS class names use the `src-` prefix (e.g. `.src-button`, `.src-checkbox`)
- CSS custom properties use prefixes defined in `constants.js` files
- The `all.css` barrel files concatenate actual CSS content (not `@import` statements),
  with per-file generated comments stripped
- The `all.scss` barrel files use `@use`/`@forward` with package-name paths

## npm package exports

The package exports map in `package.json` maps paths like
`interactive-style-library/components/*` to `dist/components/*`. The `dist/`
directory is the sole published artifact.
