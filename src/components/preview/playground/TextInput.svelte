<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Text Input">
  {#snippet children(classes)}
    <label for="email" class="src-label">
      Email address
      <div class="src-label__supporting">e.g. harpreet@example.com</div>
    </label>
    <input
      type="email"
      id="email"
      class={classes("src-text-input")}
      placeholder="Enter your email"
    />
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
