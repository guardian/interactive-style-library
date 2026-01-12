import * as fs from "fs"
import {
  getDistPath,
  camelToKebab,
  logGeneratedFiles,
  makeGeneratedComment,
} from "../../utils.js"
import { loadContext, getPathForGenerated } from "../utils.js"
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

  const distPath = getDistPath("source/palette.css")
  fs.writeFileSync(distPath, css)

  return {
    files: [distPath],
  }
}

const { files } = generate()
logGeneratedFiles(import.meta.filename, files)
