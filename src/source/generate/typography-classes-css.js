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

  const cssClasses = typographyEntries.map(([name, value]) => {
    const kebabName = typographyNameToKebab(name)
    const className = `.${SOURCE_PREFIX}-${kebabName}`
    const cssContent = value.trim()

    return `${className} {\n\t${cssContent}\n}`
  })

  const css = `${makeGeneratedComment(import.meta.url)}\n\n${cssClasses.join("\n\n")}\n`

  const distPath = getDistPath("source/typography-classes.css")
  fs.writeFileSync(distPath, css)

  return {
    files: [distPath],
  }
}

const { files } = generate()
logGeneratedFiles(import.meta.filename, files)
