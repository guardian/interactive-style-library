import * as fs from "fs"
import { getDistPath, camelToKebab, makeGeneratedComment } from "../../utils.js"

import { loadContext, getPathForGenerated } from "../common.js"
import { SOURCE_PREFIX } from "../constants.js"

export function generate() {
  const context = loadContext(getPathForGenerated("palette.js"))
  const palette = context.palette

  const cssVars = []

  for (const [category, shades] of Object.entries(palette)) {
    const kebabCategory = camelToKebab(category)
    for (const [shade, value] of Object.entries(shades)) {
      cssVars.push(`  --${SOURCE_PREFIX}-${kebabCategory}-${shade}: ${value};`)
    }
  }

  const css =
    `${makeGeneratedComment(import.meta.url)}` +
    `\n\n:root {\n${cssVars.join("\n")}\n}\n`

  const cssDistPath = getDistPath("source/colors.css")
  fs.writeFileSync(cssDistPath, css)

  const exports = Object.entries(palette)
    .map(
      ([category, shades]) =>
        `export const ${category} = /** @type {const} */ (${JSON.stringify(shades, null, 2)})\n`,
    )
    .join("\n")

  const js = `${makeGeneratedComment(import.meta.url)}\n\n${exports}`

  const jsDistPath = getDistPath("source/colors.js")
  fs.writeFileSync(jsDistPath, js)

  return {
    files: [cssDistPath, jsDistPath],
  }
}
