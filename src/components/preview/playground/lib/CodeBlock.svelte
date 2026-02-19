<script>
  import { renderHighlightedCode } from "./shiki.js"

  let { code } = $props()
  let container = $state()

  $effect(() => {
    if (container && code) {
      renderHighlightedCode(container, code)
    }
  })
</script>

<div class="code" bind:this={container}>
  <pre><code>{code}</code></pre>
</div>

<style>
  .code {
    grid-area: code;
    background-color: var(--src-neutral-97);
    border: 1px solid var(--src-neutral-86);
    border-radius: 4px;
    overflow: auto;
    margin: 0;
    max-height: 300px;
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
</style>
