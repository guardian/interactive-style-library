/**
 * Vite plugin that wires `interactive-style-library` CSS and SCSS files into
 * your build.
 *
 * SCSS files are made available globally via `additionalData` (so mixins and
 * variables don't need to be `@use`d in every file). CSS files are `@use`d
 * once from the entry SCSS file, since `@use`ing them duplicates output.
 *
 * @param {UseInteractiveStylesOptions} [options]
 * @returns {import("vite").Plugin[]}
 */
export function useInteractiveStyles(options?: UseInteractiveStylesOptions): import("vite").Plugin[];
export type SourceFile = "mq.scss" | "typography.scss" | "typography.css" | "colors.css" | "breakpoints.scss" | "font-faces.css" | "headline-numeric.css";
export type VisualsFile = "charts.scss" | "charts.css" | "colors.css" | "colors-light.css" | "colors-dark.css" | "parties.css" | "parties-light.css" | "parties-dark.css";
export type ComponentFile = "button.css" | "checkbox.css" | "icons.css" | "label.css" | "radio.css" | "select.css" | "spinner.css" | "text-input.css" | "toggle.css";
export type UseInteractiveStylesOptions = {
    /**
     * - Files from `dist/source/` to inject
     */
    source?: SourceFile[];
    /**
     * - Files from `dist/visuals/` to inject
     */
    visuals?: VisualsFile[];
    /**
     * - Files from `dist/components/` to inject
     */
    components?: ComponentFile[];
    /**
     * `true` enables purging with defaults, `false` disables, or pass an options
     * object forwarded to `purgeInteractiveStylesCss`
     */
    purge?: boolean | import("./purge-unused-css.js").PurgeOptions;
    /**
     * - Filename of the entry SCSS file that CSS
     * `@use` lines are injected into. Defaults to `"main.scss"`.
     */
    entryScss?: string;
};
