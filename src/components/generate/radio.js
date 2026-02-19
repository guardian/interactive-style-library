import { themeRadioGroup, themeRadio } from "@guardian/source/react-components"
import { space } from "@guardian/source/foundations"

import { getDistPath } from "../../utils.js"
import {
  getSourceDistPath,
  loadContextFromPath,
  makeDecl,
  writeDeclClasses,
} from "../common.js"

export async function generate() {
  const context = loadContextFromPath(
    getSourceDistPath("react-components/radio/styles.js"),
  )

  const inlineContext = loadContextFromPath(
    getSourceDistPath("react-components/inline/styles.js"),
  )

  console.log(inlineContext)

  const radioClasses = [
    // TODO: why fieldset2?
    makeDecl(".src-radio-group", context.fieldset2(themeRadioGroup)),

    makeDecl(
      ".src-radio-group--horizontal",
      inlineContext.inlineWrapper,
      // This imitates the spacing applied by the horizontal orientation
      `gap: ${space["5"] / 2}px;`,
    ),

    makeDecl(".src-radio__container", context.radioContainer(themeRadio)),
    makeDecl(".src-radio", context.radio(themeRadio)),

    makeDecl(
      ".src-radio__label",
      context.labelText(themeRadio),
      `display: block`, // Ensures supporting text sits on its own line
    ),

    makeDecl(".src-radio__supporting", context.supportingText(themeRadio)),
  ]

  const distPath = getDistPath("components/radio.css")
  writeDeclClasses(radioClasses, distPath)

  return {
    files: [distPath],
  }
}
