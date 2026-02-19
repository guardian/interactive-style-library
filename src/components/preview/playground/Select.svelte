<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Select">
  {#snippet children(variants)}
    {@const small = variants.get("size") === "src-select--small"}
    <label for="projection" class={["src-label", small && "src-label--small"]}>
      Map projection
    </label>

    <div class={["src-select", variants.get("size")]}>
      <select id="projection">
        <option value="" disabled selected>Choose a projection</option>
        <option value="mercator">Mercator</option>
        <option value="equal-earth">Equal Earth</option>
        <option value="robinson">Robinson</option>
        <option value="winkel-tripel">Winkel Tripel</option>
      </select>
    </div>
  {/snippet}

  {#snippet controls()}
    <Variant
      label="size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-select--small" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
