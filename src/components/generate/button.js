import * as fs from "fs"

import { getDistPath } from "../../utils.js"
import { logGeneratedFiles } from "../../cli.js"
import {
  classTuple,
  tidyCss,
  getSourceDistPath,
  loadBundledContext,
} from "../common.js"

export async function generate() {
  const context = loadBundledContext(
    getSourceDistPath("react-components/button/styles.js"),
  )

  const theme = context.themeButton

  const buttonClasses = [
    classTuple(
      "src-button",
      context.buttonStyles({ priority: "primary", size: "default" })(
        context.themeButton,
      ),
    ),

    classTuple("src-button--secondary", context.secondary(theme)),
    classTuple("src-button--tertiary", context.tertiary(theme)),
    classTuple("src-button--subdued", context.subdued(theme)),

    classTuple("src-button--small", context.smallSize),
    classTuple("src-button--xsmall", context.xsmallSize),
  ]

  let css = ""

  buttonClasses.forEach(([_, classDecl]) => {
    css += classDecl + "\n\n"
  })

  css = await tidyCss(css)

  const distPath = getDistPath("components/button.css")
  fs.writeFileSync(distPath, css)

  return {
    files: [distPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
