import { watch } from "fs"
import { execSync, execFileSync } from "child_process"
import { globSync } from "fs"
import path from "path"
import { bold, yellow, red } from "../src/cli.js"

const generatorFiles = globSync("./src/**/generate/**/*.js")

// Generators are files that can be run directly (they have an IIFE at the
// bottom). Common/shared helpers don't, so we exclude them.
const runnableGenerators = generatorFiles.filter(
  (f) => !path.basename(f).startsWith("common"),
)

const dirs = [...new Set(runnableGenerators.map((f) => path.dirname(f)))]

/** @type {Map<string, NodeJS.Timeout>} */
const debounceTimers = new Map()
const DEBOUNCE_MS = 100

function rebuildIndexes() {
  execSync("node ./scripts/build-indexes.js", { stdio: "inherit" })
}

const indexedDirs = ["src/visuals/", "src/source/"]

/** @param {string} file */
function needsReindex(file) {
  return indexedDirs.some((dir) => file.startsWith(dir))
}

/** @param {string} file */
function runGenerator(file) {
  const relPath = path.relative(".", file)

  console.log(
    `\n${yellow(bold(`\u25b2 Changed: ${relPath.replace(/^src\//, "")}`))}`,
  )

  try {
    execFileSync("node", [file], { stdio: "inherit" })
    if (needsReindex(file)) rebuildIndexes()
  } catch {
    console.error(red(`\n✗ ${relPath} failed`))
  }
}

console.log(
  `Watching ${runnableGenerators.length} generators in ${dirs.length} directories...`,
)

for (const dir of dirs) {
  watch(dir, (_, filename) => {
    if (!filename?.endsWith(".js")) return
    if (path.basename(filename).startsWith("common")) return

    const fullPath = path.join(dir, filename)
    if (!runnableGenerators.includes(fullPath)) return

    clearTimeout(debounceTimers.get(fullPath))
    debounceTimers.set(
      fullPath,
      setTimeout(() => runGenerator(fullPath), DEBOUNCE_MS),
    )
  })
}
