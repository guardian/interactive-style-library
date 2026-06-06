<script>
  import { SvelteMap } from "svelte/reactivity"

  /** @type {{
    groups: SvelteMap<string, Array<{
      className: string,
      description: string,
      isDefault: boolean,
    }>>,
    activeModifiers: SvelteMap<string, string>,
  }} */
  let { groups, activeModifiers } = $props()

  function toggleModifier(groupName, modifiers, modifier) {
    if (activeModifiers.get(groupName) === modifier.className) {
      const defaultMod = modifiers.find((m) => m.isDefault)
      activeModifiers.set(groupName, defaultMod?.className ?? "")
    } else {
      activeModifiers.set(groupName, modifier.className)
    }
  }
</script>

<div class="grid" role="table">
  <div class="header" role="row">
    <span class="col-variant" role="columnheader">Variant</span>
    <span role="columnheader"></span>
    <span class="col-class" role="columnheader">Class</span>
    <span class="col-description" role="columnheader">Description</span>
    <span class="col-default" role="columnheader">Default</span>
  </div>

  {#each groups as [groupName, modifiers]}
    {#each modifiers as modifier, i}
      {@const id = `mod-${groupName}-${i}`}
      <div class="row" role="row">
        <span class="col-variant" role="cell">
          {#if i === 0}{groupName}{/if}
        </span>
        <span class="col-checkbox" role="cell">
          <input
            {id}
            type="checkbox"
            class="src-checkbox"
            checked={activeModifiers.get(groupName) === modifier.className}
            onchange={() => toggleModifier(groupName, modifiers, modifier)}
          />
        </span>
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <label class="col-class" for={id} role="cell">
          <code class="inline-code">{modifier.className}</code>
        </label>
        <span class="col-description" role="cell">
          {@render modifier.description()}
        </span>
        <span class="col-default" role="cell">
          {#if modifier.isDefault}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--src-neutral-46)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          {/if}
        </span>
      </div>
    {/each}
  {/each}
</div>

<style lang="scss">
  @use "typography" as *;

  .grid {
    display: grid;
    grid-template-columns: 100px 36px auto 1fr 64px;
    align-items: center;
  }

  .header,
  .row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }

  .header {
    border-bottom: 1px solid var(--src-neutral-73);
    color: var(--src-neutral-46);
    font-weight: normal;
    padding: 8px 0;

    @include src-text-sans-14;
  }

  .row {
    border-bottom: 1px solid var(--src-neutral-93);
    padding: 10px 0;

    align-items: center;
  }

  .col-variant {
    color: var(--src-neutral-20);
  }

  .col-checkbox {
    text-align: center;
    line-height: 0;
  }

  .col-class {
    cursor: pointer;
  }

  .row .col-description, .row  .col-variant {
    @include src-text-sans-15;
    color: var(--src-neutral-20);
  }

  .col-default {
    text-align: center;
  }

  input[type="checkbox"] {
    cursor: pointer;
  }
</style>
