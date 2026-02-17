import * as fs from "fs"
import {
  getDistPath,
  camelToKebab,
  makeGeneratedComment,
} from "../../utils.js"
import { logGeneratedFiles } from "../../cli.js"
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

  const cssDistPath = getDistPath("source/palette.css")
  fs.writeFileSync(cssDistPath, css)

  // Generate palette JS with const type assertion for literal types
  const js =
    `${makeGeneratedComment(import.meta.url)}\n\n` +
    `export const palette = /** @type {const} */ (${JSON.stringify(palette, null, 2)})\n`

  const jsDistPath = getDistPath("source/palette.js")
  fs.writeFileSync(jsDistPath, js)

  return {
    files: [cssDistPath, jsDistPath],
  }
}

const { files } = generate()
logGeneratedFiles(import.meta.filename, files)
