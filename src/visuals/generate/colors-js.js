import { readFileSync, writeFileSync } from "fs"
import { parse } from "yaml"
import { fileURLToPath } from "url"
import path from "path"
import { getDistPath, makeGeneratedComment } from "../../utils.js"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export function generate() {
  const yamlPath = path.join(__dirname, "../figma-color-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  const output = {
    palette: processPalette(spec.fullPalette),
    news: processNews(spec.news),
    chart: processChart(spec.news),
    gender: processCategorical(spec.categorical, "gender"),
    sentiment: processCategorical(spec.categorical, "sentiment"),
    partyUk: processCategorical(spec.categorical, "ukParties"),
    partyUs: processCategorical(spec.categorical, "usParties"),
  }

  const comment = makeGeneratedComment(import.meta.url).replace("/*", "/**")
  const js =
    `${comment}\n\n` +
    `export const palette = /** @type {const} */ (${JSON.stringify(output.palette, null, 2)})\n\n` +
    `export const news = /** @type {const} */ (${JSON.stringify(output.news, null, 2)})\n\n` +
    `export const chart = /** @type {const} */ (${JSON.stringify(output.chart, null, 2)})\n\n` +
    `export const gender = /** @type {const} */ (${JSON.stringify(output.gender, null, 2)})\n\n` +
    `export const sentiment = /** @type {const} */ (${JSON.stringify(output.sentiment, null, 2)})\n\n` +
    `export const partyUk = /** @type {const} */ (${JSON.stringify(output.partyUk, null, 2)})\n\n` +
    `export const partyUs = /** @type {const} */ (${JSON.stringify(output.partyUs, null, 2)})\n`

  const distPath = getDistPath("visuals/colors.js")
  writeFileSync(distPath, js)

  return {
    files: [distPath],
  }
}

function processPalette(fullPalette) {
  const result = {}

  for (const [color, shades] of Object.entries(fullPalette)) {
    result[color] = {}
    for (const [num, data] of Object.entries(shades)) {
      result[color][num] = data.color
    }
  }

  return result
}

function processNews(news) {
  const result = {}

  for (const mode of ["light", "dark"]) {
    const modeData = news[mode]
    if (!modeData) continue

    result[mode] = result[mode] || {}

    // main colors: news.light.blue
    if (modeData.main) {
      for (const [color, value] of Object.entries(modeData.main)) {
        result[mode][color] = value
      }
    }

    // shades: news.light.blueShade
    if (modeData.shades) {
      for (const [color, value] of Object.entries(modeData.shades)) {
        result[mode][`${color}Shade`] = value
      }
    }

    // tints: news.light.blueTint
    if (modeData.tints) {
      for (const [color, value] of Object.entries(modeData.tints)) {
        result[mode][`${color}Tint`] = value
      }
    }
  }

  return result
}

function processChart(news) {
  const result = {}

  for (const mode of ["light", "dark"]) {
    const modeData = news[mode]
    if (!modeData?.chart) continue

    result[mode] = {}
    for (const [name, value] of Object.entries(modeData.chart)) {
      result[mode][name] = value
    }
  }

  return result
}

function processCategorical(categorical, category) {
  const result = {}

  for (const mode of ["light", "dark"]) {
    const modeData = categorical[mode]
    if (!modeData?.[category]) continue

    result[mode] = {}
    for (const [name, value] of Object.entries(modeData[category])) {
      result[mode][name] = value
    }
  }

  return result
}
