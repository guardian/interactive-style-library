import { readFileSync } from "fs"
import { parse } from "yaml"
import path from "path"
import { fileURLToPath } from "url"
import * as fs from "fs"
import {
  getDistPath,
  logGeneratedFiles,
  makeGeneratedComment,
  percentToDecimal,
  tidyCss,
  wrapDarkMode,
} from "../../utils.js"
import { from, pxToRem } from "@guardian/source/foundations"
import { CHARTS_PREFIX } from "../constants.js"
import { resolveFontFamily } from "../utils.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {Object} ParsedTypographyStyle
 * @property {string} name
 * @property {string} fontFamily
 * @property {number} fontWeight
 * @property {string} sizeMobile
 * @property {string} sizeDesktop
 * @property {number} lineHeightMobile
 * @property {number} lineHeightDesktop
 * @property {string} colorLight
 * @property {string} colorDark
 */

/**
 * @returns {ParsedTypographyStyle[]}
 */
export function parseTypographySpec() {
  const yamlPath = path.join(__dirname, "../figma-chart-typography-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  const styles = []

  for (const [name, raw] of Object.entries(spec)) {
    styles.push({
      name,
      fontFamily: resolveFontFamily(raw.fontFamily),
      fontWeight: raw.fontWeight,
      sizeMobile: raw.size.mobile,
      sizeDesktop: raw.size.desktop,
      lineHeightMobile: percentToDecimal(raw.lineHeight.mobile),
      lineHeightDesktop: percentToDecimal(raw.lineHeight.desktop),
      colorLight: raw.color.light,
      colorDark: raw.color.dark,
    })
  }

  return styles
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

function generateCssClasses(styles) {
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

function generateScssMixins(styles) {
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
  const styles = parseTypographySpec()
  const generatedComment = makeGeneratedComment(import.meta.url)

  const cssClasses = generateCssClasses(styles)
  let css = `${generatedComment}\n\n${cssClasses.join("\n\n")}\n`
  css = await tidyCss(css)

  const cssDistPath = getDistPath("visuals/charts-typography-classes.css")
  fs.writeFileSync(cssDistPath, css)

  const scssMixins = generateScssMixins(styles)
  let scss = `${generatedComment}\n\n${scssMixins.join("\n\n")}\n`
  scss = await tidyCss(scss)

  const scssDistPath = getDistPath("visuals/charts-typography-mixins.scss")
  fs.writeFileSync(scssDistPath, scss)

  return {
    files: [cssDistPath, scssDistPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
