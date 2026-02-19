<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Spinner">
  {#snippet children(classes)}
    <div
      class={classes("src-spinner")}
      role="status"
      aria-label="Loading"
    ></div>
  {/snippet}

  {#snippet controls()}
    <Variant
      label="Size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-spinner--small" },
        { label: "Extra small", value: "src-spinner--xsmall" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
