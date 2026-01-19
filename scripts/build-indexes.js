import { writeFileSync, readdirSync, readFileSync } from "fs"
import {
  getDistPath,
  makeGeneratedComment,
  findProjectRoot,
} from "../src/utils.js"
import path from "path"

const root = findProjectRoot()
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
const pkgName = pkg.name

/**
 * @param {string} dir
 * @param {string} ext
 */
function getFiles(dir, ext, exclude = []) {
  return readdirSync(getDistPath(dir))
    .filter((f) => f.endsWith(ext) && f !== `all${ext}` && !exclude.includes(f))
    .map((f) => `${pkgName}/${dir}/${f}`)
}

function buildCss(files) {
  return files.map((f) => `@import "${f}";`).join("\n")
}

function buildScss(cssFiles, scssFiles) {
  const imports = cssFiles.map((f) => `@import "${f}";`)
  const forwards = scssFiles.map((f) => `@forward "${f}";`)
  return [...forwards, ...imports].join("\n")
}

const comment = makeGeneratedComment(import.meta.url)

// Prefer colors.css over these -light/-dark files, it exports both sets
const visualsExcludes = ["colors-dark.css", "colors-light.css"]
const visualsCss = getFiles("visuals", ".css", visualsExcludes)
const visualsScss = getFiles("visuals", ".scss", visualsExcludes)

writeFileSync(
  getDistPath("visuals/all.css"),
  `${comment}\n\n${buildCss(visualsCss)}\n`,
)

writeFileSync(
  getDistPath("visuals/all.scss"),
  `${comment}\n\n${buildScss(visualsCss, visualsScss)}\n`,
)

// mq.scss already exports the $breakpoints variable
const sourceExcludes = ["breakpoints.scss"]
const sourceCss = getFiles("source", ".css", sourceExcludes)
const sourceScss = getFiles("source", ".scss", sourceExcludes)

writeFileSync(
  getDistPath("source/all.css"),
  `${comment}\n\n${buildCss(sourceCss)}\n`,
)

writeFileSync(
  getDistPath("source/all.scss"),
  `${comment}\n\n${buildScss(sourceCss, sourceScss)}\n`,
)

console.log("scripts/build-indexes.js generated:")
console.log("  * dist/visuals/all.css")
console.log("  * dist/visuals/all.scss")
console.log("  * dist/source/all.css")
console.log("  * dist/source/all.scss")
