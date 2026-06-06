<script>
  import { setContext } from "svelte"
  import { SvelteMap } from "svelte/reactivity"
  import * as prettier from "prettier/standalone"
  import * as prettierHtml from "prettier/plugins/html"
  import CodeBlock from "./CodeBlock.svelte"
  import Moon from "./icons/Moon.svelte"
  import ModifiersTable from "./ModifiersTable.svelte"

  /** @type {{
    name: string,
    description?: import("svelte").Snippet,
    links?: import("svelte").Snippet,
    modifiers?: import("svelte").Snippet,
    usageNotes?: import("svelte").Snippet,
    children: import("svelte").Snippet<[SvelteMap<string, string>]>,
    codeBlockHeight: number,
    previewHeight: number,
  }} */
  let {
    name,
    description,
    links,
    modifiers,
    usageNotes,
    children,
    codeBlockHeight,
    previewHeight = 100,
  } = $props()

  /** @type {SvelteMap<string, Array<{ className: string, description: string, isDefault: boolean }>>} */
  const groups = new SvelteMap()
  const activeModifiers = new SvelteMap()

  setContext("modifiers", { groups, activeModifiers })

  let previewEl = $state()
  let displayCode = $state("")

  $effect(() => {
    void [...activeModifiers.values()]

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

<article class="component-page">
  <h2>{name}</h2>

  {#if description}
    <p class="description">{@render description()}</p>
  {/if}

  {#if links}
    <div class="external-links">
      {@render links()}
    </div>
  {/if}

  <div class="preview-container">
    <div style:--preview-height="{previewHeight}px" class="preview">
      <button class="playground-button theme-toggle" disabled>
        <Moon />
        Switch theme
      </button>
      <div bind:this={previewEl}>
        {@render children(activeModifiers)}
      </div>
    </div>

    <CodeBlock height={codeBlockHeight} code={displayCode} />
  </div>

  {#if modifiers}
    {@render modifiers()}
    <section class="modifiers">
      <h3>Modifiers</h3>
      <ModifiersTable {groups} {activeModifiers} />
    </section>
  {/if}

  {#if usageNotes}
    <section class="usage-notes">
      <h3>Usage notes</h3>
      {@render usageNotes()}
    </section>
  {/if}
</article>

<style lang="scss">
  @use "typography" as *;

  .component-page {
    max-width: 680px;
  }

  h2 {
    @include src-headline-medium-28;
    margin-top: 0;
    margin-bottom: 8px;
  }

  .description {
    margin-bottom: 12px;
    color: var(--src-neutral-7);
    @include src-text-sans-15;
  }

  .external-links {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    margin-top: 16px;
  }

  .external-links :global(a) {
    color: var(--src-brand-500);

    display: inline-flex;
    align-items: center;
    gap: 5px;

    @include src-text-sans-15;
  }

  .external-links :global(a:hover) {
    text-decoration: underline;
  }

  .preview-container {
    border: 1px solid var(--src-neutral-86);
    border-radius: 3px;
    overflow: hidden;
  }

  .preview {
    position: relative;
    display: grid;
    align-content: center;

    height: var(--preview-height);

    background-color: #fdfdfd;
    background-image: radial-gradient(
      circle,
      var(--src-neutral-46),
      transparent 1.2px
    );
    background-size: 24px 24px;

    padding: 32px;
  }

  .theme-toggle {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .usage-notes,
  .modifiers {
    margin-top: 36px;
  }

  h3 {
    @include src-headline-medium-20;
    margin-bottom: 12px;
  }

  .usage-notes :global(ul) {
    margin: 0;
    padding-left: 20px;
  }

  .usage-notes :global(li) {
    margin-bottom: 6px;
    color: var(--src-neutral-20);

    @include src-text-sans-15;
  }
</style>
