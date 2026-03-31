<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
  import Option from "./lib/Option.svelte"
</script>

<ComponentPage name="Spinner" previewHeight={80} codeBlockHeight={140}>
  {#snippet description()}
    Use the <code class="inline-code">src-spinner</code> class on a
    <code class="inline-code">&lt;div&gt;</code>
    or other empty element to draw a loading spinner in its place.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/spinner.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source_react-components-spinner--docs"
    />
  {/snippet}

  {#snippet modifiers()}
    <Option group="Size" className="src-spinner--medium" default>Medium (30px)</Option>
    <Option group="Size" className="src-spinner--small">Small (26px)</Option>
    <Option group="Size" className="src-spinner--xsmall">Extra small (20px)</Option>
  {/snippet}

  {#snippet children(activeModifiers)}
    {@const size = activeModifiers.get("Size")}
    <div
      class={["src-spinner", size].filter(Boolean).join(" ")}
      role="status"
      aria-label="Loading"
    />
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>The spinner styles are purely visual and are not accessible to screen readers by default.</li>
      <li>Always include <code class="inline-code">role="status"</code> with an <code class="inline-code">aria-label</code> to make the spinner accessible.</li>
      <li>You can customize the foreground and background colours using the <code class="inline-code">--fg</code> and <code class="inline-code">--bg</code> CSS variables.</li>
    </ul>
  {/snippet}
</ComponentPage>
