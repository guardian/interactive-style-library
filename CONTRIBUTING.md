# Contributing

This project generates plain CSS, SCSS, and JS files from the Guardian's
`@guardian/source` design system and Visuals design tokens.

If you want to add styles, fix a bug, or improve the output — this guide will get you set up.

## Getting started

Clone the repo and install dependencies.

```bash
git clone git@github.com:guardian/interactive-style-library.git
cd interactive-style-library
npm install
```

Then run a full build to populate the `dist/` directory with all of the generated files.

```bash
npm run build
```

## How the project is organised

This repo contains many _generator_ files: Node scripts that read design tokens from `@guardian/source`
or other references, transforms them, then creates CSS, SCSS, and JS files in `dist/`.

```
src/
  components/generate/   Generators for Source components (button, checkbox, etc.)
  visuals/generate/      Generators for Visuals design tokens (colours, charts, parties)
  source/generate/       Generators for Source foundations (palette, typography, breakpoints)

dist/                    Build output — this is what gets published
scripts/                 Build scripts (you shouldn't normally need to touch these)
```

See [src/visuals/generate/parties-js.js](./src/visuals/generate/parties-js.js) for a simple example.
This script reads a YAML design tokens file, then generates a JS file
([dist/visuals/parties.js](./dist/visuals/parties.js)).

See [src/source/generate/breakpoints.js](./src/source/generate/breakpoints.js) is another good
starter example.

## Development workflow

### Building

`npm run build` cleans `dist/`, runs every generator, and produces the final
CSS, SCSS, and JS output files. Run this whenever you want a clean slate.

### Watch mode

For day-to-day work, use watch mode instead. As you work, it'll re-run any generator that you make
changes to, so feedback is much faster.

```bash
npm run build-watch
```

### Preview app

The preview app lets you see components rendered in the browser with live
reloading. It serves the built CSS from `dist/`, so make sure you've run a
build (or have watch mode running) before starting it.

```bash
npm run components.dev
```

This starts a Vite dev server — open the URL it prints to view and interact
with the components.

## Making changes

### Changing generated design token files

Design token files live in `dist/source/` and `dist/visuals/` (palettes,
colours, typography, breakpoints, charts, parties, etc.).

For **Visuals** tokens, the generators read from YAML files in `src/visuals/`
(e.g. `figma-color-spec.yaml`, `figma-party-spec.yaml`). Often, editing the
YAML file is all you need to do — the generator will pick up the change and
update `dist/`.

For **Source** tokens (palette, typography, breakpoints), values are extracted
directly from `@guardian/source`. To change these, you'll likely need to edit the
generators directly, with style overrides or new classes.

If you need to change how the tokens are transformed or formatted, edit the
generator itself — open the output file in `dist/` and check the comment at the
top to find which generator produced it.

### Updating generated component styles

Component CSS files live in `dist/components/` (button, checkbox, select,
etc.). These are generated from `@guardian/source`'s React components.

1. Find the file you want to change in `dist/components/`.
2. Open it — the comment at the top tells you which generator produced it.
3. Start watch mode (`npm run build-watch`), then edit the generator to get the
   output you're after. Watch mode will re-run it and update `dist/` each time
   you save.
4. Check the output in the preview app (`npm run components.dev`).

### Adding a new generated file

Have a look at some existing generator files. Most of them follow the same pattern, you should be
able to copy or adapt existing code to get the job done.

Generator files must export a `generate` function that creates files under `dist/`, and returns a
list of paths for created files (eg. `return { files: [ createdJsPath, createdCssPath ]}`).

Any JavaScript file in a `generate` directory is considered a generator. New generators are detected
and run automatically once added.

## Conventions

### Naming

- Class names for components use the `src-` prefix (e.g. `.src-button`, `.src-checkbox`).
  Variants use a BEM-style modifier (e.g. `.src-button--secondary`, `.src-button--small`).
- Source CSS custom properties use the `--src-` prefix (e.g. `--src-brand-400`), defined in `src/source/constants.js`.
- Visuals CSS custom properties use the `--vis-` prefix (e.g. `--vis-news-main`), defined in `src/visuals/constants.js`.

### "All" files

"all" files exist for Visuals and Source styles: [`dist/source/all.css`](./dist/source/all.css), [`dist/source/all.scss`](./dist/source/all.scss), [`dist/visuals/all.css`](./dist/visuals/all.css), [`dist/visuals/all.scss`](./dist/visuals/all.scss).

These files let consumers bring everything into their projects with a single import.

The `all.css` files combine all of the CSS classes and variables, the `all.scss` files combine all
SCSS mixins _and_ CSS classes and variables.

These files are generated automatically by [`scripts/build-indexes.js`](./scripts/build-indexes.js).

If you don't want your generated CSS or SCSS file to be included in these "all" files, add them to
the exceptions list in this file.

### Generated file headers

Every generated file starts with a comment indicating which script produced it,
e.g. `/* This file is auto-generated by src/source/generate/palette.js */`.
This is added by calling `makeGeneratedComment(import.meta.url)` from
`src/utils.js`.

### Formatting

Generated files should be formatted with Prettier. Use `tidyCss` from
[`src/utils.js`](./src/utils.js) to do this job for you.

## Questions?

If something isn't clear or you get stuck, ask Ed Gargan (ed.gargan@guardian.co.uk), or ask in the
[Visuals and Data space](https://chat.google.com/room/AAAAGT-X7a8?cls=7). Contributions of all sizes are welcome.
