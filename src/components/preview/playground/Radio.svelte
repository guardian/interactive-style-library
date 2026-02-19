<script>
  import ComponentPlayground from "./lib/ComponentPlayground.svelte"
  import Variant from "./lib/Variant.svelte"
</script>

<ComponentPlayground name="Radio Buttons">
  {#snippet children(classes)}
    <fieldset class={classes("src-radio-group")}>
      <legend class="src-label">Pick your favourite chart</legend>
      <div class="src-radio__container">
        <input
          class="src-radio"
          type="radio"
          id="chart-bar"
          name="chart"
          value="bar"
          checked
        />
        <label for="chart-bar" class="src-radio__label">Bar</label>
      </div>
      <div class="src-radio__container">
        <input
          class="src-radio"
          type="radio"
          id="chart-line"
          name="chart"
          value="line"
        />
        <label for="chart-line" class="src-radio__label">Line</label>
      </div>
      <div class="src-radio__container">
        <input
          class="src-radio"
          type="radio"
          id="chart-pie"
          name="chart"
          value="pie"
        />
        <label for="chart-pie" class="src-radio__label">Pie</label>
      </div>
    </fieldset>
  {/snippet}

  {#snippet controls()}
    <Variant
      label="Orientation"
      options={[
        { label: "Vertical", value: "" },
        { label: "Horizontal", value: "src-radio-group--horizontal" },
      ]}
    />
  {/snippet}
</ComponentPlayground>
