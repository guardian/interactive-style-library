import { buildSync } from "esbuild"
import { Script, createContext } from "vm"
import * as path from "path"
import * as fs from "fs"
import prettier from "prettier"
import postcss from "postcss"
import postcssNested from "postcss-nested"
import postcssMergeSelectors from "postcss-combine-duplicated-selectors"
import postcssAutoprefixer from "autoprefixer"
import { findProjectRoot } from "../utils.js"

/**
 * @param {string} distRelativeSourcePath
 * @param {Object} [opts={ kitchen: false }]
 * @param {boolean} opts.kitchen `true` if this component is found in the development kitchen package
 */
export function getSourceDistPath(
  distRelativeSourcePath,
  { kitchen } = { kitchen: false },
) {
  const root = findProjectRoot()

  const fullPath = path.join(
    root,
    kitchen
      ? "node_modules/@guardian/source-development-kitchen/dist"
      : "node_modules/@guardian/source/dist",
    distRelativeSourcePath,
  )

  return fullPath
}

/**
 * @param {string} path
 */
export function loadContextFromPath(path) {
  return runBundledCode(
    buildSync({
      entryPoints: [path],
      bundle: true,
      platform: "node",
      write: false,
      outdir: "out",
    }).outputFiles[0].text,
  )
}

/**
 * Bundle source code (provided as a string) and execute it in a VM context.
 * @param {string} source - The JS source to bundle
 * @param {string} resolveDir - Directory to resolve imports from
 */
export function loadContextFromSource(source, resolveDir) {
  return runBundledCode(
    buildSync({
      stdin: { contents: source, resolveDir },
      bundle: true,
      platform: "node",
      write: false,
      outdir: "out",
    }).outputFiles[0].text,
  )
}

/** @param {string} code */
function runBundledCode(code) {
  const context = createContext({
    console,
    module: { exports: {} },
    exports: {},
    process,
  })

  new Script(code).runInContext(context)

  Object.freeze(context)

  return context
}

/**
 * @param {string} selector
 * @param {string|Array|Object} restStyles
 */
export function makeDecl(selector, ...restStyles) {
  let joinedStyles = parseEmotion(...restStyles)
  return `${selector} {${joinedStyles}}`
}

/**
 * @param {string|Array|Object} restStyles
 */
export function parseEmotion(...restStyles) {
  let joinedStyles = ""

  restStyles.forEach((styles) => {
    if (Array.isArray(styles)) {
      styles.forEach((item) => {
        if (typeof item === "string") {
          joinedStyles += item
        } else if (typeof item?.styles === "string") {
          joinedStyles += item.styles
        }
      })
    } else if (
      typeof styles === "object" &&
      typeof styles?.styles === "string"
    ) {
      joinedStyles += styles.styles
    } else {
      joinedStyles += styles
    }
  })

  return joinedStyles
}

export async function tidyCss(css) {
  css = css.replace(/\n;\n/g, "\n")

  const postcssResult = await postcss([
    postcssNested(),
    postcssMergeSelectors(),
    postcssAutoprefixer(),
  ]).process(css, { from: undefined })

  css = postcssResult.css

  css = await prettier.format(css, { parser: "css" })

  return css
}

/** @param {string} css */
export async function parseCss(css) {
  return postcss.parse(css)
}

/** @param {string} markup */
export function removeBacktickMarkupWhitespace(markup) {
  return markup
    .replace(/(\r\n|\r|\n)/g, "")
    .replace(/\s+</g, "<")
    .trim()
}

/**
 * @param {Array<Array<string>> | Array<string>} decls
 * @param {string} distPath
 */
export async function writeDeclClasses(decls, distPath) {
  let css = ""
  let scss = ""

  decls.forEach((decl) => {
    // TODO: remove this once we've removed classTuple
    if (Array.isArray(decl)) {
      css += decl[1] + "\n\n"
    } else {
      css += decl + "\n\n"
    }
  })

  css = await tidyCss(css)

  fs.mkdirSync(path.dirname(distPath), { recursive: true })
  fs.writeFileSync(distPath, css)
}
