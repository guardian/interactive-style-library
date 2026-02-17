import { readFileSync } from "fs"
import { parse } from "yaml"
import path from "path"
import { fileURLToPath } from "url"
import * as fs from "fs"
import {
  getDistPath,
  makeGeneratedComment,
} from "../../utils.js"
import { logGeneratedFiles } from "../../cli.js"
import { formatChartName } from "../common.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function formatValue(value) {
  if (typeof value === "object" && value.mobile && value.desktop) {
    return `{ mobile: ${parseInt(value.mobile)}, desktop: ${parseInt(value.desktop)} }`
  }
  return parseInt(value)
}

function generateSpacingJs(spacing) {
  const lines = []

  for (const [yamlName, value] of Object.entries(spacing)) {
    const exportName = formatChartName(yamlName, "camel")

    if (typeof value === "object" && value.mobile && value.desktop) {
      lines.push(
        `export const ${exportName} = /** @type {const} */ (${formatValue(value)})`,
      )
    } else {
      lines.push(`export const ${exportName} = ${formatValue(value)}`)
    }
  }

  return lines.join("\n")
}

export async function generate() {
  const yamlPath = path.join(__dirname, "../figma-chart-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)
  const spacing = spec.spacing

  const generatedComment = makeGeneratedComment(import.meta.url)

  const js = `${generatedComment}\n\n${generateSpacingJs(spacing)}\n`

  const distPath = getDistPath("visuals/charts.js")
  fs.writeFileSync(distPath, js)

  return {
    files: [distPath],
  }
}

;(async () => {
  const { files } = await generate()
  logGeneratedFiles(import.meta.filename, files)
})()
