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
} from "../../utils.js"
import { breakpoints } from "@guardian/source/foundations"
import { CHARTS_PREFIX } from "../constants.js"
import {
  formatChartName,
  resolveFontFamily,
} from "../common.js"
import { style } from "../style-writer.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VAR_PREFIX = `--${CHARTS_PREFIX}-`

export function parseSpec() {
  const yamlPath = path.join(__dirname, "../figma-chart-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  const styles = {
    spacing: spec.spacing,
    lines: spec.lines,
    structure: spec.structure,
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
      marginTop: raw.marginTop,
      marginBottom: raw.marginBottom,
      marginLeft: raw.marginLeft,
      marginRight: raw.marginRight,
    })),
  }

  return styles
}

function generateLineStyles(lines) {
  return Object.entries(lines).map(([name, line]) => {
    const styleName = `${CHARTS_PREFIX}-${formatChartName(name)}`
    const className = `.${styleName}`
    const selector = `${WRAPPER_CLASS} ${className}, ${className}`

    const writer = style().prop("stroke-width", line.strokeWidth)

    if (line.color) {
      writer.prop("stroke", line.color.light)
      writer.darkMode("stroke", line.color.dark)
    }

    if (line.rounded) {
      writer.prop("stroke-linejoin", "round")
      writer.prop("stroke-linecap", "round")
    }

    return {
      css: writer.buildCss(selector),
      scss: writer.buildMixin(styleName),
    }
  })
}

function generateSpacingVars(spacing) {
  const mobileVars = []
  const desktopVars = []

  for (const [yamlName, value] of Object.entries(spacing)) {
    const varName = `${VAR_PREFIX}${formatChartName(yamlName)}`

    if (typeof value === "object" && value.mobile && value.desktop) {
      mobileVars.push(`${varName}: ${value.mobile};`)
      if (value.desktop !== value.mobile) {
        desktopVars.push(`${varName}: ${value.desktop};`)
      }
    } else {
      mobileVars.push(`${varName}: ${value};`)
    }
  }

  let css = `:root {\n  ${mobileVars.join("\n  ")}\n}`

  if (desktopVars.length > 0) {
    css +=
      `\n\n@media (min-width: ${breakpoints.desktop}px) {` +
      `\n  :root {` +
      `\n    ${desktopVars.join("\n    ")}` +
      `\n  }\n}`
  }

  return css
}

const WRAPPER_CLASS = `.${CHARTS_PREFIX}`

function createTypographyWriter(typo) {
  const writer = style()
    .prop("font-family", typo.fontFamily)
    .prop("font-weight", typo.fontWeight)
    .prop("font-size", pxToRem(typo.sizeMobile))
    .prop("line-height", typo.lineHeightMobile)
    .prop("color", typo.colorLight)
    .prop("fill", typo.colorLight)
    .prop("margin-top", typo.marginTop)
    .prop("margin-bottom", typo.marginBottom)
    .prop("margin-left", typo.marginLeft)
    .prop("margin-right", typo.marginRight)
    .darkMode("color", typo.colorDark)
    .darkMode("fill", typo.colorDark)

  if (typo.sizeDesktop !== typo.sizeMobile) {
    writer.breakpoint(
      breakpoints.desktop,
      "font-size",
      pxToRem(typo.sizeDesktop),
    )
  }
  if (typo.lineHeightDesktop !== typo.lineHeightMobile) {
    writer.breakpoint(
      breakpoints.desktop,
      "line-height",
      typo.lineHeightDesktop,
    )
  }

  return writer
}

function buildTypographyOutput(name, writer) {
  const className = `.${name}`
  const selector = `${WRAPPER_CLASS} ${className}, ${className}`
  return {
    css: writer.buildCss(selector),
    scss: writer.buildMixin(name),
  }
}

function generateTypographyStyles(styles) {
  const results = []

  for (const typo of styles) {
    if (typo.name === "axisLabel") {
      // Base axis label class
      const baseWriter = createTypographyWriter(typo)
      results.push(buildTypographyOutput(`${CHARTS_PREFIX}-axis-label`, baseWriter))

      // X-axis variant with text positioning
      const xWriter = createTypographyWriter(typo)
        .prop("text-anchor", "middle")
        .prop("dominant-baseline", "hanging")
      results.push(buildTypographyOutput(`${CHARTS_PREFIX}-x-axis-label`, xWriter))

      // Y-axis variant
      const yWriter = createTypographyWriter(typo)
      results.push(buildTypographyOutput(`${CHARTS_PREFIX}-y-axis-label`, yWriter))
    } else {
      const name = `${CHARTS_PREFIX}-${camelToKebab(typo.name)}`
      const writer = createTypographyWriter(typo)
      results.push(buildTypographyOutput(name, writer))
    }
  }

  return results
}

function generateStructureStyles(structure) {
  return Object.entries(structure).map(([name, props]) => {
    const styleName = `${CHARTS_PREFIX}-${camelToKebab(name)}`
    const className = `.${styleName}`
    const selector = `${WRAPPER_CLASS} ${className}, ${className}`

    const writer = style().props(props)

    return {
      css: writer.buildCss(selector),
      scss: writer.buildMixin(styleName),
    }
  })
}

export async function generate() {
  const spec = parseSpec()

  const generatedComment = makeGeneratedComment(import.meta.url)

  const typographyStyles = generateTypographyStyles(spec.typography)
  const lineStyles = generateLineStyles(spec.lines)
  const structureStyles = generateStructureStyles(spec.structure)
  const spacingVars = generateSpacingVars(spec.spacing)

  let cssOutput =
    `${generatedComment}\n\n` +
    `${typographyStyles.map((s) => s.css).join("\n\n")}\n` +
    `${lineStyles.map((s) => s.css).join("\n")}\n` +
    `${structureStyles.map((s) => s.css).join("\n\n")}\n` +
    `${spacingVars}\n`

  cssOutput = await tidyCss(cssOutput)

  let scssOutput =
    `${generatedComment}\n\n` +
    `${typographyStyles.map((s) => s.scss).join("\n\n")}\n` +
    `${lineStyles.map((s) => s.scss).join("\n\n")}\n` +
    `${structureStyles.map((s) => s.scss).join("\n\n")}`

  scssOutput = await tidyCss(scssOutput)

  const scssDistPath = getDistPath("visuals/charts-mixins.scss")
  fs.writeFileSync(scssDistPath, scssOutput)

  const cssDistPath = getDistPath("visuals/charts.css")
  fs.writeFileSync(cssDistPath, cssOutput)

  return {
    files: [cssDistPath, scssDistPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
