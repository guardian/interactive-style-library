import { readFileSync, writeFileSync } from "fs"
import { parse } from "yaml"
import { fileURLToPath } from "url"
import path from "path"
import { VISUALS_PREFIX } from "../constants.js"
import { formatCssVar } from "../common.js"
import {
  camelToKebab,
  getDistPath,
  makeGeneratedComment,
  tidyCss,
} from "../../utils.js"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const VAR_PREFIX = `--${VISUALS_PREFIX}-`

function buildVars(spec, region, mode) {
  const vars = []

  const merged = { ...spec.all?.[mode], ...spec[region]?.[mode] }

  for (const [name, value] of Object.entries(merged)) {
    const kebab = camelToKebab(name).replace(/(\D)(\d)/g, "$1-$2")
    vars.push({ key: `${VAR_PREFIX}${region}-${kebab}`, value })
  }

  return vars
}

async function makeCss(vars) {
  const formatted = vars.map(formatCssVar)
  let css = `${makeGeneratedComment(import.meta.url)}\n\n:root {\n  ${formatted.join("\n  ")}\n}\n`
  return await tidyCss(css)
}

async function makeCombinedCss(lightVars, darkVars) {
  const lightMap = new Map(lightVars.map((v) => [v.key, v.value]))

  const darkOnlyVars = darkVars.filter((v) => lightMap.get(v.key) !== v.value)

  const lightFormatted = lightVars.map(formatCssVar)
  const darkFormatted = darkOnlyVars.map(formatCssVar)

  const lightBlock = `:root {\n  ${lightFormatted.join("\n  ")}\n}`
  const darkBlock =
    `@media (prefers-color-scheme: dark) {\n` +
    `  :root:not([data-color-scheme="light"]) {\n` +
    `    ${darkFormatted.join("\n    ")}\n` +
    `  }\n}`

  let css = `${makeGeneratedComment(import.meta.url)}\n\n${lightBlock}\n\n${darkBlock}\n`

  return await tidyCss(css)
}

export async function generate() {
  const yamlPath = path.join(__dirname, "../figma-party-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  const regions = ["uk", "us"]

  const lightVars = regions.flatMap((r) => buildVars(spec, r, "light"))
  const darkVars = regions.flatMap((r) => buildVars(spec, r, "dark"))

  const lightPath = getDistPath("visuals/parties-light.css")
  const darkPath = getDistPath("visuals/parties-dark.css")
  const combinedPath = getDistPath("visuals/parties.css")

  writeFileSync(lightPath, await makeCss(lightVars))
  writeFileSync(darkPath, await makeCss(darkVars))
  writeFileSync(combinedPath, await makeCombinedCss(lightVars, darkVars))

  return {
    files: [lightPath, darkPath, combinedPath],
  }
}
