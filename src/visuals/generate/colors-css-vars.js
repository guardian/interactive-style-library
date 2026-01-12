import { writeFileSync } from "fs"
import {
  getDistPath,
  logGeneratedFiles,
  makeGeneratedComment,
} from "../../utils.js"
import { parseCssVars } from "../parse-css-vars.js"

function formatVar({ key, value }) {
  return `${key}: ${value};`
}

function makeCss(vars) {
  const formatted = vars.map(formatVar)
  return `${makeGeneratedComment(import.meta.url)}\n\n:root {\n  ${formatted.join("\n  ")}\n}\n`
}

function makeCombinedCss(lightVars, darkVars) {
  const lightMap = new Map(lightVars.map((v) => [v.key, v.value]))

  // Find vars that are different in dark mode
  const darkOnlyVars = darkVars.filter((v) => lightMap.get(v.key) !== v.value)

  const lightFormatted = lightVars.map(formatVar)
  const darkFormatted = darkOnlyVars.map(formatVar)

  const lightBlock = `:root {\n  ${lightFormatted.join("\n  ")}\n}`
  const darkBlock = `@media (prefers-color-scheme: dark) {\n  :root:not([data-color-scheme="light"]) {\n    ${darkFormatted.join("\n    ")}\n  }\n}`

  return `${makeGeneratedComment(import.meta.url)}\n\n${lightBlock}\n\n${darkBlock}\n`
}

export function generate() {
  const { light, dark } = parseCssVars()

  const lightPath = getDistPath("visuals/colors-light.css")
  const darkPath = getDistPath("visuals/colors-dark.css")
  const combinedPath = getDistPath("visuals/colors.css")

  writeFileSync(lightPath, makeCss(light))
  writeFileSync(darkPath, makeCss(dark))
  writeFileSync(combinedPath, makeCombinedCss(light, dark))

  return {
    files: [lightPath, darkPath, combinedPath],
  }
}

const { files } = generate()
logGeneratedFiles(import.meta.filename, files)
