<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Text Input">
  {#snippet children(classes)}
    <label for="search" class="src-label">
      Post code
      <div class="src-label__supporting">eg. L208LZ</div>
    </label>
    <input type="text" id="search" class={classes("src-text-input")} />
  {/snippet}

  {#snippet controls()}
    <Variant
      label="Size"
      options={[
        { label: "Medium", value: "" },
        { label: "Small", value: "src-text-input--small" },
      ]}
    />
    <Variant
      label="Width"
      options={[
        { label: "Fluid", value: "" },
        { label: "30 chars", value: "src-text-input--width-30" },
        { label: "10 chars", value: "src-text-input--width-10" },
        { label: "4 chars", value: "src-text-input--width-4" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
