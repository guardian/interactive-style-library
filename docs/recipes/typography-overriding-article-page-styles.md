# Overriding competing article page styles

The article page's default styles can override the [typography
classes](./typography-basic.md), particularly when dealing with standard elements like `<p>` and
`<h2>`.

In these cases, use the typography mixins inside selectors with enough [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity)
to beat the article page's default styles.

```svelte
<h2>Chip wreck! Thousands of chips wash ashore on beach</h2>

<p>Thousands of bags of chips have washed up on a beach in Sussex.</p>

<p>
  The chips washed up near Eastbourne after several shipping containers
  containing "food and packaging" came ashore nearby earlier this week.
</p>

<style lang="scss">
   // This `.interactive-atom h2` selector is more specific than the `.src-headline-medium-28`
   // class' selector, so it should beat competing article page styles
  .interactive-atom h2 {
    @include src-headline-medium-28;
  }

   // `interactive-atom` is a standard wrapper class on interactive atoms, but we could
   // use any parent class or element here to create a more specific selector.
  .interactive-atom p {
    @include src-article-17;
  }

  .interactive-atom p:nth-of-type(2) {
    // mixins copy-and-paste the class' styles into this rule.
    // They're named identically to the typography classes.
    @include src-article-bold-17;
  }
</style>
```

If specificity isn't enough, each typography mixin accepts an `important` argument that flags every declaration as `!important`:

```scss
.interactive-atom h2 {
  @include src-headline-medium-28(important);
}
```
