# Numeric typography in headlines

Import `source/font-faces/headline-numeric.css` to unlock tabular figures, diagonal
fractions, and super/subscripts on the existing `.src-headline-*` classes.

```scss
// main.scss
@use "interactive-style-library/source/all" as *;
@use "interactive-style-library/source/font-faces/headline-numeric.css";
```

This imports a CSS file with `@font-face` declarations that override the article page's
stock *Headline* font declarations. These overrides load the same font, this font simply
supports a few numeric features enabled with CSS properties, like so.

```html
<table class="src-headline-bold-24" style="font-variant-numeric: tabular-nums lining-nums;">
  <tr><td>1,111</td></tr>
  <tr><td>8,888</td></tr>
  <tr><td>10,000</td></tr>
</table>

<p class="src-headline-bold-24" style="font-variant-numeric: diagonal-fractions;">
  Mix 1/2 cup with 3/4 cup
</p>
```

Or via the typography mixin in SCSS:

```scss
.results-table {
  @include src-headline-bold-24;
  font-variant-numeric: tabular-nums lining-nums;
}
```

| Feature                    | CSS                                       |
| -------------------------- | ----------------------------------------- |
| Lining figures             | `font-variant-numeric: lining-nums`       |
| Tabular figures            | `font-variant-numeric: tabular-nums`      |
| Diagonal fractions         | `font-variant-numeric: diagonal-fractions`|
| Superscript                | `font-variant-position: super`            |
| Subscript                  | `font-variant-position: sub`              |
| Scientific inferiors       | `font-feature-settings: "sinf"`           |
