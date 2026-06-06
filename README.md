# Interactive style library

Guardian design tokens and CSS-only components from Source and Visuals' design spec, bundled into CSS, SCSS, and JS files.

Files are generated directly from [@guardian/source](https://github.com/guardian/csnx/tree/main/libs/%40guardian/source) and [Visuals](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) design tokens.

## How to use

First install the package directly from GitHub (in time we'll publish it to NPM under the `@guardian` scope).

```bash
npm install -D git@github.com:guardian/interactive-style-library.git
```

The library is split into separate stylesheets – typography, colours, breakpoints, etc.
– letting you pick only what you need.

In Vite projects, add the `useInteractiveStyles` plugin to your `vite.config.js` and list the
ones you'd like to use.

```js
import { useInteractiveStyles } from "interactive-style-library/vite"

export default {
  plugins: [
    useInteractiveStyles({
      source: ["mq.scss", "typography.scss", "typography.css", "colors.css"],
      components: ["label.css", "text-input.css"],
    }),
  ],
}
```

CSS classes and variables are injected into your entry stylesheet (`main.scss` by default), and SCSS mixins and variables are available in every `.scss` file without explicit imports. Unused CSS is purged automatically.

Then, style your content like so.

```html
<h2 class="src-headline-medium-34" style="color: var(--src-brand-400)">
  Chip wreck! Thousands of chips wash ashore on beach
</h2>

<p class="src-article-15">
  Thousands of bags of chips have washed up on a beach in Sussex.
</p>

<label for="feedback" class="src-label">Have your say</label>
<input id="feedback" class="src-text-input" />
```

CSS and SCSS files can be imported directly if you'd prefer, or if you're not using Vite.
JavaScript exports of design tokens (colours, breakpoints) are also available.

Find more info in [**USAGE.md**](./docs/USAGE.md): framework setup, configuration options, and other ways to use the library

## What's in the box

The library provides Source and Visuals styles, and CSS-only components, in a variety of formats.

### Source (from `@guardian/source`)

<table>
<tr>
<td>

🎨 [`colors.css`](./dist/source/colors.css)

</td>
<td>

🎨 [`palette.js`](./dist/source/palette.js)

</td>
<td>

🖋️ [`typography.css`](./dist/source/typography.css)

</td>
</tr>
<tr>
<td>

🖋️ [`typography.scss`](./dist/source/typography.scss)

</td>
<td>

🖋️ [`font-faces.css`](./dist/source/font-faces.css)

</td>
<td>

🖋️ [`headline-numeric.css`](./dist/source/headline-numeric.css)

</td>
</tr>
<tr>
<td>

📐 [`mq.scss`](./dist/source/mq.scss)

</td>
<td>

📐 [`breakpoints.scss`](./dist/source/breakpoints.scss)

</td>
<td>

📐 [`breakpoints.js`](./dist/source/breakpoints.js)

</td>
</tr>
<tr>
<td>

📚 [`all.css`](./dist/source/all.css)

</td>
<td>

📚 [`all.scss`](./dist/source/all.scss)

</td>
</tr>
</table>

### Visuals

<table>
<tr>
<td>

🎨 [`colors.css`](./dist/visuals/colors.css)

</td>
<td>

🎨 [`colors-light.css`](./dist/visuals/colors-light.css)

</td>
<td>

🎨 [`colors-dark.css`](./dist/visuals/colors-dark.css)

</td>
</tr>
<tr>
<td>

🎨 [`colors.js`](./dist/visuals/colors.js)

</td>
<td>

📊 [`charts.css`](./dist/visuals/charts.css)

</td>
<td>

📊 [`charts.scss`](./dist/visuals/charts.scss)

</td>
</tr>
<tr>
<td>

🗳️ [`parties.css`](./dist/visuals/parties.css)

</td>
<td>

🗳️ [`parties-light.css`](./dist/visuals/parties-light.css)

</td>
<td>

🗳️ [`parties-dark.css`](./dist/visuals/parties-dark.css)

</td>
</tr>
<tr>
<td>

🗳️ [`parties.js`](./dist/visuals/parties.js)

</td>
<td>

📚 [`all.css`](./dist/visuals/all.css)

</td>
<td>

📚 [`all.scss`](./dist/visuals/all.scss)

</td>
</tr>
</table>

### Components (from `@guardian/source`)

CSS-only versions of Source's React components. See each component's individual guide ([docs/components](./docs/components/)) for usage and variants.

<table>
<tr>
<td>

🎨 [`button.css`](./dist/components/button.css)

</td>
<td>

🎨 [`checkbox.css`](./dist/components/checkbox.css)

</td>
<td>

🎨 [`icon.css`](./dist/components/icon.css)

</td>
</tr>
<tr>
<td>

🎨 [`label.css`](./dist/components/label.css)

</td>
<td>

🎨 [`select.css`](./dist/components/select.css)

</td>
<td>

🎨 [`spinner.css`](./dist/components/spinner.css)

</td>
</tr>
<tr>
<td>

🎨 [`text-input.css`](./dist/components/text-input.css)

</td>
<td>

🎨 [`toggle.css`](./dist/components/toggle.css)

</td>
</tr>
</table>

## But why?

The Source design system ([`@guardian/source`](https://github.com/guardian/csnx/tree/main/libs/%40guardian/source)) provides design tokens and UI components, but they're only available to projects using React and `@emotion/react`, a CSS-in-JS framework. Projects not using React — Svelte, plain HTML, or otherwise — can't easily access Source's colours, typography, or components.

This package re-exports Source's design tokens as CSS variables, classes, and SCSS mixins, and its
React components (Button, TextInput, Checkbox, etc.) as simplified CSS-only equivalents.

While this work could have been done in `@guardian/source` itself ([we had a go!](https://github.com/guardian/csnx/pull/2195#issuecomment-3641464486)), keeping this code in a separate repo gives us the freedom to include documentation and utilities specific to interactives developers' workflow.

We can also include styles outside of Source: like the Visuals team's design tokens!

> [!NOTE]
> The [Design Systems team](https://chat.google.com/room/AAQABZY0BtU?cls=7) is working on a project
> to overhaul the Guardian's design tokens solution, which when ready, will likely succeed some or
> all of this work. Stay tuned.

## Contributing

Want to add styles, fix a bug, or improve the output? See [**CONTRIBUTING.md**](./CONTRIBUTING.md) for the full guide.

How this project works, briefly: the `src/` directory contains generator scripts that extract styles from `@guardian/source` and Visuals design specs, and create CSS, SCSS, and JS files in `dist/`.

### Build commands

```bash
npm run build           # Full clean build — generates everything into dist/
npm run build-watch     # When running, changed generators are re-run automatically
npm run components.dev  # Preview app — see components in the browser
```

## More information

Find more information and instructions in this project's documentation.

<table>
<tr>
<td>

[**USAGE.md**](./docs/USAGE.md)

</td>
<td>
Full usage instructions, how to import styles into your project (including Svelte and React)

<tr>
<td>

[**RECIPES.md**](./docs/RECIPES.md)

</td>
<td>
Ready-to-use examples of HTML, SCSS, JavaScript, Svelte, etc. that use these styles
</td>
</tr>

<tr>
<td>

[**IDE-SETUP.md**](./docs/IDE-SETUP.md)

</td>
<td>
How to set up your IDE so it auto-completes CSS classes and variables, and SCSS mixins
</td>
</tr>

<tr>
<td>

[**ALL-FILES.md**](./docs/ALL-FILES.md)

</td>
<td>
A full list of all files provided by this package and what they do.
</td>
</tr>
</table>
