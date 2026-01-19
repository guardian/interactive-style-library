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
  percentToDecimal,
  pxToRem,
  tidyCss,
  wrapDarkMode,
} from "../../utils.js"
import { from } from "@guardian/source/foundations"
import { CHARTS_PREFIX } from "../constants.js"
import { resolveFontFamily } from "../common.js"

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

export function parseSpec() {
  const yamlPath = path.join(__dirname, "../figma-chart-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  const styles = {
    spacing: spec.spacing,
    lines: spec.lines,
    typography: Object.entries(spec.typography).map(([name, raw]) => ({
      name,
      fontFamily: resolveFontFamily(raw.fontFamily),
      fontWeight: raw.fontWeight,
      sizeMobile: raw.size.mobile,
      sizeDesktop: raw.size.desktop,
      lineHeightMobile: percentToDecimal(raw.lineHeight.mobile),
      lineHeightDesktop: percentToDecimal(raw.lineHeight.desktop),
      colorLight: raw.color.light,
      colorDark: raw.color.dark,
    })),
  }

  return styles
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

function getDesktopOverrides(style) {
  const overrides = []

  // NOTE: currently it seems that this is always false, ie. mobile sizes and line heights are
  // always the same as desktop
  if (style.sizeDesktop !== style.sizeMobile) {
    overrides.push(`font-size: ${pxToRem(style.sizeDesktop)};`)
  }

  if (style.lineHeightDesktop !== style.lineHeightMobile) {
    overrides.push(`line-height: ${style.lineHeightDesktop};`)
  }

  return overrides
}

function generateTypographyClasses(styles) {
  return styles.map((style) => {
    const className = `.${CHARTS_PREFIX}-${style.name}`

    let css =
      `${className} {` +
      `\nfont-family: ${style.fontFamily};` +
      `\nfont-weight: ${style.fontWeight};` +
      `\nfont-size: ${pxToRem(style.sizeMobile)};` +
      `\nline-height: ${style.lineHeightMobile};` +
      `\ncolor: ${style.colorLight};` +
      `\n}`

    const desktopOverrides = getDesktopOverrides(style)

    if (desktopOverrides.length > 0) {
      css +=
        `\n\n${from.desktop} {` +
        `\n  ${className} {` +
        desktopOverrides.map((line) => `\n    ${line}`).join("") +
        `\n}\n}`
    }

    css +=
      `\n\n` + wrapDarkMode(`${className} {\ncolor: ${style.colorDark};\n}`)

    return css
  })
}

function generateTypograhpyMixins(styles) {
  return styles.map((style) => {
    const mixinName = `${CHARTS_PREFIX}-${style.name}`

    let scss =
      `@mixin ${mixinName} {` +
      `\nfont-family: ${style.fontFamily};` +
      `\nfont-weight: ${style.fontWeight};` +
      `\nfont-size: ${pxToRem(style.sizeMobile)};` +
      `\nline-height: ${style.lineHeightMobile};` +
      `\ncolor: ${style.colorLight};`

    const desktopOverrides = getDesktopOverrides(style)

    if (desktopOverrides.length > 0) {
      scss +=
        `\n\n ${from.desktop} {` +
        desktopOverrides.map((line) => `\n ${line}`).join("") +
        `\n}`
    }

    scss +=
      `\n\n` +
      wrapDarkMode(`color: ${style.colorDark};`).replace(/\n/g, "\n") +
      `\n}`

    return scss
  })
}

export async function generate() {
  const spec = parseSpec()

  const generatedComment = makeGeneratedComment(import.meta.url)

  const cssClasses = generateTypographyClasses(spec.typography)
  const lineClasses = generateLineClasses(spec.lines)
  const spacingVars = generateSpacingVars(spec.spacing)

  let css =
    `${generatedComment}\n\n${cssClasses.join("\n\n")}\n` +
    `${lineClasses}\n` +
    `${spacingVars}\n`

  css = await tidyCss(css)

  const scssMixins = generateTypograhpyMixins(spec.typography)
  const lineMixins = generateLineMixins(spec.lines)

  let scss = `${generatedComment}\n\n${scssMixins.join("\n\n")}\n${lineMixins.join("\n\n")}`
  scss = await tidyCss(scss)

  const scssDistPath = getDistPath("visuals/charts-mixins.scss")
  fs.writeFileSync(scssDistPath, scss)

  const cssDistPath = getDistPath("visuals/charts.css")
  fs.writeFileSync(cssDistPath, css)

  return {
    files: [cssDistPath, scssDistPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
