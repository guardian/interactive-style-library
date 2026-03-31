<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
  import Option from "./lib/Option.svelte"
</script>

<ComponentPage
  name="Toggle Switch"
  previewHeight={80}
  codeBlockHeight={215}
>
  {#snippet description()}
    Use the <code class="inline-code">src-toggle</code> class on
    <code class="inline-code">&lt;input type="checkbox"&gt;</code>
    elements to style them as toggle switches in the default Guardian style.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/toggle.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source-development-kitchen_react-components-toggleswitch--docs"
    />
  {/snippet}

  {#snippet modifiers()}
    <Option group="Tick Icon" className="src-toggle--no-tick">Hide tick icon</Option>
  {/snippet}

  {#snippet children(activeModifiers)}
    {@const tickIcon = activeModifiers.get("Tick Icon")}
    <div class="src-toggle__container">
      <input type="checkbox" role="switch" id="log-scale" class={["src-toggle", tickIcon].filter(Boolean).join(" ")} />
      <label for="log-scale" class="src-toggle__label">Log scale</label>
    </div>
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>Always use a proper <code class="inline-code">&lt;label&gt;</code> element associated with the toggle via the <code class="inline-code">for</code> and <code class="inline-code">id</code> attributes.</li>
      <li>The component includes proper focus states with a visible outline.</li>
      <li>Using <code class="inline-code">role="switch"</code> conveys the input's state as "on"/"off" versus "checked"/"unchecked" to assistive technology, which is preferable for binary toggle switches.</li>
    </ul>
  {/snippet}
</ComponentPage>
