## Contents

- [Installation](#installation)
- [Using the package's files](#using-the-packages-files)
  - [Quick setup](#quick-setup)
  - [JavaScript files](#javascript-files)
  - [In Svelte projects](#in-svelte-projects)
  - [In React/Preact projects](#in-reactpreact-projects)
- [Purging unused styles](#purging-unused-styles)
  - [Setup](#setup)
  - [Unwanted purging: dynamic class names and variables](#unwanted-purging-dynamic-class-names-and-variables)

## Installation

Install `interactive-style-library` using your package manager of choice, like so.

```bash
# npm
npm install -D git@github.com:guardian/interactive-style-library.git

# pnpm
pnpm i -D 'github:guardian/interactive-style-library'
```

The package isn't yet published to NPM. For the time being, it must be installed directly from GitHub.

If these commands fail, check that you have [a valid SSH key added to your GitHub
account](https://docs.github.com/en/enterprise-cloud@latest/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account). If that's not the problem, reach out to ed.gargan@guardian.co.uk for help.

## Using the package's files

The package exports styles in CSS, SCSS, and JavaScript formats, so you can use them wherever suits your workflow: in stylesheets, component files, or programmatically in JS.

### Quick setup

Assuming your project can handle SCSS files, you can most easily access design tokens by importing
the `all.scss` files into your main SCSS.

```scss
// main.scss
@use "interactive-style-library/source/all.scss" as *;
@use "interactive-style-library/visuals/all.scss" as *;
```

This gives you access to all CSS variables, classes, and SCSS utilities from both Source and
Visuals:

<table>
<tr>
<th>In HTML</th>
<th>In CSS/SCSS</th>
</tr>
<tr>
<td>

<!-- prettier-ignore -->
```html
<h2
  class="src-headline-medium-34"
  style="color: var(--src-brand-400)">
  Chip wreck!
</h2>

<p class="src-article-17">
  Thousands of bags of chips have
  washed up on a beach in Sussex.
</p>
```

</td>
<td>

```scss
h2 {
  @include src-headline-medium-34;
  color: var(--src-brand-400);
}

p {
  @include src-article-17;
}
```

</td>
</tr>
</table>

Files for typography, colours, etc. tokens can be imported individually, if you don't need
_all styles_. See [design token files reference](./ALL-FILES.md) for a list of the available files.

> [!WARNING]
> Unless you [purge unused styles](#purge-unused-styles), every CSS variable and class declaration
> in `interactive-style-library` will end up in your final CSS file.

### JavaScript files

Most design tokens are available in JavaScript settings too, which can be imported like so.

```js
import { partyUk, palette } from "interactive-style-library/visuals/colors.js"

const politicsScale = scaleLinear()
  .domain([-50, 50])
  .range([partyUk.light.lab, palette.gray["2"], partyUk.light.reform])
```

### In Svelte projects

Follow the [Quick setup](#quick-setup) guide above, importing the `all.scss` files into your main SCSS file.

> [!NOTE]
> Alternatively you can import these `all.scss` files into your main Svelte component's `<script>`
> block with `import "interactive-style-library/visuals/all.scss"`.

This makes CSS classes and variables available in Svelte component's HTML and `<style>` blocks, and in CSS and SCSS files; and SCSS mixins available in any SCSS file.

To make SCSS mixins available in Svelte components, add a preprocessor to `svelte.config.js` that injects the SCSS resources as follows.

<blockquote>
<details>
<summary>Why do we need to do this?</summary>
Blah blah blah
</details>
</blockquote>

```js
// svelte.config.js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

export default {
  preprocess: [
    {
      style: ({ content }) => ({
        code:
          `@use "interactive-style-library/source/mq.scss" as *;\n` +
          `@use "interactive-style-library/source/typography-mixins.scss" as *;\n` +
          `@use "interactive-style-library/visuals/charts-mixins.scss" as *;\n` +
          content,
      }),
    },
    vitePreprocess(),
  ],
}
```

With this added, you can use mixins in Svelte `<style lang="scss">` blocks like so.

```svelte
<style lang="scss">
  h1 {
    @include src-headline-medium-28;
  }

  @include mq($from: desktop) {
    h1 {
      @include src-headline-medium-34;
    }
  }
</style>
```

### In React/Preact projects

> [!NOTE]
> TODO: fill this in

## Purging unused styles

When you import a CSS file like [`source/palette.css`](/dist/source/palette.css) or [`source/typography-classes.css`](/dist/source/typography-classes.css), you get _all_ the variables and classes it defines — most of which you probably won't use. This bloats your final CSS bundle.

To solve this, this package provides a Vite plugin that automatically removes unused `interactive-style-library`
styles from your production build. It scans your compiled HTML, CSS and JavaScript for references to
classes (`.src-*`, `.vis-*`) and CSS variables (`--src-*`, `--vis-*`), and strips out any that aren't used.

### Setup

Import the plugin and call it in your `vite.config.js`.

```js
// vite.config.js
import { defineConfig } from "vite"
import { purgeInteractiveStylesCss } from "interactive-style-library/vite"

export default defineConfig({
  plugins: [
    // ... your other plugins (svelte, etc.)

    // Add this plugin last, so it runs after other transforms
    purgeInteractiveStylesCss(),
  ],
})
```

The plugin only runs during production builds (`vite build`), not in dev mode.

### Unwanted purging: dynamic class names and variables

If you generate class names or CSS variable references dynamically, this plugin can't detect them,
and so their declarations will be purged.

```js
// Dynamic class names: plugin can't know which size will be used
const size = window.innerWidth > 600 ? 34 : 28
element.className = `src-headline-medium-${size}`

// Dynamic CSS variable: plugin can't know which party colour variable is used
const party = getChosenParty() // eg. "con", "lab"
element.style.color = `var(--vis-party-uk-${party})`
```

To stop the plugin from removing the intended classes and variables, add them to the plugin's
`safelist` parameter.

```js
purgeInteractiveStylesCss({
  safelist: [
    // Make sure src-headline-medium-28/34 aren't purged
    "src-headline-medium-28",
    "src-headline-medium-34",

    // Make sure all UK party CSS variable colors aren't purged
    /^--vis-party-uk-/,
  ],
})
```

Or, more simply, just make sure class names and variables appear **in-full** in your code, so the
plugin can detect them.

```js
element.className =
  window.innerWidth > 600 ? `src-headline-medium-34` : `src-headline-medium-28`

const party = getChosenParty() // eg. "con", "lab"
if (party === "con") {
  element.style.color = "--vis-party-uk-con"
} else if (party === "lab") {
  element.style.color = "--vis-party-uk-lab"
}
```
