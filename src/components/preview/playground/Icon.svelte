<script>
  import { renderHighlightedCode } from "./lib/shiki.js"

  const ICONS_PER_PAGE = 6

  let icons = $state([])
  let currentPage = $state(0)
  let selectedIcon = $state(null)
  let codeContainer = $state()

  let totalPages = $derived(Math.ceil(icons.length / ICONS_PER_PAGE))
  let start = $derived(currentPage * ICONS_PER_PAGE)
  let end = $derived(start + ICONS_PER_PAGE)
  let pageIcons = $derived(icons.slice(start, end))

  async function loadIconsFromCss() {
    try {
      const response = await fetch("/components/icons.css")
      const css = await response.text()
      const matches = css.matchAll(/\.src-icon--([a-z0-9-]+)\s*\{/g)
      const sizeVariants = new Set(["medium", "small", "xsmall"])
      icons = [...matches]
        .map((m) => m[1])
        .filter((name) => !sizeVariants.has(name))
        .sort()
    } catch (e) {
      console.error("Failed to load icons from CSS:", e)
    }
  }

  function selectIcon(iconName) {
    selectedIcon = iconName
  }

  $effect(() => {
    if (codeContainer && selectedIcon) {
      const code = `<div class="src-icon--${selectedIcon}"></div>`
      renderHighlightedCode(codeContainer, code)
    }
  })

  loadIconsFromCss()
</script>

<div class="playground">
  <h2 class="src-headline-medium-24">Icons</h2>
  <div class="grid">
    {#each pageIcons as icon}
      <button
        class="icon-item"
        class:selected={selectedIcon === icon}
        onclick={() => selectIcon(icon)}
      >
        <div class="src-icon--{icon}"></div>
        <span>{icon}</span>
      </button>
    {/each}
  </div>
  <div class="code" bind:this={codeContainer}>
    {#if !selectedIcon}
      <span class="placeholder">Select an icon</span>
    {/if}
  </div>
  <div class="pagination">
    <button
      class="prev"
      disabled={currentPage === 0}
      onclick={() => currentPage--}
    >
      Prev
    </button>
    <span class="pagination__info">
      {start + 1}-{Math.min(end, icons.length)} of {icons.length}
    </span>
    <button
      class="next"
      disabled={currentPage >= totalPages - 1}
      onclick={() => currentPage++}
    >
      Next
    </button>
  </div>
</div>

<style>
  .playground {
    display: grid;
    background: white;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 28px;

    grid-template-areas:
      "title"
      "grid"
      "code"
      "pagination";

    row-gap: 24px;
    border-top: 1px solid var(--src-neutral-86);
  }

  h2 {
    grid-area: title;
    margin-top: 16px;
    margin-bottom: 0;
  }

  .grid {
    grid-area: grid;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    background: #f6f6f6;
    padding: 1rem;
    border-radius: 4px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;
    border: none;
    background: transparent;
    font-family: inherit;
  }

  .icon-item:hover {
    background: #e0e0e0;
  }

  .icon-item.selected {
    background: #052962;
  }

  .icon-item.selected span {
    color: white;
  }

  .icon-item > div {
    width: 24px;
    height: 24px;
  }

  .icon-item.selected > div {
    background-color: white;
  }

  .icon-item span {
    font-size: 0.65rem;
    color: #707070;
    text-align: center;
    word-break: break-word;
  }

  .code {
    grid-area: code;
    background-color: var(--src-neutral-97);
    border: 1px solid var(--src-neutral-86);
    border-radius: 4px;
    overflow: auto;
    margin: 0;
    display: flex;
    align-items: center;
  }

  .code :global(pre) {
    margin: 0;
    padding: 1rem;
    font-family:
      ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .code :global(code) {
    background: none !important;
  }

  .placeholder {
    color: #6a737d;
    font-family:
      ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    font-size: 0.8rem;
    padding: 1rem;
  }

  .pagination {
    grid-area: pagination;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family:
      GuardianTextSans, "Guardian Text Sans Web", "Helvetica Neue", Helvetica,
      Arial, sans-serif;
    font-size: 0.875rem;
  }

  .pagination button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #dcdcdc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
  }

  .pagination button:hover:not(:disabled) {
    background: #f6f6f6;
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination__info {
    color: #707070;
  }
</style>
