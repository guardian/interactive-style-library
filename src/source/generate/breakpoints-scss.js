import * as fs from "fs"
import {
  getDistPath,
  logGeneratedFiles,
  makeGeneratedComment,
} from "../../utils.js"
import { loadContext, getPathForGenerated } from "../utils.js"

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

  const distPath = getDistPath("source/breakpoints.scss")
  fs.writeFileSync(distPath, scss)

  return {
    files: [distPath],
  }
}

const { files } = generate()
logGeneratedFiles(import.meta.filename, files)
