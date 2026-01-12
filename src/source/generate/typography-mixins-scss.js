import * as fs from "fs"
import {
  getDistPath,
  logGeneratedFiles,
  makeGeneratedComment,
} from "../../utils.js"
import {
  loadContext,
  getPathForGenerated,
  getTypographyEntries,
  typographyNameToKebab,
} from "../utils.js"
import { SOURCE_PREFIX } from "../constants.js"

export function generate() {
  const context = loadContext(getPathForGenerated("typography.js"))
  const typographyEntries = getTypographyEntries(context)

  const scssMixins = typographyEntries.map(([name, value]) => {
    const kebabName = typographyNameToKebab(name)
    const mixinName = `${SOURCE_PREFIX}-${kebabName}`
    const cssContent = value.trim()

    return `@mixin ${mixinName} {\n\t${cssContent}\n}`
  })

  const scss = `${makeGeneratedComment(import.meta.url)}\n\n${scssMixins.join("\n\n")}\n`

  const distPath = getDistPath("source/typography-mixins.scss")
  fs.writeFileSync(distPath, scss)

  return {
    files: [distPath],
  }
}

const { files } = generate()
logGeneratedFiles(import.meta.filename, files)
