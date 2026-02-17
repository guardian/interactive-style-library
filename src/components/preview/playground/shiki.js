/// <reference lib="dom" />

import { codeToHtml } from "shiki"

const SHIKI_OPTIONS = {
  lang: "html",
  theme: "github-dark",
}

/**
 * Render syntax-highlighted HTML into a container element.
 * Falls back to plain escaped text if Shiki fails.
 *
 * @param {HTMLElement} container
 * @param {string} code - Raw HTML string to highlight
 */
export async function renderHighlightedCode(container, code) {
  try {
    const highlighted = await codeToHtml(code, SHIKI_OPTIONS)
    container.innerHTML = highlighted
  } catch (e) {
    container.innerHTML = `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
  }
}
