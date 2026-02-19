<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Select">
  {#snippet children()}
    <label for="country" class="src-label">
      Country
      <div class="src-label__supporting">Select your country</div>
    </label>
    <div class="src-select__wrapper">
      <select id="country" class="src-select">
        <option value="">Choose an option</option>
        <option value="uk">United Kingdom</option>
        <option value="us">United States</option>
        <option value="au">Australia</option>
      </select>
    </div>
  {/snippet}
</ComponentPlayground>
