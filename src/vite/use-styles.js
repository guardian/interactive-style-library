import { purgeInteractiveStylesCss } from "./purge-unused-css.js"

/**
 * @typedef {"mq.scss"
 *   | "typography.scss"
 *   | "typography.css"
 *   | "colors.css"
 *   | "breakpoints.scss"
 *   | "font-faces.css"
 *   | "headline-numeric.css"} SourceFile
 */

/**
 * @typedef {"charts.scss"
 *   | "charts.css"
 *   | "colors.css"
 *   | "colors-light.css"
 *   | "colors-dark.css"
 *   | "parties.css"
 *   | "parties-light.css"
 *   | "parties-dark.css"} VisualsFile
 */

/**
 * @typedef {"button.css"
 *   | "checkbox.css"
 *   | "icons.css"
 *   | "label.css"
 *   | "radio.css"
 *   | "select.css"
 *   | "spinner.css"
 *   | "text-input.css"
 *   | "toggle.css"} ComponentFile
 */

/**
 * @typedef {Object} UseInteractiveStylesOptions
 * @property {SourceFile[]} [source] - Files from `dist/source/` to inject
 * @property {VisualsFile[]} [visuals] - Files from `dist/visuals/` to inject
 * @property {ComponentFile[]} [components] - Files from `dist/components/` to inject
 * @property {boolean | import("./purge-unused-css.js").PurgeOptions} [purge]
 *   `true` enables purging with defaults, `false` disables, or pass an options
 *   object forwarded to `purgeInteractiveStylesCss`
 * @property {string} [entryScss] - Filename of the entry SCSS file that CSS
 *   `@use` lines are injected into. Defaults to `"main.scss"`.
 */

const validSourceFiles = new Set([
  "mq.scss",
  "typography.scss",
  "typography.css",
  "colors.css",
  "breakpoints.scss",
  "font-faces.css",
  "headline-numeric.css",
])

const validVisualsFiles = new Set([
  "charts.scss",
  "charts.css",
  "colors.css",
  "colors-light.css",
  "colors-dark.css",
  "parties.css",
  "parties-light.css",
  "parties-dark.css",
])

const validComponentFiles = new Set([
  "button.css",
  "checkbox.css",
  "icons.css",
  "label.css",
  "radio.css",
  "select.css",
  "spinner.css",
  "text-input.css",
  "toggle.css",
])

/**
 * Vite plugin that wires `interactive-style-library` CSS and SCSS files into
 * your build.
 *
 * SCSS files are made available globally via `additionalData` (so mixins and
 * variables don't need to be `@use`d in every file). CSS files are `@use`d
 * once from the entry SCSS file, since `@use`ing them duplicates output.
 *
 * @param {UseInteractiveStylesOptions} [options]
 * @returns {import("vite").Plugin[]}
 */
export function useInteractiveStyles(options = {}) {
  const {
    source = [],
    visuals = [],
    components = [],
    purge = true,
    entryScss = "main.scss",
  } = options

  validateFiles("source", source, validSourceFiles)
  validateFiles("visuals", visuals, validVisualsFiles)
  validateFiles("components", components, validComponentFiles)

  const scssImports = buildImports(
    source,
    visuals,
    [],
    ".scss",
    "@use",
    () => " as *",
  )
  const cssImports = buildImports(
    source,
    visuals,
    components,
    ".css",
    "@use",
    cssAlias,
  )

  let entryScssSeen = false
  let anyScssSeen = false

  /** @type {import("vite").Plugin} */
  const injectPlugin = {
    name: "vite-plugin-use-interactive-styles",

    config(config) {
      const existing =
        config.css?.preprocessorOptions?.scss?.additionalData ?? ""

      const additionalData = async (source, filepath) => {
        const existingPrefix =
          typeof existing === "function"
            ? await existing(source, filepath)
            : existing + source

        anyScssSeen = true

        const isEntry = filepath.endsWith(`/${entryScss}`)
        if (isEntry) {
          entryScssSeen = true
        }

        const prefix = isEntry ? scssImports + cssImports : scssImports

        return prefix + existingPrefix
      }

      return {
        css: {
          preprocessorOptions: {
            scss: { additionalData },
          },
        },
      }
    },

    buildEnd() {
      // Only warn when SCSS was processed but the entry was missing. Some
      // setups spin up a secondary Vite instance (e.g. SSR/prerender) that
      // shares this config but processes no SCSS: warning there is noise.
      if (cssImports && anyScssSeen && !entryScssSeen) {
        this.warn(
          `no SCSS file matching "${entryScss}" was processed; ` +
            `CSS imports (${[...source, ...visuals, ...components].filter((f) => f.endsWith(".css")).join(", ")}) ` +
            `were not injected anywhere.`,
        )
      }
    },
  }

  const plugins = [injectPlugin]
  if (purge !== false) {
    plugins.push(purgeInteractiveStylesCss(purge === true ? {} : purge))
  }
  return plugins
}

function validateFiles(category, files, validSet) {
  for (const file of files) {
    if (!validSet.has(file)) {
      const valid = [...validSet].join(", ")
      throw new Error(
        `"${file}" is not a valid ${category} file. Valid options: ${valid}`,
      )
    }
  }
}

function buildImports(
  source,
  visuals,
  components,
  extension,
  directive,
  suffix,
) {
  const lines = []
  for (const file of source) {
    if (file.endsWith(extension)) {
      lines.push(
        `${directive} "interactive-style-library/source/${file}"${suffix("source", file)};`,
      )
    }
  }
  for (const file of visuals) {
    if (file.endsWith(extension)) {
      lines.push(
        `${directive} "interactive-style-library/visuals/${file}"${suffix("visuals", file)};`,
      )
    }
  }
  for (const file of components) {
    if (file.endsWith(extension)) {
      lines.push(
        `${directive} "interactive-style-library/components/${file}"${suffix("components", file)};`,
      )
    }
  }
  return lines.length ? lines.join("\n") + "\n" : ""
}

function cssAlias(category, file) {
  if (file !== "colors.css") return ""
  if (category === "source") return " as src-colors"
  if (category === "visuals") return " as vis-colors"
  return ""
}
