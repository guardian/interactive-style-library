<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
  import Option from "./lib/Option.svelte"
</script>

<ComponentPage
  name="Label"
  previewHeight={100}
  codeBlockHeight={120}
>
  {#snippet description()}
    Use the <code class="inline-code">src-label</code> class on
    <code class="inline-code">&lt;label&gt;</code>
    elements (or other text elements) to style labels associated with inputs.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/label.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source_react-components-label--docs"
    />
    <ExternalLink
      type="zeroheight"
      href="https://theguardian.design/2a1e5182b/p/437902-text-input-field"
    />
  {/snippet}

  {#snippet modifiers()}
    <Option group="Size" className="src-label--medium" default>Medium</Option>
    <Option group="Size" className="src-label--small">Small</Option>
  {/snippet}

  {#snippet children(activeModifiers)}
    {@const size = activeModifiers.get("Size")}
    <label for="email" class={["src-label", size].filter(Boolean).join(" ")}>
      Email address
      <div class="src-label__supporting">harpreet@example.com</div>
    </label>
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>Always use <code class="inline-code">&lt;label&gt;</code> elements with proper <code class="inline-code">for</code> attributes to associate them with form controls.</li>
      <li>Use the <code class="inline-code">src-label__optional</code> sub-element to communicate optional fields.</li>
      <li>Use the <code class="inline-code">src-label__supporting</code> sub-element for helpful context or examples below the main label.</li>
    </ul>
  {/snippet}
</ComponentPage>
