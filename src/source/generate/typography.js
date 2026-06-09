import * as fs from "fs"
import { getDistPath, makeGeneratedComment, tidyCss } from "../../utils.js"

import {
  loadContext,
  getPathForGenerated,
  getTypographyEntries,
  typographyNameToKebab,
} from "../common.js"
import { SOURCE_PREFIX } from "../constants.js"

export async function generate() {
  const context = loadContext(getPathForGenerated("typography.js"))
  const typographyEntries = getTypographyEntries(context)

  const cssClasses = typographyEntries.map(([name, value]) => {
    const kebabName = typographyNameToKebab(name)
    const className = `.${SOURCE_PREFIX}-${kebabName}`
    const cssContent = value.trim()

    return `${className} {\n\t${cssContent}\n}`
  })

  const scssMixins = typographyEntries.map(([name, value]) => {
    const kebabName = typographyNameToKebab(name)
    const mixinName = `${SOURCE_PREFIX}-${kebabName}`
    const declarations = value
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    const docLines = ["/// ```sass", ...declarations.map((d) => `/// ${d}`), "/// ```"]
    const paramDoc = `/// @param {String} $important [null] - Pass \`important\` to flag every declaration as \`!important\`.`

    const importantBody = declarations
      .map((decl) => `${decl.replace(/;$/, "")} !important;`)
      .join("\n")
    const normalBody = declarations.join("\n")

    return (
      `${docLines.join("\n")}\n${paramDoc}\n` +
      `@mixin ${mixinName}($important: null) {\n` +
      `@if $important == important {\n${importantBody}\n} @else {\n${normalBody}\n}\n` +
      `}`
    )
  })

  let css = `${makeGeneratedComment(import.meta.url)}\n\n${cssClasses.join("\n\n")}\n`
  css = await tidyCss(css)
  const cssDistPath = getDistPath("source/typography.css")
  fs.writeFileSync(cssDistPath, css)

  let scss = `${makeGeneratedComment(import.meta.url)}\n\n${scssMixins.join("\n\n")}\n`
  scss = await tidyCss(scss)
  const scssDistPath = getDistPath("source/typography.scss")
  fs.writeFileSync(scssDistPath, scss)

  return {
    files: [cssDistPath, scssDistPath],
  }
}
