<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
  import Option from "./lib/Option.svelte"
</script>

<ComponentPage name="Radio Buttons" previewHeight={140} codeBlockHeight={220}>
  {#snippet description()}
    Use the <code class="inline-code">src-radio</code> class on
    <code class="inline-code">&lt;input type="radio"&gt;</code>
    elements to style radio buttons in the default Guardian style.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/radio.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source_react-components-radio--docs"
    />
  {/snippet}

  {#snippet modifiers()}
    <Option group="Orientation" className="" default>Vertical</Option>
    <Option group="Orientation" className="src-radio-group--horizontal">Horizontal</Option>
  {/snippet}

  {#snippet children(activeModifiers)}
    {@const orientation = activeModifiers.get("Orientation")}
    <fieldset class={["src-radio-group", orientation].filter(Boolean).join(" ")}>
      <legend class="src-label">Pick your favourite chart</legend>
      <div class="src-radio__container">
        <input
          class="src-radio"
          type="radio"
          id="chart-bar"
          name="chart"
          value="bar"
          checked
        />
        <label for="chart-bar" class="src-radio__label">Bar</label>
      </div>
      <div class="src-radio__container">
        <input
          class="src-radio"
          type="radio"
          id="chart-line"
          name="chart"
          value="line"
        />
        <label for="chart-line" class="src-radio__label">Line</label>
      </div>
      <div class="src-radio__container">
        <input
          class="src-radio"
          type="radio"
          id="chart-pie"
          name="chart"
          value="pie"
        />
        <label for="chart-pie" class="src-radio__label">Pie</label>
      </div>
    </fieldset>
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>Always use a proper <code class="inline-code">&lt;label&gt;</code> element associated with each radio button via the <code class="inline-code">for</code> and <code class="inline-code">id</code> attributes.</li>
      <li>Group related radio buttons in a <code class="inline-code">&lt;fieldset&gt;</code> with a <code class="inline-code">&lt;legend&gt;</code> to describe the purpose of the group.</li>
      <li>The component includes proper focus states and keyboard navigation.</li>
    </ul>
  {/snippet}
</ComponentPage>
