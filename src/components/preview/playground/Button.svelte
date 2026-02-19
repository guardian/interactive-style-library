<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Button">
  {#snippet children(classes)}
    <button class={classes("src-button")}>Click me</button>
  {/snippet}

  {#snippet controls()}
    <Variant
      label="Priority"
      options={[
        { label: "Primary", value: "" },
        { label: "Secondary", value: "src-button--secondary" },
        { label: "Tertiary", value: "src-button--tertiary" },
        { label: "Subdued", value: "src-button--subdued" },
      ]}
    />
    <Variant
      label="Size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-button--small" },
        { label: "Extra small", value: "src-button--xsmall" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
