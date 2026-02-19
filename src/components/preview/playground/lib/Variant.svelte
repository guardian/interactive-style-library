<script>
  import { getContext } from "svelte"

  let { label, options } = $props()

  const variantMap = getContext("variantMap")
  const uniqueId = Math.random().toString(36).substring(3, 9)

  variantMap.set(label, "")
</script>

<fieldset class="src-radio-group src-radio-group--horizontal">
  <legend class="src-label">
    {label}
  </legend>

  {#each options as option}
    <label class="src-radio__label src-radio__container">
      <input
        class="src-radio"
        type="radio"
        name={uniqueId}
        value={option.value}
        checked={variantMap.get(label) === option.value}
        onchange={() => variantMap.set(label, option.value)}
      />
      {option.label}
    </label>
  {/each}
</fieldset>

<style>
  legend {
    text-transform: capitalize;
  }
</style>
