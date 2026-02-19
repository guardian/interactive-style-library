<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
</script>

<ComponentPlayground name="Checkbox">
  {#snippet children()}
    <div class="src-checkbox__container">
      <input type="checkbox" id="newsletter" class="src-checkbox" />
      <label for="newsletter" class="src-label">
        Subscribe to newsletter
      </label>
    </div>
  {/snippet}
</ComponentPlayground>
