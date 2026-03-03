import { readFileSync, writeFileSync } from "fs"
import { parse } from "yaml"
import { fileURLToPath } from "url"
import path from "path"
import { getDistPath, makeGeneratedComment } from "../../utils.js"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export function generate() {
  const yamlPath = path.join(__dirname, "../figma-party-spec.yaml")
  const yamlContent = readFileSync(yamlPath, "utf8")
  const spec = parse(yamlContent)

  const uk = buildRegion(spec, "uk")
  const us = buildRegion(spec, "us")

  const comment = makeGeneratedComment(import.meta.url).replace("/*", "/**")
  const js =
    `${comment}\n\n` +
    `export const uk = /** @type {const} */ (${JSON.stringify(uk, null, 2)})\n\n` +
    `export const us = /** @type {const} */ (${JSON.stringify(us, null, 2)})\n`

  const distPath = getDistPath("visuals/parties.js")
  writeFileSync(distPath, js)

  return {
    files: [distPath],
  }
}

function buildRegion(spec, region) {
  const result = {}

  for (const mode of ["light", "dark"]) {
    result[mode] = {
      ...spec.all?.[mode],
      ...spec[region]?.[mode],
    }
  }

  return result
}
