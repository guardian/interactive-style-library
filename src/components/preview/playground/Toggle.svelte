<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Toggle Switch">
  {#snippet children(classes)}
    <div class="src-toggle__container">
      <input type="checkbox" id="log-scale" class={classes("src-toggle")} />
      <label for="log-scale" class="src-toggle__label">Log scale</label>
    </div>
  {/snippet}

  {#snippet controls()}
    <Variant
      label="Tick icon"
      options={[
        { label: "Show", value: "" },
        { label: "Hide", value: "src-toggle--no-tick" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
