<script>
  /** @type {{
    currentRoute: string,
    components: Array<{ slug: string, label: string }>,
  }} */
  let { currentRoute, components } = $props()
</script>

<nav class="sidebar">
  <div class="sections">
    <section>
      <h3 class="heading">Getting started</h3>
      <ul>
        <li>
          <a
            href="#introduction"
            class:active={currentRoute === "introduction"}
          >
            Introduction
          </a>
        </li>
        <li>
          <a
            href="#installation"
            class:active={currentRoute === "installation"}
          >
            {#if currentRoute === "installation"}
              <span class="marker">&#x203A;</span>
            {/if}
            Installation
          </a>
        </li>
      </ul>
    </section>
    <section>
      <h3 class="heading">Components</h3>
      <ul>
        {#each components as component}
          <li>
            <a
              href="#{component.slug}"
              class:active={currentRoute === component.slug}
            >
              {#if currentRoute === component.slug}
                <span class="marker">&#x203A;</span>
              {/if}
              {component.label}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  </div>

  <div class="footer">
    <p class="title">
      Interactive
      <br />
      Style Library
    </p>
  </div>
</nav>

<style lang="scss">
  @use "typography" as *;

  .sidebar {
    width: 260px;
    min-width: 240px;
    min-height: 100vh;

    top: 0;
    position: sticky;
    height: 100vh;

    display: flex;
    flex-direction: column;

    border-right: 1px solid var(--src-neutral-86);

    padding-left: 20px;
    padding-right: 20px;
    padding-top: 48px;
    padding-bottom: 16px;
  }

  .sections {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .heading {
    color: var(--src-neutral-60);
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    @include src-text-sans-15;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  a {
    color: var(--src-neutral-20);
    text-decoration: none;
    display: block;
    padding: 4px 0;

    @include src-text-sans-17;
  }

  a:hover {
    color: var(--src-neutral-7);
  }

  a.active {
    color: var(--src-neutral-7);
    font-weight: bold;
  }

  .marker {
    margin-right: 2px;
  }

  .footer {
    margin-top: auto;
  }

  .title {
    color: var(--src-neutral-7);

    @include src-titlepiece-42;
    font-size: 22px;
  }
</style>
