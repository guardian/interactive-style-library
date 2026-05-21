/**
 * Overrides the "GH Guardian Headline" / "Guardian Egyptian Web" @font-face
 * declarations supplied by the article page with the `full-not-hinted` font
 * files, which carry additional OpenType features for numeric typography.
 *
 * Available features (access via `font-variant-numeric`, `font-variant-position`,
 * or `font-feature-settings`):
 *   - lnum  lining figures           font-variant-numeric: lining-nums
 *   - tnum  tabular figures          font-variant-numeric: tabular-nums
 *   - frac  diagonal fractions       font-variant-numeric: diagonal-fractions
 *   - sups  superscript              font-variant-position: super
 *   - subs  subscript                font-variant-position: sub
 *   - sinf  scientific inferiors     font-feature-settings: "sinf"
 *   - case  case-sensitive forms     font-feature-settings: "case"
 *
 * Consumers opt in by importing `dist/source/headline-numeric.css`; this file
 * is not included in `all.css`. Because @font-face resolution picks the
 * latest-declared rule for a given family+weight+style, the consumer's
 * stylesheet must be parsed after the article's font-face block.
 */

import * as fs from "fs"
import { getDistPath, makeGeneratedComment, tidyCss } from "../../utils.js"
import { fontList } from "./font-faces.js"

const HEADLINE_FAMILIES = ["GH Guardian Headline", "Guardian Egyptian Web"]

function toFullPath(filePath) {
  return filePath
    .replace("noalts-not-hinted", "full-not-hinted")
    .replace("latin1-not-hinted", "full-not-hinted")
}

export async function generate() {
  const getFontUrl = (filePath) =>
    `https://assets.guim.co.uk/static/frontend/${filePath}`

  const fontFaceCss = fontList
    .filter((font) => HEADLINE_FAMILIES.includes(font.family))
    .map(
      (font) => `@font-face {
    font-family: "${font.family}";
    src: url(${getFontUrl(toFullPath(font.woff2))}) format("woff2"),
        url(${getFontUrl(toFullPath(font.woff))}) format("woff"),
        url(${getFontUrl(toFullPath(font.ttf))}) format("truetype");
    font-weight: ${font.weight};
    font-style: ${font.style};
    font-display: swap;
  }`,
    )
    .join("\n\n")

  let css = `${makeGeneratedComment(import.meta.url)}\n\n${fontFaceCss}`
  css = await tidyCss(css)

  const distPath = getDistPath("source/headline-numeric.css")
  fs.writeFileSync(distPath, css)

  return {
    files: [distPath],
  }
}
