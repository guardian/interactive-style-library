<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
</script>

<ComponentPage name="Checkbox">
  {#snippet description()}
    Use the <code class="inline-code">src-checkbox</code> class on
    <code class="inline-code">&lt;input type="checkbox"&gt;</code>
    elements to style checkboxes in the default Guardian style.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/checkbox.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source_react-components-checkbox--docs"
    />
    <ExternalLink
      type="zeroheight"
      href="https://theguardian.design/2a1e5182b/p/437902-text-input-field"
    />
  {/snippet}

  {#snippet children()}
    <div class="src-checkbox__container">
      <input type="checkbox" id="show-annotations" class="src-checkbox" />
      <label for="show-annotations" class="src-checkbox__label">
        Show annotations
      </label>
    </div>
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>Always use a proper <code class="inline-code">&lt;label&gt;</code> element associated with the checkbox via the <code class="inline-code">for</code> and <code class="inline-code">id</code> attributes.</li>
      <li>The component includes proper focus states and keyboard navigation.</li>
      <li>Supporting text can be added using the <code class="inline-code">src-checkbox__supporting</code> class within the label.</li>
    </ul>
  {/snippet}
</ComponentPage>
