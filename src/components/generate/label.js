import { themeLabel } from "@guardian/source/react-components"

import { getDistPath } from "../../utils.js"
import { logGeneratedFiles } from "../../cli.js"
import {
  classTuple,
  getSourceDistPath,
  loadBundledContext,
  writeDeclClasses,
} from "../common.js"

export async function generate() {
  const context = loadBundledContext(
    getSourceDistPath("react-components/label/styles.js"),
  )

  const labelClasses = [
    classTuple(
      "src-label",
      context.labelText(themeLabel, "medium"),
      "display: block;",
    ),
    classTuple("src-label--small", context.textSize.small),
    classTuple("src-label__optional", context.optionalText(themeLabel)),
    classTuple("src-label__supporting", context.supportingText(themeLabel)),
  ]

  const distPath = getDistPath("components/label.css")
  writeDeclClasses(labelClasses, distPath)

  return {
    files: [distPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
