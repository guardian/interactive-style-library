<script>
  import { getContext } from "svelte"

  /**
   * @type {{
   *  group: string,
   *  className: string,
   *  default?: boolean,
   *  children: import("svelte").Snippet,
   * }}
   */
  let { group, className, default: isDefault = false, children } = $props()

  /**
   * @type {{
   *  groups: import("svelte/reactivity").SvelteMap,
   *  activeModifiers: import("svelte/reactivity").SvelteMap
   * }}
   */
  const { groups, activeModifiers } = getContext("modifiers")

  const modifiers = groups.get(group) ?? []

  modifiers.push({ className, isDefault, description: children })
  groups.set(group, modifiers)

  if (isDefault && !activeModifiers.has(group)) {
    activeModifiers.set(group, className)
  }
</script>
