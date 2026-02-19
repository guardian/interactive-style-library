<script>
  import { getContext } from "svelte"

  let { label, options } = $props()

  const variantMap = getContext("variantMap")
  const uniqueId = Math.random().toString(36).substring(3, 9)

  variantMap.set(label, "")
</script>

<fieldset>
  <legend style="text-transform: capitalize">{label}</legend>
  {#each options as option}
    <label>
      <input
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
