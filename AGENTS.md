# AGENTS.md

## Project overview

This is a CSS style library that generates plain CSS from the Guardian's
`@guardian/source` React/Emotion component library. The generators extract
design tokens, theme values, and component styles from `@guardian/source` and
output standalone `.css` and `.scss` files (plus some `.js`/`.d.ts` token
modules) that can be consumed without React or Emotion.

The output is published as an npm package via the `dist/` directory.

## Repository structure

```
src/
  components/       Component CSS generators (button, checkbox, icons, etc.)
    preview/        Vite + Svelte app for visually testing components
  visuals/          Visual token generators (colors, charts, parties)
  source/           Source foundation generators (palette, typography,
                    breakpoints, mq, font-faces)
  vite/             Vite plugin for purging unused CSS (exported to consumers)

scripts/            Build orchestration (see Build system below)
dist/               Build output — the sole published artifact
```

Each token area (`components/`, `visuals/`, `source/`) follows the same layout:
a `generate/` directory of generators, a `common.js` of shared helpers, and
(for `visuals`/`source`) a `constants.js` of CSS-variable prefixes.

## Build system

### Full build (`npm run build` / `./scripts/build.sh`)

`build.sh` cleans `dist/`, runs all generators, builds the index barrel files,
copies the hand-written JS that needs type declarations into `dist/`, and runs
`tsc` to emit `.d.ts` files. Read `build.sh` for the exact sequence.

### Generators

Every generator lives in a `src/*/generate/` directory and exports a
`generate()` function returning `{ files: string[] }` — the list of files it
wrote to `dist/`. `scripts/run-generators.js` globs and runs them all in
parallel in a single process (excluding `common*` helper files), handling
logging via `logGeneratedFiles`.

Some token sets are emitted by more than one generator (e.g. visuals colors
have a `-css-scss` generator and a `-js` generator), and some generators emit
outputs into a sibling area (e.g. `source/generate/palette.js` produces the
`source/colors.*` files).

### Component generators

Component generators use helpers in `src/components/common.js`
(`loadContextFromPath` / `loadContextFromSource`) to bundle `@guardian/source`
module files with esbuild and execute them in a Node VM context, extracting the
style functions and theme objects. This avoids importing React/Emotion at the
top level. The resulting CSS is processed through PostCSS (nesting,
autoprefixer, selector deduplication) and Prettier before being written.

### Watch mode (`npm run build-watch`)

Watches the generator directories and re-runs the changed generator's
`generate()` on change, rebuilding the index files only when visuals or source
generators change.

## Preview app

`npm run components.dev` starts a Vite + Svelte dev server serving
`src/components/preview/` with `publicDir` set to `dist/`, so generated CSS is
referenced from the root (e.g. `/components/button.css`). The playground is a
set of Svelte components under `preview/playground/` providing interactive demos
with live class toggling.

## Key conventions

- Generator files export `generate()` returning `{ files: string[] }`
- Generated CSS files include a comment header crediting the generating script
- CSS class names use the `src-` prefix (e.g. `.src-button`, `.src-checkbox`)
- CSS custom properties use prefixes defined in the `constants.js` files
- `all.css` barrel files concatenate actual CSS content (with per-file generated
  comments stripped); `all.scss` barrel files use `@use`/`@forward`

## npm package exports

The `exports` map in `package.json` maps subpaths like
`interactive-style-library/components/*` and `.../visuals/colors` to files under
`dist/`, which is the sole published artifact.
