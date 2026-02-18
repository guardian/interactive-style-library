import * as path from "path"
import * as fs from "fs"
import prettier from "prettier"
import postcss from "postcss"
import postcssNested from "postcss-nested"
import postcssMergeSelectors from "postcss-combine-duplicated-selectors"
import postcssAutoprefixer from "autoprefixer"
import { findProjectRoot } from "../../utils.js"

/**
 * @param {string} distRelativeSourcePath
 */
export function getSourceDistPath(distRelativeSourcePath) {
  const root = findProjectRoot()

  const fullPath = path.join(
    root,
    "node_modules/@guardian/source/dist",
    distRelativeSourcePath,
  )

  return fullPath
}

// /**
//  * @param {string} moduleDir
//  */
// export function getDistPath(moduleDir) {
//   const root = findProjectRoot()
//   let relPath = path.relative(root, moduleDir)
//
//   relPath = relPath.replace(/^src(\/|\\)/, "dist$1")
//
//   const leaf = path.basename(moduleDir)
//   const cssFile = `${leaf}.css`
//
//   const parentDir = path.dirname(relPath)
//
//   return path.join(parentDir, cssFile)
// }

/**
 * @param {string} className
 * @param {string|Array|Object} restStyles
 * @deprecated Use `makeDecl` instead
 */
export function classTuple(className, ...restStyles) {
  let joinedStyles = parseEmotion(...restStyles)

  return /** @type {[string, string]} */ ([
    className,
    `.${className} {${joinedStyles}}`,
  ])
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
