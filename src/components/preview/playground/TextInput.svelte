<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
  import Option from "./lib/Option.svelte"
</script>

<ComponentPage name="Text Input" previewHeight={140} codeBlockHeight={215}>
  {#snippet description()}
    Use the <code class="inline-code">src-text-input</code> class on
    <code class="inline-code">&lt;input&gt;</code>
    elements to style them in the default Guardian style.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/text-input.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source_react-components-textinput--docs"
    />
    <ExternalLink
      type="zeroheight"
      href="https://theguardian.design/2a1e5182b/p/437902-text-input-field"
    />
  {/snippet}

  {#snippet modifiers()}
    <Option group="Size" className="src-text-input--medium" default>Medium</Option>
    <Option group="Size" className="src-text-input--small">Small</Option>

    <Option group="Width" className="src-text-input--width-fluid" default>Fluid</Option>
    <Option group="Width" className="src-text-input--width-30">30 characters</Option>
    <Option group="Width" className="src-text-input--width-10">10 characters</Option>
    <Option group="Width" className="src-text-input--width-4">4 characters</Option>
  {/snippet}

  {#snippet children(activeModifiers)}
    {@const size = activeModifiers.get("Size")}
    {@const width = activeModifiers.get("Width")}
    {@const small = size === "src-text-input--small"}
    <label for="postcode" class={["src-label", small && "src-label--small"]}>
      Post code
      <div class="src-label__supporting">eg. L208LZ</div>
    </label>
    <input
      type="text"
      id="postcode"
      class={[
        "src-text-input",
        size,
        width,
      ].filter(Boolean).join(" ")}
    />
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>Always associate text inputs with a <code class="inline-code">&lt;label&gt;</code> using the <code class="inline-code">for</code> and <code class="inline-code">id</code> attributes.</li>
      <li>The component includes proper focus states with a visible blue box-shadow.</li>
      <li>Invalid inputs are automatically styled with a red border for visual feedback.</li>
      <li>Use appropriate input types (<code class="inline-code">email</code>, <code class="inline-code">tel</code>, <code class="inline-code">url</code>, etc.) to provide the correct keyboard on mobile devices.</li>
      <li>Provide supporting text via <code class="inline-code">src-label__supporting</code> to explain input requirements.</li>
    </ul>
  {/snippet}
</ComponentPage>
