## Contents

- [Installation](#installation)
- [Library contents](#library-contents)
  - [Source](#source)
  - [Visuals](#visuals)
  - [Components](#components)
- [Vite plugin setup](#vite-plugin-setup)
  - [Options](#options)
- [Purging unused styles](#purging-unused-styles)
- [JavaScript exports](#javascript-exports)
- [Direct imports (non-Vite projects)](#direct-imports-non-vite-projects)

## Installation

Install `interactive-style-library` using your package manager of choice.

```bash
# npm
npm install -D git@github.com:guardian/interactive-style-library.git

# pnpm
pnpm i -D 'github:guardian/interactive-style-library'
```

The package isn't yet published to NPM, so it must be installed directly from GitHub. If these
commands fail, check that you have [a valid SSH key added to your GitHub
account](https://docs.github.com/en/enterprise-cloud@latest/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account). If that's not the problem, reach out to ed.gargan@guardian.co.uk for help.

## Library contents

The library is split into three categories. See [ALL-FILES.md](./ALL-FILES.md) for the full list
of files in each.

### Source

Typography classes and mixins, colour variables, breakpoint utilities, and media query helpers —
derived from the [`@guardian/source`](https://github.com/guardian/csnx/tree/main/libs/%40guardian/source)
design system.

Use `src-` prefixed classes directly in your HTML, or SCSS mixins in your stylesheets.

```html
<h2 class="src-headline-medium-34" style="color: var(--src-brand-400)">
  Chip wreck! Thousands of chips wash ashore on beach
</h2>

<p class="src-article-15">
  Thousands of bags of chips have washed up on a beach in Sussex.
</p>
```

```scss
h2 {
  @include src-headline-medium-34;
  color: var(--src-brand-400);

  @include mq($from: desktop) {
    @include src-headline-medium-42;
  }
}
```

### Visuals

Colour tokens for charts and UK political parties, from the Visuals team's design spec. Available
as CSS custom properties with the `--vis-` prefix. `charts.scss` also provides SCSS mixins for
common chart elements.

```scss
.chart-title {
  @include vis-chart-headline;
}

path[data-team="Liverpool"] {
  stroke: var(--vis-news-red);
}
```

Find a more complete example in @[docs/RECIPES.md](./RECIPES.md).

### Components

CSS-only replicas of Source's UI elements — buttons, checkboxes, text inputs, and more — styled to
match the Guardian design system. Use `src-` prefixed classes in your HTML.

```html
<label for="email" class="src-label">
  Email address
  <div class="src-label__supporting">harpreet@example.com</div>
</label>
<input type="email" id="email" class="src-text-input" />

<button class="src-button src-button--secondary">Submit</button>
```

Each component supports variants via modifier classes (e.g. `src-button--small`,
`src-button--tertiary`). See each component's usage guide for available classes and examples —
[docs/components](./components/).

## Vite plugin setup

The easiest way to use the library is with the `useInteractiveStyles` plugin — it works with
Svelte, Preact, and any other Vite-based project.

Add it to your `vite.config.js` and list the files you need from each category.

```js
// vite.config.js
import { useInteractiveStyles } from "interactive-style-library/vite"

export default {
  plugins: [
    useInteractiveStyles({
      source: ["mq.scss", "typography.scss", "typography.css", "colors.css"],
      visuals: ["charts.scss", "colors.css"],
      components: ["button.css", "label.css", "text-input.css"],
    }),
  ],
}
```

The plugin handles the wiring automatically:

- **SCSS files** (`.scss`) are made available in every stylesheet and component — you can use
  mixins and variables without importing them in each file
- **CSS files** (`.css`) are injected into your entry stylesheet (`main.scss` by default)
- **Unused CSS** is purged from your production build automatically

### Options

<!-- prettier-ignore -->
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `string[]` | `[]` | Filenames from `dist/source/` to inject |
| `visuals` | `string[]` | `[]` | Filenames from `dist/visuals/` to inject |
| `components` | `string[]` | `[]` | Filenames from `dist/components/` to inject |
| `purge` | `boolean \| object` | `true` | `true` purges unused styles with defaults, `false` disables, or pass an options object (see [Purging unused styles](#purging-unused-styles)) |
| `entryScss` | `string` | `"main.scss"` | Filename of the entry stylesheet that CSS files are injected into. Change this if your entry stylesheet has a different filename. |

## Purging unused styles

When you import a CSS file like `source/colors.css` or `source/typography.css`, you get _all_ the
variables and classes it defines — most of which you probably won't use. The plugin removes unused
ones from your production build automatically (`purge: true` is the default).

It works by scanning your compiled HTML, CSS, and JavaScript for references to
`interactive-style-library` classes (`.src-*`, `.vis-*`) and CSS variables (`--src-*`, `--vis-*`),
and strips any that aren't found. It only runs during production builds (`vite build`), not in dev
mode.

### Dynamic class names and variables

If you generate class names or CSS variable references dynamically at runtime, the purger can't
detect them, and their declarations will be stripped.

```js
// Dynamic class name: purger can't know which size will be used
const size = window.innerWidth > 600 ? 34 : 28
element.className = `src-headline-medium-${size}`

// Dynamic CSS variable: purger can't know which party colour will be used
const party = getChosenParty() // e.g. "con", "lab"
element.style.color = `var(--vis-uk-${party})`
```

The simplest fix is to write class names and variable names in full somewhere in your code, so the
purger can find them.

```js
element.className =
  window.innerWidth > 600 ? "src-headline-medium-34" : "src-headline-medium-28"

const party = getChosenParty()
if (party === "con") {
  element.style.color = "var(--vis-uk-con)"
} else if (party === "lab") {
  element.style.color = "var(--vis-uk-lab)"
}
```

Alternatively, add them to the `safelist` option.

```js
useInteractiveStyles({
  source: ["typography.css"],
  visuals: ["colors.css"],
  purge: {
    safelist: [
      // Keep specific classes
      "src-headline-medium-28",
      "src-headline-medium-34",

      // Keep all UK party colour variables
      /^--vis-uk-/,
    ],
  },
})
```

### Using the purge plugin standalone

If you're not using `useInteractiveStyles` but still want to purge unused styles, the
`purgeInteractiveStylesCss` plugin is available as a separate export.

```js
import { purgeInteractiveStylesCss } from "interactive-style-library/vite"

export default {
  plugins: [
    purgeInteractiveStylesCss(),
    // or with options:
    purgeInteractiveStylesCss({ safelist: [/^--vis-uk-/] }),
  ],
}
```

## JavaScript exports

Most design tokens are also available as JavaScript objects, useful for scripts and data
visualisation.

```js
import { uk } from "interactive-style-library/visuals/parties.js"
import { palette } from "interactive-style-library/visuals/colors.js"

const politicsScale = scaleLinear()
  .domain([-50, 50])
  .range([uk.light.lab, palette.gray["2"], uk.light.reform])
```

## Direct imports (non-Vite projects)

If you're not using Vite, you can import the library's files directly into your stylesheets.

```scss
// main.scss
@use "interactive-style-library/source/mq.scss" as *;
@use "interactive-style-library/source/typography.scss" as *;
@use "interactive-style-library/source/typography.css";
@use "interactive-style-library/source/colors.css" as src-colors;
@use "interactive-style-library/visuals/charts.scss" as *;
@use "interactive-style-library/visuals/colors.css" as vis-colors;
```

If you `@use` both `source/colors.css` and `visuals/colors.css`, Sass will
complain about a naming collision. Add `as src-colors` / `as vis-colors` (as
above) to resolve it — the names themselves don't matter and aren't referenced
anywhere, they just need to differ. The `useInteractiveStyles` plugin handles
this for you.

Or use the `all.scss` barrel files to get everything at once (with a couple of exceptions — see
[ALL-FILES.md](./ALL-FILES.md)).

```scss
@use "interactive-style-library/source/all.scss" as *;
@use "interactive-style-library/visuals/all.scss" as *;
```
