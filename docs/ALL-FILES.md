# Files reference

The following tables list every file exported by `interactive-style-library`.

The filenames in the Source and Visuals tables are what you pass to `source` and `visuals` in the
[`useInteractiveStyles` Vite plugin](./USAGE.md).

They can also be imported directly using the paths `interactive-style-library/source/*`,
`interactive-style-library/visuals/*`, and `interactive-style-library/components/*`.

## Source

<!-- prettier-ignore -->
| File | Description | Reference |
| ---- | ----------- | --------- |
| 🎨 [`colors.css`](../dist/source/colors.css) | CSS variables for Source's colour palette | [Source: Core palette](https://zeroheight.com/2a1e5182b/p/71fb50-colour/b/399c59) |
| 🎨 [`colors.js`](../dist/source/colors.js) | JS object of Source's colour palette | [Source: Core palette](https://zeroheight.com/2a1e5182b/p/71fb50-colour/b/399c59) |
| 🖋️ [`typography.css`](../dist/source/typography.css) | CSS classes for typography presets | [Source: Typography presets](https://zeroheight.com/2a1e5182b/p/01555f-typography-presets) |
| 🖋️ [`typography.scss`](../dist/source/typography.scss) | SCSS mixins for typography presets | [Source: Typography presets](https://zeroheight.com/2a1e5182b/p/01555f-typography-presets) |
| 🖋️ [`font-faces.css`](../dist/source/font-faces.css) | `@font-face` decls. for typography classes, adapted from [dotcom-rendering](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/lib/fonts-css.ts) | [Source: Typography presets](https://zeroheight.com/2a1e5182b/p/01555f-typography-presets) |
| 🖋️ [`headline-numeric.css`](../dist/source/headline-numeric.css) | `@font-face` overrides for `GH Guardian Headline` with OpenType numeric features (tabular figures, fractions, super/subscripts) | |
| 📐 [`mq.scss`](../dist/source/mq.scss) | [sass-mq](https://github.com/sass-mq/sass-mq) setup with Source breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |
| 📐 [`breakpoints.scss`](../dist/source/breakpoints.scss) | SCSS map of responsive breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |
| 📐 [`breakpoints.js`](../dist/source/breakpoints.js) | JS object with Source breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |
| 📚 [`all.css`](../dist/source/all.css) | All Source CSS resources _(excl. font faces)_ | |
| 📚 [`all.scss`](../dist/source/all.scss) | All Source CSS + SCSS resources _(excl. font faces and breakpoints)_ | |

## Visuals

<!-- prettier-ignore -->
| File | Description | Reference | 
| ---- | ----------- | --------- |
| 🎨 [`colors.css`](../dist/visuals/colors.css) | CSS varibles for combined light and dark colours | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 🎨 [`colors-light.css`](../dist/visuals/colors-light.css) | CSS variables for light theme colours only | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 🎨 [`colors-dark.css`](../dist/visuals/colors-dark.css) | CSS variables for dark theme colours only | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 🎨 [`colors.js`](../dist/visuals/colors.js) | JS object of light and dark colours | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 📊 [`charts.css`](../dist/visuals/charts.css) | CSS resources for chart structure and typography | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=1102-323&p=f&t=ycHjdCdLmgXxZWh7-0) |
| 📊 [`charts.scss`](../dist/visuals/charts.scss) | SCSS mixins for chart structure and typography | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=1102-323&p=f&t=ycHjdCdLmgXxZWh7-0) |
| 🗳️ [`parties.css`](../dist/visuals/parties.css) | CSS variables for combined light and dark party colours | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=2527-2&t=RbwK8XSqGwU6nnm7-0) |
| 🗳️ [`parties-light.css`](../dist/visuals/parties-light.css) | CSS variables for light theme party colours only | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=2527-2&t=RbwK8XSqGwU6nnm7-0) |
| 🗳️ [`parties-dark.css`](../dist/visuals/parties-dark.css) | CSS variables for dark theme party colours only | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=2527-2&t=RbwK8XSqGwU6nnm7-0) |
| 🗳️ [`parties.js`](../dist/visuals/parties.js) | JS object of light and dark party colours | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=2527-2&t=RbwK8XSqGwU6nnm7-0) |
| 📚 [`all.css`](../dist/visuals/all.css) | All Visuals CSS resources | |
| 📚 [`all.scss`](../dist/visuals/all.scss) | All Visuals CSS and SCSS resources | |

## Components

CSS-only versions of Source's React components. See each component's README for usage and variants.

<!-- prettier-ignore -->
| File | Description | Usage | Reference |
| ---- | ----------- | ----- | --------- |
| [`button.css`](../dist/components/button.css) | Button styles (primary, secondary, etc.) | [BUTTON.md](./components/BUTTON.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-button--docs) |
| [`checkbox.css`](../dist/components/checkbox.css) | Checkbox styles with custom tick animation | [CHECKBOX.md](./components/CHECKBOX.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-checkbox--docs) | 
| [`icon.css`](../dist/components/icon.css) | Icon library with all Source icons | [ICONS.md](./components/ICONS.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-icons--docs) |
| [`label.css`](../dist/components/label.css) | Label styles with optional and supporting text | [LABEL.md](./components/LABEL.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-label--docs) |
| [`select.css`](../dist/components/select.css) | Select/dropdown styles | [SELECT.md](./components/SELECT.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-select--docs) |
| [`spinner.css`](../dist/components/spinner.css) | Loading spinner styles | [SPINNER.md](./components/SPINNER.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-spinner--docs) |
| [`text-input.css`](../dist/components/text-input.css) | Text input field styles | [TEXT-INPUT.md](./components/TEXT-INPUT.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-textinput--docs) |
| [`toggle.css`](../dist/components/toggle.css) | Text input field styles | [TOGGLE.md](./components/TOGGLE.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source-development-kitchen_react-components-toggleswitch--docs) |
