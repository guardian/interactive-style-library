import * as path from "path"
import { findProjectRoot } from "./utils.js"

export const dim = (s) => `\x1b[2m${s}\x1b[22m`
export const bold = (s) => `\x1b[1m${s}\x1b[22m`
export const yellow = (s) => `\x1b[33m${s}\x1b[39m`
export const red = (s) => `\x1b[31m${s}\x1b[39m`

/**
 * @param {string} generatorFilename
 * @param {string[]} [files]
 */
export function logGeneratedFiles(generatorFilename, files) {
  const root = findProjectRoot()
  const relativeGeneratorName = path.relative(root, generatorFilename)
  const relativeFiles = files.map((filename) => path.relative(root, filename))

  const tree = relativeFiles
    .map((f, i) => {
      const connector = i < relativeFiles.length - 1 ? "├" : "└"
      return `          ${dim(connector)} ${dim(f)}`
    })
    .join("\n")

  console.log(
    `\n${dim(new Date().toLocaleTimeString("en-GB", { hour12: false }))} ` +
      `${bold(relativeGeneratorName)}\n${tree}`,
  )
}
