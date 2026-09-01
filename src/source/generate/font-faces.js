/**
 * Copied directly from DCR (https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/lib/fonts-css.ts).
 *
 * These font-faces aren't available in Source itself.
 */

import * as fs from "fs"
import { getDistPath, makeGeneratedComment, tidyCss } from "../../utils.js"

const getFontUrl = (filePath) =>
  `https://assets.guim.co.uk/static/frontend/${filePath}`

// Each key maps to a font-faces/<key>.css file, and mirrors the family segment
// of the typography classes (`src-titlepiece`, `src-headline-*`, etc.).
const fontKeys = ["titlepiece", "headline", "text-egyptian", "text-sans"]

const HEADLINE_FAMILIES = ["GH Guardian Headline", "Guardian Egyptian Web"]

function fontFaceRule(font) {
  return `@font-face {
    font-family: "${font.family}";
    src: url(${getFontUrl(font.woff2)}) format("woff2"),
        url(${getFontUrl(font.woff)}) format("woff"),
        url(${getFontUrl(font.ttf)}) format("truetype");
    font-weight: ${font.weight};
    font-style: ${font.style};
    font-display: swap;
  }`
}

// The `full-not-hinted` headline build carries extra OpenType features for
// numeric typography. Include font-faces/headline-numeric.css *after* the
// article's (or headline.css's) rules so it overrides them.
function numericHeadlineRule(font) {
  const toFullPath = (filePath) =>
    filePath
      .replace("noalts-not-hinted", "full-not-hinted")
      .replace("latin1-not-hinted", "full-not-hinted")

  return fontFaceRule({
    ...font,
    woff2: toFullPath(font.woff2),
    woff: toFullPath(font.woff),
    ttf: toFullPath(font.ttf),
  })
}

async function writeFontFace(name, rules) {
  const css = await tidyCss(
    `${makeGeneratedComment(import.meta.url)}\n\n${rules}`,
  )
  const path = getDistPath(`source/font-faces/${name}.css`)
  fs.writeFileSync(path, css)
  return path
}

// Kept so existing imports of the old flat paths keep working. The rules are
// inlined rather than @imported so the file works via SCSS @use too.
async function writeDeprecatedAlias(oldName, newName, rules) {
  const css = await tidyCss(
    `${makeGeneratedComment(import.meta.url)}\n\n` +
      `/* Deprecated: use "font-faces/${newName}.css" instead. */\n\n` +
      rules,
  )
  const path = getDistPath(`source/${oldName}.css`)
  fs.writeFileSync(path, css)
  return path
}

export async function generate() {
  const files = []

  for (const key of fontKeys) {
    const rules = fontList
      .filter((font) => font.key === key)
      .map(fontFaceRule)
      .join("\n\n")

    files.push(await writeFontFace(key, rules))
  }

  const allRules = fontList.map(fontFaceRule).join("\n\n")
  files.push(await writeFontFace("all", allRules))

  const numericRules = fontList
    .filter((font) => HEADLINE_FAMILIES.includes(font.family))
    .map(numericHeadlineRule)
    .join("\n\n")
  files.push(await writeFontFace("headline-numeric", numericRules))

  files.push(await writeDeprecatedAlias("font-faces", "all", allRules))
  files.push(
    await writeDeprecatedAlias(
      "headline-numeric",
      "headline-numeric",
      numericRules,
    ),
  )

  return { files }
}

