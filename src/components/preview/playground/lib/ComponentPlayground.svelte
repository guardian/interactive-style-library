<script>
  import { setContext } from "svelte"
  import { SvelteMap } from "svelte/reactivity"
  import * as prettier from "prettier/standalone"
  import * as prettierHtml from "prettier/plugins/html"
  import CodeBlock from "./CodeBlock.svelte"

  /** @type {{
    name: string,
    children: import("svelte").Snippet,
    controls?: import("svelte").Snippet,
  }} */
  let { name, children, controls } = $props()

  const variantMap = new SvelteMap()

  setContext("variantMap", variantMap)

  let previewEl = $state()
  let displayCode = $state("")

  function classes(baseClass) {
    return [baseClass, ...variantMap.values()].filter(Boolean)
  }

  $effect(() => {
    // Reading variantMap.size triggers reactivity when the map changes
    void variantMap.size
    void [...variantMap.values()]

    if (!previewEl) return

    const html = previewEl.innerHTML.replaceAll("<!---->", "")

    prettier
      .format(html, {
        parser: "html",
        plugins: [prettierHtml],
        htmlWhitespaceSensitivity: "ignore",
        printWidth: 70,
      })
      .then((formatted) => {
        displayCode = formatted.trim()
      })
  })
</script>

<div class="playground">
  <h2 class="src-headline-medium-24">{name}</h2>
  <div class="preview">
    <div bind:this={previewEl}>
      {@render children(classes)}
    </div>
  </div>
  <CodeBlock code={displayCode} />
  {#if controls}
    <div class="controls">
      {@render controls()}
    </div>
  {/if}
</div>

<style>
  .playground {
    display: grid;
    background: white;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 28px;

    grid-template-areas:
      "title ."
      "preview controls"
      "code code";

    grid-template-columns: 1fr 1fr;
    row-gap: 24px;
    column-gap: 20px;
    border-top: 1px solid var(--src-neutral-86);
  }

  h2 {
    grid-area: title;
    margin-top: 16px;
    margin-bottom: 0;
  }

  .preview {
    grid-area: preview;

    align-content: center;
    justify-items: center;

    min-height: 120px;
    border-radius: 2px;
    border: 1px solid var(--src-neutral-86);
    padding: 1rem;
  }

  .controls {
    grid-area: controls;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
</style>
