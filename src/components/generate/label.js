import { themeLabel } from "@guardian/source/react-components"

import { getDistPath } from "../../utils.js"

import {
  getSourceDistPath,
  loadContextFromPath,
  makeDecl,
  writeDeclClasses,
} from "../common.js"

export async function generate() {
  const context = loadContextFromPath(
    getSourceDistPath("react-components/label/styles.js"),
  )

  const labelClasses = [
    makeDecl(
      ".src-label",
      context.labelText(themeLabel, "medium"),
      "display: block;",
    ),

    makeDecl(".src-label--small", context.textSize.small),
    makeDecl(".src-label__optional", context.optionalText(themeLabel)),
    makeDecl(".src-label__supporting", context.supportingText(themeLabel)),
  ]

  const distPath = getDistPath("components/label.css")
  writeDeclClasses(labelClasses, distPath)

  return {
    files: [distPath],
  }
}
