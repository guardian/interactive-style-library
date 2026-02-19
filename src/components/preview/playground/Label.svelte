<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Label">
  {#snippet children(classes)}
    <label for="headline" class={classes("src-label")}>Headline</label>
  {/snippet}

  {#snippet controls()}
    <Variant
      label="Size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-label--small" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
