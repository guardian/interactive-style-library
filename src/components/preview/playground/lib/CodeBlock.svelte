<script>
  import { renderHighlightedCode } from "./shiki.js"
  import Copy from "./icons/Copy.svelte"

  /**
   * @type {{
   *  code: string,
   *  height?: number
   * }}
   */
  let { code, height } = $props()

  let container = $state()
  let copied = $state(false)

  $effect(() => {
    if (container && code) {
      renderHighlightedCode(container, code)
    }
  })

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    copied = true
    setTimeout(() => (copied = false), 2000)
  }
</script>

<div style="--height: {height}px" class="code">
  <button class="copy-button playground-button" onclick={copyCode}>
    {#if copied}
      Copied!
    {:else}
      <Copy />
      Copy
    {/if}
  </button>
  <div bind:this={container}>
    <pre>
      <code>{code}</code>
    </pre>
  </div>
</div>

<style>
  .code {
    grid-area: code;
    position: relative;
    background-color: #fbfbfb;
    border-top: 1px solid var(--src-neutral-86);

    padding: 8px 12px;

    overflow: auto;

    max-height: var(--height, 200px);
    height: var(--height, 200px);
  }

  .copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .code :global(pre) {
    margin: 0;
    padding: 12px 4px;

    font-family:
      ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

    font-size: 0.8rem;
    line-height: 1.5;
  }

  .code :global(code) {
    background: none !important;
  }
</style>
