import { renderToString } from "react-dom/server"
import { globSync } from "fs"
import * as path from "path"
import * as fs from "fs"
import { JSDOM } from "jsdom"

import { camelToKebab, findProjectRoot, getDistPath } from "../../utils.js"
import {
  tidyCss,
  getSourceDistPath,
  loadContextFromPath,
  loadContextFromSource,
} from "../common.js"

const document = new JSDOM("<!DOCTYPE html>").window.document

export async function generate() {
  const iconClasses = []

  const sizeContext = loadContextFromPath(
    getSourceDistPath("foundations/__generated__/size.js"),
  )

  for (let [name, pixels] of Object.entries(sizeContext.iconSize)) {
    iconClasses.push([
      `src-icon--${name}`,
      `.src-icon--${name} {` +
        `\twidth: ${pixels}px;\n` +
        `\theight: ${pixels}px;\n` +
        `}\n`,
    ])
  }

  const iconsPath = path.join(
    findProjectRoot(),
    "node_modules/@guardian/source/dist/react-components/__generated__/icons/",
  )

  // Bundle all icons in a single esbuild call
  const iconFiles = globSync(`${iconsPath}/*.js`)

  const barrel = iconFiles
    .map(
      (f) => `export { ${path.parse(f).name} } from "./${path.basename(f)}";`,
    )
    .join("\n")

  const allIcons = loadContextFromSource(barrel, iconsPath)

  for (const fullPath of iconFiles) {
    try {
      const iconName = path.parse(fullPath).name

      if (!(iconName in allIcons)) {
        throw new Error(`"${iconName}" not found in bundled icons context`)
      }

      const renderedIcon = renderToString(
        allIcons[iconName]({ size: "medium" }),
      )

      const template = document.createElement("template")
      template.innerHTML = renderedIcon
      template.setAttribute("shadowrootmode", "open")

      const svg = /** @type {SVGElement} */ (template.content.firstElementChild)

      for (let attr of svg.getAttributeNames()) {
        if (!["viewBox", "xmlns"].includes(attr)) {
          svg.removeAttribute(attr)
        }
      }

      const encodedIcon = `data:image/svg+xml,${encodeURIComponent(svg.outerHTML)}`
      const kebabName = camelToKebab(iconName).replace("svg-", "")

      template.remove()
      svg.remove()

      const css =
        `.src-icon--${kebabName} {` +
        `\tdisplay: inline-block;\n` +
        `\twidth: ${sizeContext.iconSize.medium}px;\n` +
        `\theight: ${sizeContext.iconSize.medium}px;\n` +
        `\tmask-image: url("${encodedIcon}");\n` +
        `\tmask-repeat: no-repeat;\n` +
        `\tmask-size: contain;\n` +
        `\tbackground-color: currentcolor;\n` +
        `}\n`

      iconClasses.push([`src-icon--${kebabName}`, css])
    } catch (err) {
      console.error(
        `failed to generate icon CSS for ${path.basename(fullPath)}`,
      )

      throw err
    }
  }

  let css = ""

  iconClasses.forEach(([_, classDecl]) => {
    css += classDecl + "\n\n"
  })

  css = await tidyCss(css)

  const distPath = getDistPath("components/icons.css")
  fs.mkdirSync(path.dirname(distPath), { recursive: true })
  fs.writeFileSync(distPath, css)

  return {
    files: [distPath],
  }
}
