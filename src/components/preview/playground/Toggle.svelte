<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Toggle Switch">
  {#snippet children(classes)}
    <div class="src-toggle__container">
      <input type="checkbox" id="show-foo-bar" class={classes("src-toggle")} />
      <label for="show-foo-bar" class="src-toggle__label"> Show foo bar </label>
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
