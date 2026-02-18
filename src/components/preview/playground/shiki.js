/// <reference lib="dom" />

import { codeToHtml } from "shiki"

/**
 * Render syntax-highlighted HTML into a container element.
 * Falls back to plain escaped text if Shiki fails.
 *
 * @param {HTMLElement} container
 * @param {string} code - Raw HTML string to highlight
 */
export async function renderHighlightedCode(container, code) {
  try {
    const highlighted = await codeToHtml(code, {
      lang: "html",
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
      colorReplacements: {
        // Remove default white background so we can set it ourselves in CSS
        "#fff": "transparent",
        "#ffffff": "transparent",
      },
    })

    container.innerHTML = highlighted
  } catch (e) {
    container.innerHTML = `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
  }
}
