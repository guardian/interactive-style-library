/// <reference lib="dom" />

import sharedStyles from "./shared.css?inline"
import componentStyles from "./component-playground.css?inline"
import { renderHighlightedCode } from "./shiki.js"
import { stripBaseIndent } from "./strip-base-indent.js"

/**
 * <component-playground> - Interactive component preview with code display
 *
 * Uses a <template slot="code"> element for exact code formatting control.
 * The template content is used as-is, with only class attributes updated
 * when variants change.
 */
export class ComponentPlayground extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.baseCode = ""
  }

  connectedCallback() {
    this.render()
    this.cacheBaseCode()
    this.setupEventListeners()
    requestAnimationFrame(() => this.updateCode())
  }

  cacheBaseCode() {
    const template = this.querySelector('template[slot="code"]')
    if (template) {
      this.baseCode = stripBaseIndent(template.innerHTML)
    }
  }

  render() {
    const name = this.getAttribute("name") || "Component"

    this.shadowRoot.innerHTML = `
      <style>
        @import "/source/all.css";
        @import "/source/font-faces.css";
        ${sharedStyles}
        ${componentStyles}
      </style>

      <h2 class="src-headline-medium-24">${name}</h2>
      <div class="playground__preview">
        <slot name="preview"></slot>
      </div>
      <div class="playground__code"><pre><code></code></pre></div>
      <div class="playground__controls">
        <slot name="controls"></slot>
      </div>
    `
  }

  setupEventListeners() {
    this.addEventListener("change", (e) => {
      if (e.target.matches('input[type="radio"], input[type="checkbox"]')) {
        this.updatePreview()
        this.updateCode()
      }
    })
  }

  getClassUpdates() {
    const updates = []
    for (const fieldset of this.querySelectorAll("fieldset[data-target]")) {
      const target = this.querySelector(fieldset.dataset.target)
      if (!target) continue

      const baseClass = [...target.classList].find((c) => c.startsWith("src-"))
      const variants = [...fieldset.querySelectorAll("input:checked")]
        .map((input) => input.value)
        .filter(Boolean)

      updates.push({ target, baseClass, variants })
    }
    return updates
  }

  updatePreview() {
    for (const { target, baseClass, variants } of this.getClassUpdates()) {
      target.className = [baseClass, ...variants].filter(Boolean).join(" ")
    }
  }

  getCodeWithCurrentClasses() {
    if (!this.baseCode) return ""

    let code = this.baseCode

    for (const { target, baseClass } of this.getClassUpdates()) {
      if (!baseClass) continue
      const pattern = new RegExp(`class="(${baseClass}[^"]*)"`, "g")
      code = code.replace(pattern, `class="${target.className}"`)
    }

    return code
  }

  async updateCode() {
    const codeContainer = this.shadowRoot.querySelector(".playground__code")
    const code = this.getCodeWithCurrentClasses()

    if (!code) {
      codeContainer.innerHTML = "<pre><code>No template provided</code></pre>"
      return
    }

    await renderHighlightedCode(codeContainer, code)
  }
}
