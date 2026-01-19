import { readFileSync } from "fs"
import { parse } from "yaml"
import path from "path"
import { fileURLToPath } from "url"
import * as fs from "fs"
import {
  camelToKebab,
  getDistPath,
  logGeneratedFiles,
  makeGeneratedComment,
  tidyCss,
  wrapDarkMode,
} from "../../utils.js"
import { from } from "@guardian/source/foundations"
import { CHARTS_PREFIX } from "../constants.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VAR_PREFIX = `--${CHARTS_PREFIX}-`

/**
 * @param {string} fullStyleName
 *
 * NOTE: we can of course just change these names in the figma-chart-structure-spec.yaml file,
 * but when we move to pulling styles from the Figma API, we'll need mapping logic like this
 */
function formatStyleName(fullStyleName) {
  switch (fullStyleName) {
    // lines
    case "xAxisTick":
      return "x-tick"
    case "xAxis":
      return "x"
    case "horizontalGuideline":
      return "guideline"
    case "dataLine":
      return "plot"

    // spacing
    case "yAxisLabelPadding":
      return "y-label-pad"
    case "xAxisLabelPadding":
      return "x-label-pad"
    case "xAxisTickHeight":
      return "x-tick-height"
    case "dataLinePaddingLeft":
      return "plot-pad-left"
    case "dataLinePaddingRight":
      return "plot-pad-right"
    case "legendSpacing":
      return "legend-space"
    case "legendLabelIconSpacing":
      return "legend-label-icon-pad"
    case "legendPaddingTop":
      return "legend-pad-top"
    case "legendPaddingBottom":
      return "legend-pad-bottom"

    default:
      camelToKebab(fullStyleName)
  }
}

function generateLineClasses(lines) {
  return Object.entries(lines).map(([name, style]) => {
    const className = `.${CHARTS_PREFIX}-${formatStyleName(name)}`

    let css = `${className} {` + `\n stroke-width: ${style.strokeWidth};`

    if (style.color) {
      css += `\n  stroke: ${style.color.light};`
    }

    css += `\n}`

    if (style.color) {
      css +=
        `\n` + wrapDarkMode(`${className} {\nstroke: ${style.color.dark};\n}`)
    }

    return css
  })
}

function generateLineMixins(lines) {
  return Object.entries(lines).map(([name, style]) => {
    const mixinName = `${CHARTS_PREFIX}-${formatStyleName(name)}`

    let scss = `@mixin ${mixinName} {\n stroke-width: ${style.strokeWidth};`

    if (style.color) {
      scss +=
        `\nstroke: ${style.color.light};\n\n` +
        wrapDarkMode(` stroke: ${style.color.dark};`)
    }

    scss += `\n}`

    return scss
  })
}

function generateSpacingVars(spacing) {
  const mobileVars = []
  const desktopVars = []

  for (const [name, value] of Object.entries(spacing)) {
    const varName = `${VAR_PREFIX}${formatStyleName(name)}`

    if (typeof value === "object" && value.mobile && value.desktop) {
      mobileVars.push(`${varName}: ${value.mobile};`)
      if (value.desktop !== value.mobile) {
        desktopVars.push(`${varName}: ${value.desktop};`)
      }
    } else {
      mobileVars.push(`${varName}: ${value};`)
    }
  }

  let css = `:root {\n ${mobileVars.join("\n  ")}\n}`

  if (desktopVars.length > 0) {
    css +=
      `\n\n${from.desktop} {` +
      `\n:root {` +
      `\n ${desktopVars.join("\n    ")}` +
      `\n}\n}`
  }

  return css
}

export async function generate() {
  const yamlPath = path.join(__dirname, "../figma-chart-structure-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  const generatedComment = makeGeneratedComment(import.meta.url)

  const lineClasses = generateLineClasses(spec.lines)
  const spacingVars = generateSpacingVars(spec.spacing)

  let css = `${generatedComment}\n\n${lineClasses.join("\n\n")}\n\n${spacingVars}\n`
  css = await tidyCss(css)

  const cssDistPath = getDistPath("visuals/charts-structure.css")
  fs.writeFileSync(cssDistPath, css)

  const lineMixins = generateLineMixins(spec.lines)

  let scss = `${generatedComment}\n\n${lineMixins.join("\n\n")}\n`
  scss = await tidyCss(scss)

  const scssDistPath = getDistPath("visuals/charts-structure-mixins.scss")
  fs.writeFileSync(scssDistPath, scss)

  return {
    files: [cssDistPath, scssDistPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
