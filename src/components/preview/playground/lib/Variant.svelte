<script>
  import { getContext } from "svelte"

  let { label, options } = $props()

  const variantMap = getContext("variantMap")
  const uniqueId = Math.random().toString(36).substring(3, 9)

  variantMap.set(label, "")
</script>

<fieldset>
  <p class="src-text-sans-15">
    {label}
  </p>

  <div class="options">
    {#each options as option}
      <label class="src-text-sans-17">
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
  </div>
</fieldset>

<style lang="scss">
  fieldset {
    display: grid;

    grid-template-columns: 50px auto;
    grid-template-rows: 1fr;

    gap: 12px;
  }

  .options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }

  label {
    border-radius: 4px;
    border: 2px solid var(--src-neutral-93);

    padding: 4px 20px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  input[type="radio"] {
    appearance: none;
    margin: 0;
  }

  p {
    text-transform: capitalize;
    justify-self: end;

    padding-top: 5px;

    margin: 0;
  }
</style>
