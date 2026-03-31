<script>
  import Sidebar from "./playground/lib/Sidebar.svelte"
  import Button from "./playground/Button.svelte"
  import Checkbox from "./playground/Checkbox.svelte"
  import Toggle from "./playground/Toggle.svelte"
  import TextInput from "./playground/TextInput.svelte"
  import Label from "./playground/Label.svelte"
  import Select from "./playground/Select.svelte"
  import Spinner from "./playground/Spinner.svelte"
  import Radio from "./playground/Radio.svelte"
  import Icon from "./playground/Icon.svelte"

  const components = [
    { slug: "button", label: "Button" },
    { slug: "checkbox", label: "Checkbox" },
    { slug: "toggle", label: "Toggle switch" },
    { slug: "text-input", label: "Input" },
    { slug: "label", label: "Label" },
    { slug: "radio", label: "Radio buttons" },
    { slug: "select", label: "Select" },
    { slug: "spinner", label: "Spinner" },
    { slug: "icon", label: "Icon" },
  ]

  let currentRoute = $state(window.location.hash.slice(1) || "button")

  $effect(() => {
    function onHashChange() {
      currentRoute = window.location.hash.slice(1) || "button"
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  })
</script>

<div class="app-layout">
  <Sidebar {currentRoute} {components} />

  <main>
    {#if currentRoute === "button"}
      <Button />
    {:else if currentRoute === "checkbox"}
      <Checkbox />
    {:else if currentRoute === "toggle"}
      <Toggle />
    {:else if currentRoute === "text-input"}
      <TextInput />
    {:else if currentRoute === "label"}
      <Label />
    {:else if currentRoute === "select"}
      <Select />
    {:else if currentRoute === "spinner"}
      <Spinner />
    {:else if currentRoute === "radio"}
      <Radio />
    {:else if currentRoute === "icon"}
      <div class="legacy-wrapper"><Icon /></div>
    {:else if currentRoute === "introduction" || currentRoute === "installation"}
      <div class="placeholder">
        <h2 class="src-headline-bold-28">
          {currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)}
        </h2>
        <p class="src-text-sans-17">Coming soon.</p>
      </div>
    {:else}
      <div class="placeholder">
        <p class="src-text-sans-17">Select a component from the sidebar.</p>
      </div>
    {/if}
  </main>
</div>

<style lang="scss">
  @use "typography-mixins" as *;

  :global(h1, h2, h3, h4, h5, h6) {
    font-family:
      "GH Guardian Headline", "Guardian Egyptian Web", Georgia, serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(:root) {
    scrollbar-gutter: stable;
  }

  .app-layout {
    display: flex;
    min-height: 100vh;
    place-self: center;

    width: 100%;

    border-left: 1px solid var(--src-neutral-86);
    border-right: 1px solid var(--src-neutral-86);
  }

  /* TODO: can we do this with mq? */
  @media (min-width: 740px) {
    .app-layout {
      max-width: 740px;
    }
  }

  @media (min-width: 980px) {
    .app-layout {
      max-width: 980px;
    }
  }

  @media (min-width: 1140px) {
    .app-layout {
      max-width: 1140px;
    }
  }

  @media (min-width: 1300px) {
    .app-layout {
      max-width: 1300px;
    }
  }

  main {
    flex: 1;
    padding: 48px 20px 64px 20px;

    width: 100%;
  }

  .legacy-wrapper {
    max-width: 740px;
  }

  .placeholder {
    max-width: 740px;
  }

  .placeholder h2 {
    margin: 0 0 8px 0;
  }

  .placeholder p {
    color: var(--src-neutral-46);
  }

  :global(.playground-button) {
    border: 1px solid var(--src-neutral-73);
    border-radius: 100px;

    color: var(--src-neutral-20);
    background-color: white;

    transition: background-color ease-in-out 0.12s;
    cursor: pointer;

    padding: 3px 10px;

    display: flex;
    align-items: center;
    gap: 3px;

    @include src-text-sans-14;

    &:hover {
      background-color: var(--src-neutral-97);
    }

    &:active {
      background-color: var(--src-neutral-93);
    }
  }

  :global(.inline-code) {
    font-family:
      ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

    background-color: var(--src-neutral-97);

    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.85rem;
    white-space: nowrap;
  }
</style>
