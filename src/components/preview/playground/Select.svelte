<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Select">
  {#snippet children()}
    <label for="projection" class="src-label"> Map projection </label>
    <div class="src-select__container">
      <select id="projection" class="src-select">
        <option value="">Choose a projection</option>
        <option value="mercator">Mercator</option>
        <option value="equal-earth">Equal Earth</option>
        <option value="robinson">Robinson</option>
        <option value="winkel-tripel">Winkel Tripel</option>
      </select>
    </div>
  {/snippet}
</ComponentPlayground>
