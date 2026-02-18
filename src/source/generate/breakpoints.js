import * as fs from "fs"
import { getDistPath, makeGeneratedComment } from "../../utils.js"

import { loadContext, getPathForGenerated } from "../common.js"

export function generate() {
  const context = loadContext(getPathForGenerated("breakpoints.js"))
  const breakpoints = context.breakpoints

  // Sort breakpoints by value (smallest to largest)
  const sorted = Object.entries(breakpoints).sort(([, a], [, b]) => a - b)
  const scssEntries = sorted
    .map(([name, value]) => `\t${name}: ${value}px,`)
    .join("\n")

  const scss =
    `${makeGeneratedComment(import.meta.url)}` +
    `\n\n$breakpoints: (\n${scssEntries}\n);\n`

  const scssDistPath = getDistPath("source/breakpoints.scss")
  fs.writeFileSync(scssDistPath, scss)

  const js =
    `${makeGeneratedComment(import.meta.url)}\n\n` +
    `export const palette = /** @type {const} */ (${JSON.stringify(Object.fromEntries(sorted), null, 2)})\n`

  const jsDistPath = getDistPath("source/breakpoints.js")
  fs.writeFileSync(jsDistPath, js)

  return {
    files: [scssDistPath, jsDistPath],
  }
}
