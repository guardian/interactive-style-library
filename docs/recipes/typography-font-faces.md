# Loading font faces

Typography classes and mixins (eg `src-article-17`) reference the Guardian's brand fonts by name: `font-family: GH Guardian
Headline;`, `font-family: GuardianTextEgyptian;`, etc.

For text to actually render as these fonts, matching [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
declarations have to exist in the page.

The CSS for these font face declarations can be found under `source/font-faces/`, like
`source/font-faces/headline.css`.

However, in most cases, **you shouldn't need to use these files in your project**. They aren't
included in the `source/all.css` and `source/all.scss` files for this reason.

## Why you probably don't need the font-faces files

This library is primarily built for atom developers like Visuals team, Editorial Design, and
Webex.

Atoms are embedded into article pages, and article pages **already load the brand fonts**,
meaning atoms don't need to include their own `@font-face` declarations.

> [!IMPORTANT]
> The article page **does not load the titlepiece font** by default. If your atom uses the
> `src-titlepiece` classes or mixins, you need to import the titlepiece font faces file. See below.

With this in mind, the `all.css` and `all.scss` files exclude the font face files, based on the
assumption that the host page provides the fonts.

## When you do need them

You'll need to include the font face files when building for environments that don't load Guardian
fonts by default, such as a standlone web page like an internal tool or microsite. 

## How to load them

Font faces live under `source/font-faces/`, split by family so you can load only what you need:

| File | Loads |
| ---- | ----- |
| `font-faces/titlepiece.css` | `GT Guardian Titlepiece` |
| `font-faces/headline.css` | `GH Guardian Headline` |
| `font-faces/headline-numeric.css` | An extended `GH Guardian Headline` font supporting lining numbers, fractions, etc. |
| `font-faces/text-egyptian.css` | `GuardianTextEgyptian` (body text) |
| `font-faces/text-sans.css` | `GuardianTextSans` |
| `font-faces/all.css` | all of the above, except `headline-numeric.css` |

With the `interactiveStyleLibrary` Vite plugin, add the files you need to `source`:

```js
interactiveStyleLibrary({
  source: ["typography.css", "font-faces/titlepiece.css"],
})
```

Or import them directly:

```scss
// A single family
@use "interactive-style-library/source/font-faces/titlepiece.css";

// Everything, eg. for a standalone page with no host fonts
@use "interactive-style-library/source/font-faces/all.css";
```

Plain CSS works too:

```css
@import "interactive-style-library/source/font-faces/titlepiece.css";
```

## Related

- [Simple brand typography](./typography-basic.md) — the classes and mixins these fonts back
- [Numeric typography in headlines](./typography-numeric-headlines.md) — a headline `@font-face`
  override for tabular figures, fractions, and more
