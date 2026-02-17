# Files reference

The following tables list every file exported by `interactive-style-library`.

Source files are imported with the path `interactive-style-library/source/*`, Visuals files with
`interactive-style-library/visuals/*`, and component files with
`interactive-style-library/components/*`.

## Source

<!-- prettier-ignore -->
| File | Description | Reference |
| ---- | ----------- | --------- |
| 🎨 [`source/palette.css`](./dist/source/palette.css) | CSS variables for Source's colour palette | [Source: Core palette](https://zeroheight.com/2a1e5182b/p/71fb50-colour/b/399c59) |
| 🎨 [`source/palette.js`](./dist/source/palette.js) | JS object of Source's colour palette | [Source: Core palette](https://zeroheight.com/2a1e5182b/p/71fb50-colour/b/399c59) |
| 🖋️ [`source/typography-classes.css`](./dist/source/typography-classes.css) | CSS classes for typography presets | [Source: Typography presets](https://zeroheight.com/2a1e5182b/p/01555f-typography-presets) |
| 🖋️ [`source/typography-mixins.scss`](./dist/source/typography-mixins.scss) | SCSS mixins for typography presets | [Source: Typography presets](https://zeroheight.com/2a1e5182b/p/01555f-typography-presets) |
| 📐 [`source/mq.scss`](./dist/source/mq.scss) | [sass-mq](https://github.com/sass-mq/sass-mq) setup with Source breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |
| 📐 [`source/breakpoints.scss`](./dist/source/breakpoints.scss) | SCSS map of responsive breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |
| 📐 [`source/breakpoints.js`](./dist/source/breakpoints.js) | JS object with Source breakpoints | [Source: Grids (web)](https://zeroheight.com/2a1e5182b/p/41be19-grids-web) |
| 📚 [`source/all.css`](./dist/source/all.css) | All Source CSS resources | |
| 📚 [`source/all.scss`](./dist/source/all.scss) | All Source CSS and SCSS resources | |

## Visuals

<!-- prettier-ignore -->
| File | Description | Reference | 
| ---- | ----------- | --------- |
| 🎨 [`visuals/colors.css`](./dist/visuals/colors.css) | CSS varibles for combined light and dark colours | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 🎨 [`visuals/colors-light.css`](./dist/visuals/colors-light.css) | CSS variables for light theme colours only | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 🎨 [`visuals/colors-dark.css`](./dist/visuals/colors-dark.css) | CSS variables for dark theme colours only | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 🎨 [`visuals/colors.js`](./dist/visuals/colors.js) | JS object of light and dark colours | [Visuals Color guide 2025](https://www.figma.com/design/lQ8KHxsb8xIJaMujuJV9dr/Colour-guide-2025?node-id=0-1&p=f&t=0ThLMx10HCgM8IMZ-0) |
| 📊 [`visuals/charts.css`](./dist/visuals/charts.css) | CSS resources for chart structure and typography | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=1102-323&p=f&t=ycHjdCdLmgXxZWh7-0) |
| 📊 [`visuals/charts-mixins.scss`](./dist/visuals/charts.css) | SCSS mixins for chart structure and typography | [Style guide colour original](https://www.figma.com/design/RZHnmwc2tmB6j1k4bNtyND/Style-guide-colour-original?node-id=1102-323&p=f&t=ycHjdCdLmgXxZWh7-0) |
| 📚 [`visuals/all.css`](./dist/visuals/all.css) | All Visuals CSS resources | |
| 📚 [`visuals/all.scss`](./dist/visuals/all.scss) | All Visuals CSS and SCSS resources | |

## Components

CSS-only versions of Source's React components. See each component's README for usage and variants.

<!-- prettier-ignore -->
| File | Description | Usage | Reference |
| ---- | ----------- | ----- | --------- |
| [`components/button.css`](../dist/components/button.css) | Button styles (primary, secondary, etc.) | [README](../src/components/generate/button/README.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-button--docs) |
| [`components/checkbox.css`](../dist/components/checkbox.css) | Checkbox styles with custom tick animation | [README](../src/components/generate/checkbox/README.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-checkbox--docs) | 
| [`components/icon.css`](../dist/components/icon.css) | Icon library with all Source icons | [README](../src/components/generate/icons/README.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-icons--docs) |
| [`components/label.css`](../dist/components/label.css) | Label styles with optional and supporting text | [README](../src/components/generate/label/README.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-label--docs) |
| [`components/select.css`](../dist/components/select.css) | Select/dropdown styles | [README](../src/components/generate/select/README.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-select--docs) |
| [`components/spinner.css`](../dist/components/spinner.css) | Loading spinner styles | [README](../src/components/generate/spinner/README.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-spinner--docs) |
| [`components/text-input.css`](../dist/components/text-input.css) | Text input field styles | [README](../src/components/generate/text-input/README.md) | [Storybook](https://guardian.github.io/storybooks/?path=/docs/source_react-components-textinput--docs) |
