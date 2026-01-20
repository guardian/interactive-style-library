import { readFileSync } from "fs"
import { parse } from "yaml"
import { fileURLToPath } from "url"
import path from "path"
import { VISUALS_PREFIX } from "../constants.js"
import { splitCamelHues } from "../common.js"
import { writeFileSync } from "fs"
import {
  camelToKebab,
  getDistPath,
  logGeneratedFiles,
  makeGeneratedComment,
  tidyCss,
  wrapDarkMode,
} from "../../utils.js"
import { formatCssVar } from "../common.js"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const VAR_PREFIX = `--${VISUALS_PREFIX}-`

function varsFromEntries(obj, keyFn) {
  return Object.entries(obj).map(([name, value]) => ({
    key: keyFn(name),
    value,
  }))
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
      vars.push(
        ...varsFromEntries(modeData.main, (c) => `${VAR_PREFIX}news-${c}`),
      )
    }
    if (modeData.shades) {
      vars.push(
        ...varsFromEntries(
          modeData.shades,
          (c) => `${VAR_PREFIX}news-${c}-shade`,
        ),
      )
    }
    if (modeData.tints) {
      vars.push(
        ...varsFromEntries(
          modeData.tints,
          (c) => `${VAR_PREFIX}news-${c}-tint`,
        ),
      )
    }
    if (modeData.chart) {
      vars.push(
        ...varsFromEntries(
          modeData.chart,
          (n) => `${VAR_PREFIX}chart-${camelToKebab(n)}`,
        ),
      )
    }
  }

  if (news.analysis) {
    const analysis = news.analysis

    if (analysis.main) {
      vars.push(
        ...varsFromEntries(analysis.main, (c) => `${VAR_PREFIX}analysis-${c}`),
      )
    }
    if (analysis.shades) {
      vars.push(
        ...varsFromEntries(
          analysis.shades,
          (c) => `${VAR_PREFIX}analysis-${c}-shade`,
        ),
      )
    }
    if (analysis.tints) {
      vars.push(
        ...varsFromEntries(
          analysis.tints,
          (c) => `${VAR_PREFIX}analysis-${c}-tint`,
        ),
      )
    }
    if (analysis.chart) {
      vars.push(
        ...varsFromEntries(
          analysis.chart,
          (n) => `${VAR_PREFIX}analysis-chart-${camelToKebab(n)}`,
        ),
      )
    }
  }

  return vars
}

function processCategorical(categorical, mode) {
  const vars = []
  const modeData = categorical[mode]

  if (!modeData) return vars

  if (modeData.gender) {
    vars.push(
      ...varsFromEntries(
        modeData.gender,
        (n) => `${VAR_PREFIX}gender-${camelToKebab(n)}`,
      ),
    )
  }
  if (modeData.sentiment) {
    vars.push(
      ...varsFromEntries(
        modeData.sentiment,
        (n) => `${VAR_PREFIX}sentiment-${camelToKebab(n)}`,
      ),
    )
  }
  if (modeData.ukParties) {
    vars.push(
      ...varsFromEntries(
        modeData.ukParties,
        (p) => `${VAR_PREFIX}party-uk-${p.toLowerCase()}`,
      ),
    )
  }
  if (modeData.usParties) {
    vars.push(
      ...varsFromEntries(
        modeData.usParties,
        (p) => `${VAR_PREFIX}party-us-${p.toLowerCase()}`,
      ),
    )
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

async function makeCss(vars) {
  const formatted = vars.map(formatCssVar)
  let css = `${makeGeneratedComment(import.meta.url)}\n\n:root {\n  ${formatted.join("\n  ")}\n}\n`
  return await tidyCss(css)
}

async function makeCombinedCss(lightVars, darkVars) {
  const lightMap = new Map(lightVars.map((v) => [v.key, v.value]))

  // Find vars that are different in dark mode
  const darkOnlyVars = darkVars.filter((v) => lightMap.get(v.key) !== v.value)

  const lightFormatted = lightVars.map(formatCssVar)
  const darkFormatted = darkOnlyVars.map(formatCssVar)

  const lightBlock = `:root {\n  ${lightFormatted.join("\n  ")}\n}`
  const darkBlock = wrapDarkMode(darkFormatted.join("\n "), "")

  let css = `${makeGeneratedComment(import.meta.url)}\n\n${lightBlock}\n\n${darkBlock}\n`

  return await tidyCss(css)
}

export async function generate() {
  const yamlPath = path.join(__dirname, "../figma-color-spec.yaml")
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

  const lightPath = getDistPath("visuals/colors-light.css")
  const darkPath = getDistPath("visuals/colors-dark.css")
  const combinedPath = getDistPath("visuals/colors.css")

  writeFileSync(lightPath, await makeCss(lightVars))
  writeFileSync(darkPath, await makeCss(darkVars))
  writeFileSync(combinedPath, await makeCombinedCss(lightVars, darkVars))

  return {
    files: [lightPath, darkPath, combinedPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
