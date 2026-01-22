## Simple brand typography

## Standard Visuals line chart

This example showcases the chart-building classes and variables from the Visuals design spec.

The colours applied by these classes are fully responsive to light and dark mode — see images of the
rendered charts below.

```svelte
<script>
  import transfers from "./transfers-top-spenders.json"
  import { scalePoint, scaleLinear, line, group } from "d3"
  import {
    plotWidth,
    plotMarginRight,
    plotHeight,
    axisLabelMargin,
    axisTickHeight,
    plotMarginLeft,
  } from "interactive-style-library/visuals/charts"

  const margin = { right: plotMarginRight.desktop, left: plotMarginLeft.desktop, top: 15, bottom: 20, y: 15 + 20 }

  const seasons = [...new Set(transfers.map((d) => d.season))]
  const teams = [...new Set(transfers.map((d) => d.team))]

  const x = scalePoint().domain(seasons).range([0, plotWidth.desktop])
  const y = scaleLinear().domain([0, 700]).range([plotHeight.desktop, 0])
  const plot = line().x((d) => x(d.season)).y((d) => y(d.spend))
</script>

<figure class="vis-chart">
  <h2 class="vis-chart-headline">Big transfer window spending</h2>
  <p class="vis-chart-standfirst">Transfer window spend (in millions of £) by top 3 UK football clubs</p>

  <ul class="vis-chart-legend vis-chart-legend-list">
    {#each teams as team}
      <div class="vis-chart-legend-item">
        <div data-team={team} class="vis-chart-legend-patch"></div>
        <li>{team}</li>
      </div>
    {/each}
  </ul>

  <svg height="{plotHeight.desktop + margin.y}px" width="100%">
    <!-- Y axis labels and guidelines -->
    {#each y.ticks(6) as tick}
      <g class="tick" transform="translate(0, {margin.top + y(tick)})">
        <line class="vis-chart-guideline" x2="100%" />
        <text class="vis-chart-axis-label" y="-{axisLabelMargin}px">
          {tick}
        </text>
      </g>
    {/each}

    <!-- X axis, ticks and labels -->
    <g transform="translate(0, {plotHeight.desktop + margin.top})">
      <line x2="100%" class="vis-chart-x-axis" />

      {#each x.domain() as tick}
        <g transform="translate({margin.left + x(tick)}, 0)">
          <line class="vis-chart-tick" y2="{axisTickHeight}px" />
          <text class="vis-chart-x-axis-label" y="{axisTickHeight + axisLabelMargin}px">
            {tick}
          </text>
        </g>
      {/each}
    </g>

    <!-- Line plot -->
    <g transform="translate({margin.left}, {margin.top})">
      {#each group(transfers, (d) => d.team) as [team, series]}
        <path class="vis-chart-line-plot" data-team={team} d={plot(series)} />
      {/each}
    </g>
  </svg>

  <p class="vis-chart-source">
    Guardian graphic. Source: Fake Football Statistics co.
  </p>
</figure>

<style lang="scss">
  [data-team="Manchester United"] {
    --team-color: var(--vis-news-orange);
  }
  [data-team="Liverpool"] {
    --team-color: var(--vis-news-red);
  }
  [data-team="Chelsea"] {
    --team-color: var(--vis-news-blue);
  }

  path[data-team] {
    stroke: var(--team-color);
    fill: none;
  }

  .vis-chart-legend-patch[data-team] {
    background-color: var(--team-color);
  }
</style>
```

### Preview

<table>
<tr>
<td>
<img alt="line chart rendered by the above code in light mode" src="./images/visuals-line-chart-demo-light.png">
</td>
<td>
<img alt="line chart rendered by the above code in dark mode" src="./images/visuals-line-chart-demo-dark.png">
</td>
</tr>
</table>

### Notes

Note that a figure element with class `vis-chart` wraps the chart. Chart styles are defined using paired selectors such as `.vis-chart-headline, .vis-chart .vis-chart-headline`.

This allows you to apply the base styles with `.vis-chart-headline`, while the scoped `.vis-chart .vis-chart-headline` selector provides extra specificity when you need to override competing styles without resorting to !important.
