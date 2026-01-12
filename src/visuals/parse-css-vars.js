import { readFileSync } from "fs"
import { parse } from "yaml"
import { fileURLToPath } from "url"
import path from "path"
import { VISUALS_PREFIX } from "./constants.js"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const VAR_PREFIX = `--${VISUALS_PREFIX}-`

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function splitCamelHues(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function processFullPalette(palette) {
  const vars = []

  for (const [color, shades] of Object.entries(palette)) {
    for (const [num, data] of Object.entries(shades)) {
      vars.push({ key: `${VAR_PREFIX}${color}-${num}`, value: data.color })
    }
  }

  return vars
}

function processNews(news, mode) {
  const vars = []
  const modeData = news[mode]

  if (modeData) {
    if (modeData.main) {
      for (const [color, value] of Object.entries(modeData.main)) {
        vars.push({ key: `${VAR_PREFIX}news-${color}`, value })
      }
    }

    if (modeData.shades) {
      for (const [color, value] of Object.entries(modeData.shades)) {
        vars.push({ key: `${VAR_PREFIX}news-${color}-shade`, value })
      }
    }

    if (modeData.tints) {
      for (const [color, value] of Object.entries(modeData.tints)) {
        vars.push({ key: `${VAR_PREFIX}news-${color}-tint`, value })
      }
    }

    if (modeData.chart) {
      for (const [name, value] of Object.entries(modeData.chart)) {
        vars.push({ key: `${VAR_PREFIX}chart-${toKebabCase(name)}`, value })
      }
    }
  }

  if (news.analysis) {
    const analysis = news.analysis

    if (analysis.main) {
      for (const [color, value] of Object.entries(analysis.main)) {
        vars.push({ key: `${VAR_PREFIX}analysis-${color}`, value })
      }
    }

    if (analysis.shades) {
      for (const [color, value] of Object.entries(analysis.shades)) {
        vars.push({ key: `${VAR_PREFIX}analysis-${color}-shade`, value })
      }
    }

    if (analysis.tints) {
      for (const [color, value] of Object.entries(analysis.tints)) {
        vars.push({ key: `${VAR_PREFIX}analysis-${color}-tint`, value })
      }
    }

    if (analysis.chart) {
      for (const [name, value] of Object.entries(analysis.chart)) {
        vars.push({
          key: `${VAR_PREFIX}analysis-chart-${toKebabCase(name)}`,
          value,
        })
      }
    }
  }

  return vars
}

function processCategorical(categorical, mode) {
  const vars = []
  const modeData = categorical[mode]

  if (!modeData) return vars

  if (modeData.gender) {
    for (const [name, value] of Object.entries(modeData.gender)) {
      vars.push({ key: `${VAR_PREFIX}gender-${toKebabCase(name)}`, value })
    }
  }

  if (modeData.sentiment) {
    for (const [name, value] of Object.entries(modeData.sentiment)) {
      vars.push({ key: `${VAR_PREFIX}sentiment-${toKebabCase(name)}`, value })
    }
  }

  if (modeData.ukParties) {
    for (const [party, value] of Object.entries(modeData.ukParties)) {
      vars.push({
        key: `${VAR_PREFIX}party-uk-${party.toLowerCase()}`,
        value,
      })
    }
  }

  if (modeData.usParties) {
    for (const [party, value] of Object.entries(modeData.usParties)) {
      vars.push({
        key: `${VAR_PREFIX}party-us-${party.toLowerCase()}`,
        value,
      })
    }
  }

  return vars
}

// NOTE: currently unused
function processSequential(sequential) {
  const vars = []

  if (sequential.singleHue) {
    for (const [size, colors] of Object.entries(sequential.singleHue)) {
      const sizePrefix = size === "small" ? "sm" : "lg"
      for (const [color, shades] of Object.entries(colors)) {
        for (const [num, value] of Object.entries(shades)) {
          vars.push({
            key: `${VAR_PREFIX}ramp-${sizePrefix}-${color}-${num}`,
            value,
          })
        }
      }
    }
  }

  return vars
}

// NOTE: currently unused
function processDiverging(diverging) {
  const vars = []

  for (const [size, palettes] of Object.entries(diverging)) {
    const sizePrefix = size === "small" ? "sm" : "lg"
    for (const [hueName, shades] of Object.entries(palettes)) {
      const hueKebab = splitCamelHues(hueName)
      for (const [num, value] of Object.entries(shades)) {
        vars.push({
          key: `${VAR_PREFIX}ramp-${sizePrefix}-${hueKebab}-${num}`,
          value,
        })
      }
    }
  }

  return vars
}

/**
 * Parses the YAML color spec and returns CSS variable key-value pairs.
 *
 * @returns {{ light: Array<{key: string, value: string}>, dark: Array<{key: string, value: string}> }}
 */
export function parseCssVars() {
  // TODO: ideally we should fetch this from something like Figma
  const yamlPath = path.join(__dirname, "figma-color-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  // NOTE: for now, I'm leaving out the sequential and diverging vars, as they aren't very
  // useful as 1-8/1-9 CSS variables. I'll consult with the team.
  const sharedVars = [
    ...processFullPalette(spec.fullPalette),
    // ...processSequential(spec.sequential),
    // ...processDiverging(spec.diverging),
  ]

  const lightVars = [
    ...sharedVars,
    ...processNews(spec.news, "light"),
    ...processCategorical(spec.categorical, "light"),
  ]

  const darkVars = [
    ...sharedVars,
    ...processNews(spec.news, "dark"),
    ...processCategorical(spec.categorical, "dark"),
  ]

  return { light: lightVars, dark: darkVars }
}
