# Loading font faces

The typography classes and mixins reference the Guardian's brand fonts by name — `GH Guardian
Headline`, `GuardianTextEgyptian`, `GuardianTextSans`, and `GT Guardian Titlepiece`.

For text to actually render in those fonts, matching
[`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) declarations have to be
present on the page.

## Why aren't they in the `all` files?

They're deliberately left out of `source/all.css` and `source/all.scss`.

This library is primarily built for atom developers, like Visuals, Editorial Design, and Webex.
Atoms are embedded into article pages, and article pages **already load the brand fonts**, meaning
atoms don't need to bring along their own `@font-face` declarations.

So for the "all" files, the assumption is _"the host page provides the fonts."_

## When you do need them

You'll need to include `@font-face` declarations in environments that don't load them for you, such
as:
- a standalone page or embed outside an article (a microsite, an `<iframe>`, a preview tool)
- local development, where you're viewing the atom in isolation
- the `GT Guardian Titlepiece` font specifically, which article pages actually **don't** load — so any atom
  using `.src-titlepiece-*` must bring it along, wherever it's embedded

## How to load them

Font faces live under `source/font-faces/`, split by family so you can load only what you need:

| File | Loads |
| ---- | ----- |
| `font-faces/titlepiece.css` | `GT Guardian Titlepiece` |
| `font-faces/headline.css` | `GH Guardian Headline` |
| `font-faces/text-egyptian.css` | `GuardianTextEgyptian` (body text) |
| `font-faces/text-sans.css` | `GuardianTextSans` |
| `font-faces/all.css` | all of the above |

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
