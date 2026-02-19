<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Select">
  {#snippet children(classes)}
    <label for="projection" class="src-label">Map projection</label>
    <div class={classes("src-select")}>
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
      label="Size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-select--small" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
