<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
</script>

<ComponentPlayground name="Checkbox">
  {#snippet children()}
    <div class="src-checkbox__container">
      <input type="checkbox" id="show-annotations" class="src-checkbox" />
      <label for="show-annotations" class="src-checkbox__label">
        Show annotations
      </label>
    </div>
  {/snippet}
</ComponentPlayground>
