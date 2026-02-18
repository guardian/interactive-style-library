/// <reference lib="dom" />

import sharedStyles from "./shared.css?inline"
import iconStyles from "./icon-playground.css?inline"
import { renderHighlightedCode } from "./shiki.js"

/**
 * <icon-playground> - Paginated icon browser with code display
 */
export class IconPlayground extends HTMLElement {
  static ICONS_PER_PAGE = 6

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.currentPage = 0
    this.selectedIcon = null
    this.icons = []
  }

  async connectedCallback() {
    this.render()
    this.icons = await this.loadIconsFromCss()
    this.setupEventListeners()
    this.updateGrid()
  }

  async loadIconsFromCss() {
    try {
      const response = await fetch("/components/icons.css")
      const css = await response.text()

      const matches = css.matchAll(/\.src-icon--([a-z0-9-]+)\s*\{/g)
      const sizeVariants = new Set(["medium", "small", "xsmall"])

      const icons = [...matches]
        .map((m) => m[1])
        .filter((name) => !sizeVariants.has(name))
        .sort()

      return icons
    } catch (e) {
      console.error("Failed to load icons from CSS:", e)
      return []
    }
  }

  get totalPages() {
    return Math.ceil(this.icons.length / IconPlayground.ICONS_PER_PAGE)
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/components/icons.css">
      <style>${sharedStyles}\n${iconStyles}</style>
      <h2>Icons</h2>
      <div class="playground__grid"></div>
      <div class="playground__code"><span class="placeholder">Select an icon</span></div>
      <div class="pagination">
        <button class="prev">Prev</button>
        <span class="pagination__info"></span>
        <button class="next">Next</button>
      </div>
    `
  }

  setupEventListeners() {
    this.shadowRoot.querySelector(".prev").addEventListener("click", () => {
      if (this.currentPage > 0) {
        this.currentPage--
        this.updateGrid()
      }
    })

    this.shadowRoot.querySelector(".next").addEventListener("click", () => {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        this.updateGrid()
      }
    })

    this.shadowRoot
      .querySelector(".playground__grid")
      .addEventListener("click", (e) => {
        const item = e.target.closest(".icon-item")
        if (item) {
          this.selectIcon(item.dataset.icon)
        }
      })
  }

  updateGrid() {
    const grid = this.shadowRoot.querySelector(".playground__grid")
    const start = this.currentPage * IconPlayground.ICONS_PER_PAGE
    const end = start + IconPlayground.ICONS_PER_PAGE
    const pageIcons = this.icons.slice(start, end)

    grid.innerHTML = pageIcons
      .map(
        (icon) => `
      <div class="icon-item ${this.selectedIcon === icon ? "selected" : ""}" data-icon="${icon}">
        <div class="src-icon--${icon}"></div>
        <span>${icon}</span>
      </div>
    `,
      )
      .join("")

    const info = this.shadowRoot.querySelector(".pagination__info")
    info.textContent = `${start + 1}-${Math.min(end, this.icons.length)} of ${this.icons.length}`

    this.shadowRoot.querySelector(".prev").disabled = this.currentPage === 0
    this.shadowRoot.querySelector(".next").disabled =
      this.currentPage >= this.totalPages - 1
  }

  selectIcon(iconName) {
    this.selectedIcon = iconName
    this.updateGrid()
    this.updateCode()
  }

  async updateCode() {
    const codeContainer = this.shadowRoot.querySelector(".playground__code")

    if (!this.selectedIcon) {
      codeContainer.innerHTML =
        '<span class="placeholder">Select an icon</span>'
      return
    }

    const code = `<div class="src-icon--${this.selectedIcon}"></div>`
    await renderHighlightedCode(codeContainer, code)
  }
}
