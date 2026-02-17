import * as fs from "fs"
import { getDistPath } from "../../utils.js"
import { logGeneratedFiles } from "../../cli.js"

import { breakpoints } from "@guardian/source/foundations"

export function generate() {
  let scss =
    `/*\n * Provides sass-mq's \`mq\` mixin with pre-filled Guardian breakpoints, so you can do (eg.)` +
    `\n *\n * \`@include mq(leftCol) ...\`` +
    `\n *\n * These breakpoints are: `

  Object.entries(breakpoints).forEach(([breakpoint, px]) => {
    // Convert px to em units, as sass-mq does
    scss += `\n * - ${breakpoint}: ${px / 16}em`
  })

  scss +=
    `\n */` +
    `\n\n@use "interactive-style-library/source/breakpoints.scss" as *;` +
    `\n\n@forward "sass-mq/mq" with (` +
    `\n  $breakpoints: $breakpoints` +
    `\n);`

  const distPath = getDistPath("source/mq.scss")
  fs.writeFileSync(distPath, scss)

  return {
    files: [distPath],
  }
}

const { files } = generate()
logGeneratedFiles(import.meta.filename, files)
