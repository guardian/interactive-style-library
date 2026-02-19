import { themeTextInput } from "@guardian/source/react-components"

import { getDistPath } from "../../utils.js"
import {
  makeDecl,
  getSourceDistPath,
  loadContextFromPath,
  writeDeclClasses,
} from "../common.js"

export async function generate() {
  const context = loadContextFromPath(
    getSourceDistPath("react-components/text-input/styles.js"),
  )

  const textInputClasses = [
    makeDecl(
      ".src-text-input",
      context.textInput(themeTextInput, "medium"),
      context.widthFluid.styles,
    ),

    makeDecl(".src-text-input--medium", context.inputSizeMedium.styles),
    makeDecl(".src-text-input--small", context.inputSizeSmall.styles),

    makeDecl(".src-text-input--width-fluid", context.widthFluid.styles),
    makeDecl(".src-text-input--width-30", context.width30.styles),
    makeDecl(".src-text-input--width-10", context.width10.styles),
    makeDecl(".src-text-input--width-4", context.width4.styles),

    // Add margin above input according to preceding label element
    makeDecl(".src-label + .src-text-input", context.labelMargin.styles),

    // TODO: can we do without :has?
    makeDecl(
      `label.src-label + .src-text-input, label.src-label + :has(> .src-text-input)`,
      context.labelMargin.styles,
    ),

    makeDecl(
      `label:has(.src-label__supporting) + .src-text-input,` +
        `label:has(.src-label__supporting) + :has(> .src-text-input)`,
      context.supportingTextMargin.styles,
    ),
  ]

  const distPath = getDistPath("components/text-input.css")
  writeDeclClasses(textInputClasses, distPath)

  return {
    files: [distPath],
  }
}
