import * as fs from "fs"

import { getDistPath } from "../../utils.js"
import {
  tidyCss,
  getSourceDistPath,
  loadContextFromPath,
  makeDecl,
  writeDeclClasses,
  parseCss,
} from "../common.js"

export async function generate() {
  const context = loadContextFromPath(
    getSourceDistPath("react-components/button/styles.js"),
  )

  const theme = context.themeButton

  const primaryStylesRoot = await parseCss(
    context
      .buttonStyles({ priority: "primary", size: "default" })(
        context.themeButton,
      )
      .map((item) => item?.styles)
      .join("\n"),
  )

  /** @type {import("postcss").Rule} */
  let primaryHoverRule

  primaryStylesRoot.walkRules((rule) => {
    if (rule.selector === "&:hover") {
      primaryHoverRule = rule.clone()
      rule.remove()
    }
  })

  // console.log(primaryHoverRule.toString())

  const buttonClasses = [
    makeDecl(".src-button", primaryStylesRoot.toString()),

    // The subdued class doesn't set any background-color or color on hover, so
    // only include priary hover class if the subdued class isn't set
    makeDecl(
      ".src-button:not(.src-button--secondary):not(.src-button--tertiary):not(.src-button--subdued)",
      primaryHoverRule.toString(),
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