export const fontList = [
  // This titlepiece font isn't available in DCR's font-faces filea, this was copied from elsewhere
  {
    key: "titlepiece",
    family: "GT Guardian Titlepiece",
    woff2:
      "fonts/guardian-titlepiece/full-not-hinted/GTGuardianTitlepiece-Bold.woff2",
    woff: "fonts/guardian-titlepiece/full-not-hinted/GTGuardianTitlepiece-Bold.woff",
    ttf: "fonts/guardian-titlepiece/full-not-hinted/GTGuardianTitlepiece-Bold.ttf",
    weight: 700,
    style: "normal",
  },

  // GH Guardian Headline, with legacy family name of Guardian Egyptian Web
  {
    key: "headline",
    family: "GH Guardian Headline",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Light.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.ttf",
    weight: 300,
    style: "normal",
    uniqueName: "GHGuardianHeadline-Light",
  },
  {
    key: "headline",
    family: "Guardian Egyptian Web",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Light.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.ttf",
    weight: 300,
    style: "normal",
    uniqueName: "GuardianEgyptian-Light",
  },
  {
    key: "headline",
    family: "GH Guardian Headline",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-LightItalic.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.ttf",
    weight: 300,
    style: "italic",
    uniqueName: "GHGuardianHeadline-LightItalic",
  },
  {
    key: "headline",
    family: "Guardian Egyptian Web",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-LightItalic.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.ttf",
    weight: 300,
    style: "italic",
    uniqueName: "GuardianEgyptian-LightItalic",
  },
  {
    key: "headline",
    family: "GH Guardian Headline",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2",
    woff: "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Medium.ttf",
    weight: 500,
    style: "normal",
    uniqueName: "GHGuardianHeadline-Medium",
  },
  {
    key: "headline",
    family: "Guardian Egyptian Web",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2",
    woff: "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Medium.ttf",
    weight: 500,
    style: "normal",
    uniqueName: "GuardianEgyptian-Medium",
  },
  {
    key: "headline",
    family: "GH Guardian Headline",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.ttf",
    weight: 500,
    style: "italic",
    uniqueName: "GHGuardianHeadline-MediumItalic",
  },
  {
    key: "headline",
    family: "Guardian Egyptian Web",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.ttf",
    weight: 500,
    style: "italic",
    uniqueName: "GuardianEgyptian-MediumItalic",
  },
  {
    key: "headline",
    family: "GH Guardian Headline",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.ttf",
    weight: 700,
    style: "normal",
    uniqueName: "GHGuardianHeadline-Bold",
  },
  {
    key: "headline",
    family: "Guardian Egyptian Web",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.ttf",
    weight: 700,
    style: "normal",
    uniqueName: "GuardianEgyptian-Bold",
  },
  {
    key: "headline",
    family: "GH Guardian Headline",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-BoldItalic.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-BoldItalic.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-BoldItalic.ttf",
    weight: 700,
    style: "italic",
    uniqueName: "GHGuardianHeadline-BoldItalic",
  },
  {
    key: "headline",
    family: "Guardian Egyptian Web",
    woff2:
      "fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-BoldItalic.woff2",
    woff: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-BoldItalic.woff",
    ttf: "fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-BoldItalic.ttf",
    weight: 700,
    style: "italic",
    uniqueName: "GuardianEgyptian-BoldItalic",
  },
  // GuardianTextEgyptian, with legacy family name of Guardian Text Egyptian Web
  {
    key: "text-egyptian",
    family: "GuardianTextEgyptian",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2",
    woff: "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Regular.ttf",
    weight: 400,
    style: "normal",
    uniqueName: "GuardianTextEgyptian-Regular",
  },
  {
    key: "text-egyptian",
    family: "Guardian Text Egyptian Web",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2",
    woff: "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Regular.ttf",
    weight: 400,
    style: "normal",
    uniqueName: "GuardianTextEgyptianWeb-Regular",
  },
  {
    key: "text-egyptian",
    family: "GuardianTextEgyptian",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff2",
    woff: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.ttf",
    weight: 400,
    style: "italic",
    uniqueName: "GuardianTextEgyptian-RegularItalic",
  },
  {
    key: "text-egyptian",
    family: "Guardian Text Egyptian Web",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff2",
    woff: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.ttf",
    weight: 400,
    style: "italic",
    uniqueName: "GuardianTextEgyptianWeb-RegularItalic",
  },
  {
    key: "text-egyptian",
    family: "GuardianTextEgyptian",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2",
    woff: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.ttf",
    weight: 700,
    style: "normal",
    uniqueName: "GuardianTextEgyptian-Bold",
  },
  {
    key: "text-egyptian",
    family: "Guardian Text Egyptian Web",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2",
    woff: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.ttf",
    weight: 700,
    style: "normal",
    uniqueName: "GuardianTextEgyptianWeb-Bold",
  },
  {
    key: "text-egyptian",
    family: "GuardianTextEgyptian",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-BoldItalic.woff2",
    woff: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-BoldItalic.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-BoldItalic.ttf",
    weight: 700,
    style: "italic",
    uniqueName: "GuardianTextEgyptian-BoldItalic",
  },
  {
    key: "text-egyptian",
    family: "Guardian Text Egyptian Web",
    woff2:
      "fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-BoldItalic.woff2",
    woff: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-BoldItalic.woff",
    ttf: "fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-BoldItalic.ttf",
    weight: 700,
    style: "italic",
    uniqueName: "GuardianTextEgyptianWeb-BoldItalic",
  },
  // GuardianTextSans, with legacy family name of Guardian Text Sans Web
  {
    key: "text-sans",
    family: "GuardianTextSans",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2",
    woff: "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Regular.ttf",
    weight: 400,
    style: "normal",
    uniqueName: "GuardianTextSans-Regular",
  },
  {
    key: "text-sans",
    family: "Guardian Text Sans Web",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2",
    woff: "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Regular.ttf",
    weight: 400,
    style: "normal",
    uniqueName: "GuardianTextSansWeb-Regular",
  },
  {
    key: "text-sans",
    family: "GuardianTextSans",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-RegularItalic.woff2",
    woff: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.ttf",
    weight: 400,
    style: "italic",
    uniqueName: "GuardianTextSans-RegularItalic",
  },
  {
    key: "text-sans",
    family: "Guardian Text Sans Web",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-RegularItalic.woff2",
    woff: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.ttf",
    weight: 400,
    style: "italic",
    uniqueName: "GuardianTextSansWeb-RegularItalic",
  },
  {
    key: "text-sans",
    family: "GuardianTextSans",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff2",
    woff: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.ttf",
    weight: 700,
    style: "normal",
    uniqueName: "GuardianTextSans-Bold",
  },
  {
    key: "text-sans",
    family: "Guardian Text Sans Web",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff2",
    woff: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.ttf",
    weight: 700,
    style: "normal",
    uniqueName: "GuardianTextSansWeb-Bold",
  },
  {
    key: "text-sans",
    family: "GuardianTextSans",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-BoldItalic.woff2",
    woff: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-BoldItalic.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-BoldItalic.ttf",
    weight: 700,
    style: "italic",
    uniqueName: "GuardianTextSans-BoldItalic",
  },
  {
    key: "text-sans",
    family: "Guardian Text Sans Web",
    woff2:
      "fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-BoldItalic.woff2",
    woff: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-BoldItalic.woff",
    ttf: "fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-BoldItalic.ttf",
    weight: 700,
    style: "italic",
    uniqueName: "GuardianTextSansWeb-BoldItalic",
  },
]
