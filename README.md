# interactive-style-library

Guardian design tokens from Source and Visuals' design spec, bundled into CSS and SCSS files.

Just `@import "interactive-style-library/source/all.scss"` and go.

Files are generated directly from [@guardian/source](https://github.com/guardian/csnx/tree/main/libs/%40guardian/source) and [Visuals](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) design tokens.

## How to use

First install the package directly from GitHub (in time we'll publish it to NPM under the `@guardian` scope).

```bash
npm install -D git@github.com:guardian/interactive-style-library.git
```

To import all of the classes, variables, and SCSS utilities into your project, add the following
imports into your main SCSS file.

```scss
// main.scss
@use "interactive-style-library/source/all.scss" as *;
@use "interactive-style-library/visuals/all.scss" as *;
```

Then style your content like so.

```html
<h2 class="src-headline-medium-34" style="color: var(--src-brand--400)">
  Chip wreck! Thousands of chips wash ashore on beach
</h2>

<p class="src-article-15">
  Thousands of bags of chips have washed up on a beach in Sussex.
</p>

<p class="src-article-bold-15">
  The chips washed up near Eastbourne after several shipping containers
  containing "food and packaging" came ashore nearby earlier this week.
</p>
```

Read [**USAGE.md**](./docs/USAGE.md) for detailed installation and usage info, including
Svelte setup, and IDE autocompletion of classes, variables and mixins.

Read [**RECIPES.md**](./docs/RECIPES.md) for ready-to-use code snippets using Source and Visuals
styles.

## What's in the box

The interactive-style-library package provides Source and Visuals styles in a variety of formats.

### Source (from `@guardian/source`)

<table>
<tr>
<td>

🎨 [`palette.css`](./dist/source/palette.css)

</td>
<td>

🎨 [`palette.js`](./dist/source/palette.js)

</td>
<td>

🖋️ [`typography-classes.css`](./dist/source/typography-classes.css)

</td>
</tr>
<tr>
<td>

🖋️ [`typography-mixins.scss`](./dist/source/typography-mixins.scss)

</td>
<td>

📐 [`mq.scss`](./dist/source/mq.scss)

</td>
<td>

📐 [`breakpoints.scss`](./dist/source/breakpoints.scss)

</td>
</tr>
<tr>
<td>

📐 [`breakpoints.js`](./dist/source/breakpoints.js)

</td>
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

📊 [`charts-mixins.scss`](./dist/visuals/charts-mixins.scss)

</td>
</tr>
<tr>
<td>

📚 [`all.css`](./dist/visuals/all.css)

</td>
<td>

📚 [`all.scss`](./dist/visuals/all.scss)

</td>
</tr>
</table>
