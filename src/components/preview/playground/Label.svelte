<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Label">
  {#snippet children(variants)}
    <label for="headline" class={["src-label", variants.get("size")]}
      >Headline</label
    >
  {/snippet}

  {#snippet controls()}
    <Variant
      label="size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-label--small" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
