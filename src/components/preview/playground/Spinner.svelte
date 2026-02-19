<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Spinner">
  {#snippet children(variants)}
    <div
      class={["src-spinner", variants.get("size")]}
      role="status"
      aria-label="Loading"
    ></div>
  {/snippet}

  {#snippet controls()}
    <Variant
      label="size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-spinner--small" },
        { label: "Extra small", value: "src-spinner--xsmall" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
