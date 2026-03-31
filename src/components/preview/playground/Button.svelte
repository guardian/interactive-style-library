<script>
  import ComponentPage from "./lib/ComponentPage.svelte"
  import ExternalLink from "./lib/ExternalLink.svelte"
  import Option from "./lib/Option.svelte"
</script>

<ComponentPage
  previewHeight={100}
  codeBlockHeight={100}
  name="Button"
>
  {#snippet description()}
    Add <code class="inline-code">src-button</code>
    to a
    <code class="inline-code">&lt;button&gt;</code>
    or
    <code class="inline-code">&lt;a&gt;</code>
    element to style it as a Guardian button.
  {/snippet}

  {#snippet links()}
    <ExternalLink
      type="github"
      href="https://github.com/guardian/interactive-style-library/blob/main/dist/components/button.css"
    />
    <ExternalLink
      type="storybook"
      href="https://guardian.github.io/storybooks/?path=/docs/source_react-components-button--docs"
    />
    <ExternalLink
      type="zeroheight"
      href="https://theguardian.design/2a1e5182b/p/435225-button"
    />
  {/snippet}

  {#snippet modifiers()}
    <Option group="Size" className="src-button--medium" default>
      Default 40px height.
    </Option>
    <Option group="Size" className="src-button--small">
      Smaller 32px height.
    </Option>
    <Option group="Size" className="src-button--xsmall">
      Smallest 16px height.
    </Option>

    <Option group="Priority" className="src-button--primary" default>
      Dark background, light text.
    </Option>
    <Option group="Priority" className="src-button--secondary">
      Pale background, dark text.
    </Option>
    <Option group="Priority" className="src-button--tertiary">
      No background, dark border and text.
    </Option>
  {/snippet}

  {#snippet children(activeModifiers)}
    {@const size = activeModifiers.get("Size")}
    {@const priority = activeModifiers.get("Priority")}
    <button
      class={[
        "src-button",
        size !== "src-button--medium" ? size : "",
        priority !== "src-button--primary" ? priority : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Submit
    </button>
  {/snippet}

  {#snippet usageNotes()}
    <ul>
      <li>
        The component includes proper focus states with a visible outline.
      </li>
      <li>
        Use semantic <code class="inline-code">&lt;button&gt;</code>
        elements for actions and
        <code class="inline-code">&lt;a&gt;</code>
        elements styled as buttons for navigation.
      </li>
      <li>Always provide descriptive text content for buttons.</li>
      <li>
        The <code class="inline-code">:disabled</code>
        state includes proper cursor styling.
      </li>
      <li>Keyboard navigation is fully supported.</li>
    </ul>
  {/snippet}
</ComponentPage>
