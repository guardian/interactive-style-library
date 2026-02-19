import * as fs from "fs"

import { getDistPath } from "../../utils.js"
import {
  tidyCss,
  getSourceDistPath,
  loadContextFromPath,
  makeDecl,
  writeDeclClasses,
} from "../common.js"

export async function generate() {
  const context = loadContextFromPath(
    getSourceDistPath("react-components/button/styles.js"),
  )

  const theme = context.themeButton

  const buttonClasses = [
    makeDecl(
      ".src-button",
      context.buttonStyles({ priority: "primary", size: "default" })(
        context.themeButton,
      ),
    ),

    makeDecl(".src-button--secondary", context.secondary(theme)),
    makeDecl(".src-button--tertiary", context.tertiary(theme)),
    makeDecl(".src-button--subdued", context.subdued(theme)),

    makeDecl(".src-button--small", context.smallSize),
    makeDecl(".src-button--xsmall", context.xsmallSize),
  ]

  const distPath = getDistPath("components/button.css")
  writeDeclClasses(buttonClasses, distPath)

  return {
    files: [distPath],
  }
}
