import { PurgeCSS } from "purgecss"
import { SOURCE_PREFIX } from "../source/constants.js"
import { VISUALS_PREFIX } from "../visuals/constants.js"

const PREFIXES = [SOURCE_PREFIX, VISUALS_PREFIX]

/**
 * @typedef {Object} PurgeOptions
 * @property {string[]} [safelist] - Additional classes/variables to always keep
 */

/**
 * Vite plugin that finds and removes any unused CSS variables and classes provided by
 * interactive-style-library.
 *
 * Any imported CSS styles file (eg. `interactive-style-library/source/palette.css`) supplies
 * all variables/classes declarations by default, most of which will be unused. This plugin finds
 * any class declaration beginning with `.src-` or `.vis-`, or any CSS variable declaration with
 * `--src-` or `--vis-`, and removes it, if that class or variable is not used in your HTML or
 * JavaScript.
 *
 * This plugin should be run after your Svelte components, SCSS code, etc. are compiled to
 * plain HTML, CSS and JavaScript.
 *
 * @param {PurgeOptions} [options]
 */
export function purgeInteractiveStylesCss(options = {}) {
  const { safelist = [] } = options

  return {
    name: "vite-plugin-purge-interactive-style-library",
    apply: "build",
    enforce: "post",

    async generateBundle(_, bundle) {
      // Find all CSS assets in the bundle
      const cssAssets = Object.values(bundle).filter(
        (asset) => asset.type === "asset" && asset.fileName.endsWith(".css"),
      )

      if (cssAssets.length === 0) {
        return
      }

      // Scan JS and HTML chunks for CSS variable references.
      // PurgeCSS doesn't detect variable usage in JavaScript, so we find them
      // ourselves and add them to the safelist. CSS files are skipped - PurgeCSS
      // handles variable references within CSS itself.
      const usedVariables = new Set()
      const variablePattern = new RegExp(
        `--(${PREFIXES.join("|")})-[\\w-]+`,
        "g",
      )

      for (const [fileName, item] of Object.entries(bundle)) {
        if (fileName.endsWith(".map")) continue
        if (fileName.endsWith(".css")) continue

        const content = item.type === "chunk" ? item.code : item.source

        if (content && typeof content === "string") {
          const matches = content.match(variablePattern) || []
          matches.forEach((v) => usedVariables.add(v))
        }
      }

      // Build regex patterns that match anything NOT starting with our prefixes.
      // This safelists all other classes/variables while allowing PurgeCSS to purge ours.
      const prefixPattern = PREFIXES.join("|")
      const standardSafelist = new RegExp(`^(?:(?!${prefixPattern}-).)*$`)
      const variablesSafelist = new RegExp(`^(?:(?!--(${prefixPattern})-).)*$`)

      // Extract content from the bundle's JS and HTML chunks for PurgeCSS to scan.
      // Skip vendor chunks (from node_modules) since they won't reference our styles.
      const contentFromBundle = Object.entries(bundle)
        .filter(([fileName, item]) => {
          if (fileName.endsWith(".map")) return false

          // Skip vendor chunks, ie. code from node_modules
          if (
            item.type === "chunk" &&
            item.moduleIds.every((id) => id.includes("node_modules"))
          ) {
            return false
          }

          return (
            fileName.endsWith(".js") ||
            fileName.endsWith(".html") ||
            item.type === "chunk"
          )
        })
        .map(([_, item]) => ({
          raw: item.type === "chunk" ? item.code : item.source,
          extension: "html", // Treat as HTML so PurgeCSS extracts class names
        }))

      // Process each CSS asset
      for (const cssAsset of cssAssets) {
        const result = await new PurgeCSS().purge({
          content: contentFromBundle,
          css: [{ raw: cssAsset.source }],
          variables: true,
          safelist: {
            standard: [standardSafelist, ...safelist],
            variables: [variablesSafelist, ...usedVariables, ...safelist],
          },
        })

        if (result[0]) {
          cssAsset.source = result[0].css
        }
      }
    },
  }
}
