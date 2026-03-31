<script>
  const icons = {
    github: {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
      defaultText: "View CSS",
    },
    storybook: {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg",
      defaultText: "Original component",
    },
    zeroheight: {
      src: "https://zeroheight.com/favicon.ico",
      defaultText: "Design guide",
    },
  }

  /** @type {{
    type: "github" | "storybook" | "zeroheight",
    href: string,
    text?: string,
  }} */
  let { type, href, text } = $props()

  const icon = icons[type]
</script>

<a {href} target="_blank" rel="noopener">
  <img src={icon.src} alt="" height="16" width="16" />
  {text ?? icon.defaultText}
</a>
