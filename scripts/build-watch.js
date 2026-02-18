import { watch } from "fs"
import { execSync } from "child_process"
import { globSync } from "fs"
import path from "path"
import { bold, yellow, red, logGeneratedFiles } from "../src/cli.js"

const generatorFiles = globSync("./src/**/generate/**/*.js")
const dirs = [...new Set(generatorFiles.map((f) => path.dirname(f)))]

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
async function runGenerator(file) {
  const relPath = path.relative(".", file)

  console.log(
    `\n${yellow(bold(`\u25b2 Changed: ${relPath.replace(/^src\//, "")}`))}`,
  )

  try {
    const modulePath = path.resolve(file) + `?t=${Date.now()}`
    const { generate } = await import(modulePath)
    const { files } = await generate()
    logGeneratedFiles(path.resolve(file), files)
    if (needsReindex(file)) rebuildIndexes()
  } catch (err) {
    console.error(red(`\n✗ ${relPath} failed`))
    console.error(err)
  }
}

console.log(
  `Watching ${generatorFiles} generators in ${dirs.length} directories...`,
)

for (const dir of dirs) {
  watch(dir, (_, filename) => {
    if (!filename?.endsWith(".js")) return
    if (path.basename(filename).startsWith("common")) return

    const fullPath = path.join(dir, filename)

    clearTimeout(debounceTimers.get(fullPath))
    debounceTimers.set(
      fullPath,
      setTimeout(() => runGenerator(fullPath), DEBOUNCE_MS),
    )
  })
}
