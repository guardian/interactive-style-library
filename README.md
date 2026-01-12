# interactive-style-library

Guardian design tokens from Source and Visuals' design spec, bundled into CSS and SCSS files.

Just `@import "interactive-style-library/source/palette.scss";` and go.

Files are generated directly from [@guardian/source](https://github.com/guardian/csnx/tree/main/libs/%40guardian/source) and [Visuals](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) design tokens.

## Installation

```bash
npm install -D git@github.com:guardian/interactive-style-library.git
```

The package is installed directly from GitHub for now. In time, we can publish it to NPM under the
`@guardian` scope.

## How to use

For detailed usage instructions, covering usage with Svelte and Vite, read the full usage guide _(TODO)_.

Plain `.css` files (eg. [`./dist/source/palette.css`](./dist/source/palette.css)) should be imported into your root CSS/SCSS file.

```css
@import "interactive-style-library/source/palette.scss";
@import "interactive-style-library/source/typography-classes.css";

h2 {
  color: var(--src-brand-400);
}
```

`.scss` files provide mixins and SCSS variables. To use them in your SCSS files, import them like so.

```scss
@use "interactive-style-library/source/typography-mixins.scss" as *;
@use "interactive-style-library/visuals/breakpoints.scss" as *;

h2 {
  @include src-article-15;
}
```

## Exports

### Source (from `@guardian/source`)

<!-- prettier-ignore -->
| File | Description | Reference |
| ---- | ----------- | --------- |
| `source/palette.css` | CSS custom properties for all palette colours | [Source: Core palette](https://zeroheight.com/2a1e5182b/p/71fb50-colour/b/399c59) |
| `source/typography-classes.css` | CSS classes for typography presets | [Source: Typography presets](https://zeroheight.com/2a1e5182b/p/01555f-typography-presets) |
| `source/typography-mixins.scss` | SCSS mixins for typography presets | [Source: Typography presets](https://zeroheight.com/2a1e5182b/p/01555f-typography-presets) |
| `source/breakpoints.scss` | SCSS map of responsive breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |
| `source/mq.scss` | [sass-mq](https://github.com/sass-mq/sass-mq) (ie. `@include mq()`) setup with Source breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |

### Visuals

<!-- prettier-ignore -->
| File | Description | Reference | 
| ---- | ----------- | --------- |
| `visuals/colors.css` | Combined light and dark theme colour variables. Dark variables loaded according to DCAR dark-mode attributes on `:root`. | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| `visuals/colors-light.css` | Light theme colour variables only | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| `visuals/colors-dark.css` | Dark theme colour variables only | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |

## Contributing

### Repo structure

```
src/
├── source/
│   └── generate/                 # Generators for Source-derived styles
│       ├── breakpoints-scss.js
│       ├── palette-css-vars.js
│       └── ...
└── visuals/
    └── generate/                 # Generators for Visuals styles
        ├── colors-css-vars.js
        └── ...
dist/                     # Generated output
scripts/
└── run-generators.js     # Build script that runs all generators
```

### How it works

Each file in `src/**/generate/*.js` is a generator script that:

1. Loads data from Source or Visuals' design spec
2. Transforms it into CSS/SCSS
3. Writes the output to `dist/`

The build script (`npm run build`) discovers and runs all generator files automatically.
