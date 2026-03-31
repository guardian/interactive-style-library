<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
  import Option from "./lib/Option.svelte"
</script>

<ComponentPage name="Select" previewHeight={130} codeBlockHeight={200}>
  {#snippet description()}
    Use the <code class="inline-code">src-select</code> class on
    <code class="inline-code">&lt;select&gt;</code>
    elements to style select dropdowns in the default Guardian style.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/select.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source_react-components-select--docs"
    />
  {/snippet}

  {#snippet modifiers()}
    <Option group="Size" className="src-select--medium" default>Medium</Option>
    <Option group="Size" className="src-select--small">Small</Option>
  {/snippet}

  {#snippet children(activeModifiers)}
    {@const size = activeModifiers.get("Size")}
    {@const small = size === "src-select--small"}
    <label for="projection" class={["src-label", small && "src-label--small"]}>
      Map projection
    </label>

    <div class={["src-select", size].filter(Boolean).join(" ")}>
      <select id="projection">
        <option value="" disabled selected>Choose a projection</option>
        <option value="mercator">Mercator</option>
        <option value="equal-earth">Equal Earth</option>
        <option value="robinson">Robinson</option>
        <option value="winkel-tripel">Winkel Tripel</option>
      </select>
    </div>
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>Always associate select dropdowns with a <code class="inline-code">&lt;label&gt;</code> using the <code class="inline-code">for</code> and <code class="inline-code">id</code> attributes.</li>
      <li>The component includes proper focus states and keyboard navigation.</li>
      <li>Use the <code class="inline-code">src-select--small</code> class with the corresponding <code class="inline-code">src-label--small</code> class to maintain consistent sizing.</li>
    </ul>
  {/snippet}
</ComponentPage>
