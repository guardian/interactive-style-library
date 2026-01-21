import {
  headlineBold14Object,
  textSans12Object,
} from "@guardian/source/foundations"
import { camelToKebab } from "../utils.js"

/**
 * @param {string} figmaFontFamily
 */
export function resolveFontFamily(figmaFontFamily) {
  switch (figmaFontFamily) {
    case "GH Guardian Headline":
      return headlineBold14Object.fontFamily
    case "GuardianTextSans":
      return textSans12Object.fontFamily
    default:
      throw new Error(
        `unrecognised font family in Figma styles: "${figmaFontFamily}"`,
      )
  }
}

export function splitCamelHues(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

export function formatCssVar({ key, value }) {
  return `${key}: ${value};`
}

const chartNameMap = {
  // line styles
  xAxisTick: "tick",
  horizontalGuideline: "guideline",
  dataLine: "linePlot",

  // spacing
  xAxisTickHeight: "axisTickHeight",
}

/**
 * Format a YAML chart style name for output.
 *
 * @param {string} yamlName - The name from the YAML spec
 * @param {"kebab" | "camel"} casing - Output casing format
 * @returns {string}
 */
export function formatChartName(yamlName, casing = "kebab") {
  const outputName = chartNameMap[yamlName] ?? yamlName

  if (casing === "kebab") {
    return camelToKebab(outputName)
  }

  return outputName
}
