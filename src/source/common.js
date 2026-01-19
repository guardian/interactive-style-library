import * as path from "path"
import * as fs from "fs"
import { Script, createContext } from "vm"
import { findProjectRoot, camelToKebab } from "../utils.js"

/**
 * @param {string} distRelativeSourcePath
 */
export function getPathForGenerated(distRelativeSourcePath) {
  const root = findProjectRoot()

  const fullPath = path.join(
    root,
    "node_modules/@guardian/source/dist/foundations/__generated__",
    distRelativeSourcePath,
  )

  return fullPath
}

/**
 * @param {string} path
 */
export function loadContext(path) {
  let code = fs.readFileSync(path, "utf-8")

  // Replace any "exports" lines, `Script` will reject the code otherwise
  code = code.replace(/^export\s*\{[^}]*\};?\s*$/gm, "")

  // Convert const/let to var so declarations become context properties
  code = code.replace(/^(const|let)\s+/gm, "var ")

  const context = createContext()
  new Script(code).runInContext(context)

  Object.freeze(context)

  return context
}

/**
 * Get sorted typography entries from the typography.js context.
 *
 * Filters out Object variants and returns only the CSS template strings.
 *
 * @param {Record<string, unknown>} context
 */
export function getTypographyEntries(context) {
  const entries = Object.entries(context).filter(
    ([name, value]) =>
      typeof value === "string" &&
      !name.endsWith("Object") &&
      value.includes("font-family"),
  )
  entries.sort(([a], [b]) => a.localeCompare(b))
  return entries
}

/**
 * Convert a typography camelCase name to kebab-case with number separator.
 *
 * e.g., article15 -> article-15, headlineBold14 -> headline-bold-14
 *
 * @param {string} name
 */
export function typographyNameToKebab(name) {
  return camelToKebab(name).replace(/(\d+)/g, "-$1")
}
