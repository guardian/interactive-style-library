import {
  headlineBold14Object,
  textSans12Object,
} from "@guardian/source/foundations"

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
