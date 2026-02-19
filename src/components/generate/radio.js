import { themeRadioGroup, themeRadio } from "@guardian/source/react-components"
import { space } from "@guardian/source/foundations"

import { getDistPath } from "../../utils.js"
import {
  getSourceDistPath,
  loadContextFromPath,
  makeDecl,
  parseCss,
  writeDeclClasses,
} from "../common.js"

export async function generate() {
  const context = loadContextFromPath(
    getSourceDistPath("react-components/radio/styles.js"),
  )

  const inlineContext = loadContextFromPath(
    getSourceDistPath("react-components/inline/styles.js"),
  )

  let labelStylesRoot = await parseCss(context.labelText(themeRadio).styles)

  labelStylesRoot.walkDecls((decl) => {
    // Labels don't need to be 100%, and this interferes with
    // input-inside-label situations
    if (decl.prop === "width" && decl.value === "100%") {
      decl.remove()
    }
  })

  const radioClasses = [
    // TODO: why fieldset2?
    makeDecl(".src-radio-group", context.fieldset2(themeRadioGroup)),

    makeDecl(".src-radio-group--horizontal", inlineContext.inlineWrapper),
    makeDecl(
      ".src-radio-group--horizontal .src-radio__container:not(:last-child)",
      `margin-right: ${space["5"]}px;`,
    ),

    makeDecl(".src-radio__container", context.radioContainer(themeRadio)),
    makeDecl(".src-radio", context.radio(themeRadio)),
    makeDecl(".src-radio__label", labelStylesRoot.toString()),
    makeDecl(".src-radio__supporting", context.supportingText(themeRadio)),
  ]

  const distPath = getDistPath("components/radio.css")
  writeDeclClasses(radioClasses, distPath)

  return {
    files: [distPath],
  }
}
