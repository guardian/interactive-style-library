## Toggle Switch

```html
<script>
  import "@guardian/interactive-source-components/toggle.css"
</script>

<div class="src-toggle__container">
  <input type="checkbox" role="switch" id="show-latest" class="src-toggle" />
  <label for="show-latest" class="src-toggle__label">
    Show latest figures
  </label>
</div>
```

Use the `src-toggle` class on `<input type="checkbox">` elements to style them as toggle switches in the default Guardian style.

You don't need to wrap the toggle in `<div class="src-toggle__container">`, but doing so aligns the input with a neighbouring label, as in the example above.

> [!NOTE]
> Unlike other input fields (such as [Text input](./TEXT-INPUT.md)), you don't need to import the `label.css` file to get label styling: toggle switches have their own unique label style via `src-toggle__label`.

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-toggleswitch--docs)&nbsp;&nbsp;<img width="16" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/05c743-toggle-switch)

### Variants

| Class                 | Description                                               | Default |
| --------------------- | --------------------------------------------------------- | ------- |
| `src-toggle--no-tick` | Hides the tick icon shown inside the toggle when checked. |         |

### Custom properties

The checked and unchecked background colours can be customised using CSS custom properties:

| Property         | Description                       | Default   |
| ---------------- | --------------------------------- | --------- |
| `--bg-checked`   | Background colour when checked.   | `#22874d` |
| `--bg-unchecked` | Background colour when unchecked. | `#707070` |

```css
.src-toggle {
  --bg-checked: hotpink;
  --bg-unchecked: lightgrey;
}
```

### Accessibility

- Always use a proper `<label>` element associated with the toggle via the `for` and `id` attributes
- The component includes proper focus states with a visible outline
- `role="switch"` isn't necessary here, but it conveys the input's state as "on"/"off" versus
  "checked"/"unchecked" to assistive technology, which is preferable for binary toggle switches – read [WCAG's docs on switches](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
