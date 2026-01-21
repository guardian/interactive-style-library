import { camelToKebab } from "../utils.js"

const DARK_MODE_SELECTOR = ':root:not([data-color-scheme="light"])'

/**
 * Builder for generating CSS rules or SCSS mixins with consistent formatting.
 *
 * @example
 * const writer = style()
 *   .prop('font-family', '"Guardian Headline"')
 *   .prop('color', '#121212')
 *   .darkMode('color', '#dcdcdc')
 *
 * writer.buildCss('.vis-chart-headline')
 * writer.buildMixin('vis-chart-headline')
 */
export class StyleWriter {
  #props = []
  #darkModeProps = []
  /** @type {Map<number, Array<{property: string, value: string|number}>>} */
  #breakpointProps = new Map()

  /**
   * Add a CSS property.
   * @param {string} property - Property name (camelCase or kebab-case)
   * @param {string|number} value
   */
  prop(property, value) {
    if (value !== undefined && value !== null) {
      this.#props.push({ property: camelToKebab(property), value })
    }
    return this
  }

  /**
   * Add multiple CSS properties from an object.
   * @param {Record<string, string|number>} props
   */
  props(props) {
    for (const [property, value] of Object.entries(props)) {
      this.prop(property, value)
    }
    return this
  }

  /**
   * Add a dark mode override for a property.
   * @param {string} property - Property name (camelCase or kebab-case)
   * @param {string|number} value
   */
  darkMode(property, value) {
    if (value !== undefined && value !== null) {
      this.#darkModeProps.push({ property: camelToKebab(property), value })
    }
    return this
  }

  /**
   * Add a breakpoint override for a property.
   * @param {number} minWidth - Minimum width in pixels
   * @param {string} property - Property name (camelCase or kebab-case)
   * @param {string|number} value
   */
  breakpoint(minWidth, property, value) {
    if (value !== undefined && value !== null) {
      if (!this.#breakpointProps.has(minWidth)) {
        this.#breakpointProps.set(minWidth, [])
      }
      this.#breakpointProps
        .get(minWidth)
        .push({ property: camelToKebab(property), value })
    }
    return this
  }

  /**
   * Build a CSS rule string.
   * @param {string} selector - CSS selector
   * @returns {string}
   */
  buildCss(selector) {
    const lines = []

    // Main rule
    lines.push(`${selector} {`)
    for (const { property, value } of this.#props) {
      lines.push(`  ${property}: ${value};`)
    }
    lines.push(`}`)

    // Breakpoint overrides (sorted by min-width)
    const sortedBreakpoints = [...this.#breakpointProps.entries()].sort(
      (a, b) => a[0] - b[0],
    )
    for (const [minWidth, props] of sortedBreakpoints) {
      lines.push(``)
      lines.push(`@media (min-width: ${minWidth}px) {`)
      lines.push(`  ${selector} {`)
      for (const { property, value } of props) {
        lines.push(`    ${property}: ${value};`)
      }
      lines.push(`  }`)
      lines.push(`}`)
    }

    // Dark mode overrides
    if (this.#darkModeProps.length > 0) {
      lines.push(``)
      lines.push(`@media (prefers-color-scheme: dark) {`)
      lines.push(`  ${DARK_MODE_SELECTOR} :is(${selector}) {`)
      for (const { property, value } of this.#darkModeProps) {
        lines.push(`    ${property}: ${value};`)
      }
      lines.push(`  }`)
      lines.push(`}`)
    }

    return lines.join("\n")
  }

  /**
   * Build an SCSS mixin string.
   * @param {string} name - Mixin name
   * @returns {string}
   */
  buildMixin(name) {
    const lines = []

    // SassDoc block
    lines.push(`/// \`\`\`sass`)
    for (const { property, value } of this.#props) {
      const darkOverride = this.#darkModeProps.find(
        (p) => p.property === property,
      )
      if (darkOverride) {
        lines.push(
          `/// ${property}: ${value}; /* Dark mode => ${darkOverride.value} */`,
        )
      } else {
        lines.push(`/// ${property}: ${value};`)
      }
    }
    lines.push(`/// \`\`\``)

    // Mixin definition
    lines.push(`@mixin ${name} {`)
    for (const { property, value } of this.#props) {
      lines.push(`  ${property}: ${value};`)
    }

    // Breakpoint overrides (sorted by min-width, nested)
    const sortedBreakpoints = [...this.#breakpointProps.entries()].sort(
      (a, b) => a[0] - b[0],
    )
    for (const [minWidth, props] of sortedBreakpoints) {
      lines.push(``)
      lines.push(`  @media (min-width: ${minWidth}px) {`)
      for (const { property, value } of props) {
        lines.push(`    ${property}: ${value};`)
      }
      lines.push(`  }`)
    }

    // Dark mode overrides (nested with &)
    if (this.#darkModeProps.length > 0) {
      lines.push(``)
      lines.push(`  @media (prefers-color-scheme: dark) {`)
      lines.push(`    ${DARK_MODE_SELECTOR} :is(&) {`)
      for (const { property, value } of this.#darkModeProps) {
        lines.push(`      ${property}: ${value};`)
      }
      lines.push(`    }`)
      lines.push(`  }`)
    }

    lines.push(`}`)

    return lines.join("\n")
  }
}

/**
 * Create a new StyleWriter instance.
 * @returns {StyleWriter}
 */
export function style() {
  return new StyleWriter()
}
