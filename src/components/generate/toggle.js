import { neutral, success } from "@guardian/source/foundations"
import { themeCheckbox } from "@guardian/source/react-components"

import { getDistPath } from "../../utils.js"
import {
  getSourceDistPath,
  loadContextFromPath,
  makeDecl,
  writeDeclClasses,
  parseCss,
} from "../common.js"

export async function generate() {
  const context = loadContextFromPath(
    getSourceDistPath("react-components/toggle-switch/styles.js", {
      kitchen: true,
    }),
  )

  const checkboxContext = loadContextFromPath(
    getSourceDistPath("react-components/checkbox/styles.js"),
  )

  let toggleStylesRoot = await parseCss(context.toggleStyles.styles)

  toggleStylesRoot.walkDecls((decl) => {
    // Replace the default checked and unchecked colours with CSS variables
    // that consumers can customise. Default colours are set as fallbacks if
    // the variables aren't set.
    if (decl.value.includes(success[400])) {
      decl.value = decl.value.replace(
        `${success[400]}`,
        `var(--bg-checked, ${success[400]})`,
      )
    } else if (decl.value.includes(neutral[46])) {
      decl.value = decl.value.replace(
        `${neutral[46]}`,
        `var(--bg-unchecked, ${neutral[46]})`,
      )
    }
  })

  toggleStylesRoot.walkRules((node) => {
    // The toggle switch uses a button with aria-checked to mark checked state.
    // Since we intend consumers to use `input type="checkbox"`, we need to replace
    // these with `:checked` instead.
    node.selector = node.selector
      .replaceAll(/\[aria-checked(=["']true['"])?\]/g, ":checked")
      .replaceAll(/\[aria-checked=["']false['"]\]/g, ":not(:checked)")
  })

  const toggleClasses = [
    makeDecl(
      ".src-toggle",
      toggleStylesRoot.toString(),
      context.buttonStyles,
      `appearance: none;`,
      // Add a scale transition to the outline, as the other components have
      `
        transition-property: outline-offset, outline-width;
        transition-timing-function: ease-in-out;
        transition-duration: 0.25s;
      `,
    ),

    makeDecl(".src-toggle--no-tick:before", "display: none;"),

    // NOTE: toggle switches have their own label style, so we can't use src-label
    makeDecl(".src-toggle__label", context.labelStyles("medium", "regular")),

    makeDecl(
      ".src-toggle__container",
      // These styles are adapted from the checkbox's container styles, minus the focus stuff.
      // The 10px should be 8px, as with checkbox, but the extra 2px are needed to
      // make space for the fatter focus ring
      `
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 10px;
      `,
    ),
  ]

  const distPath = getDistPath("components/toggle.css")
  writeDeclClasses(toggleClasses, distPath)

  return {
    files: [distPath],
  }
}
