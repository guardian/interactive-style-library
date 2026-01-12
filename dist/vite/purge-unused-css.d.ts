/**
 * @typedef {Object} PurgeOptions
 * @property {string[]} [safelist] - Additional classes/variables to always keep
 */
/**
 * Vite plugin that finds and removes any unused CSS variables and classes provided by
 * interactive-style-library.
 *
 * Any imported CSS styles file (eg. `interactive-style-library/source/palette.css`) supplies
 * all variables/classes declarations by default, most of which will be unused. This plugin finds
 * any class declaration beginning with `.src-` or `.vis-`, or any CSS variable declaration with
 * `--src-` or `--vis-`, and removes it, if that class or variable is not used in your HTML or
 * JavaScript.
 *
 * This plugin should be run after your Svelte components, SCSS code, etc. are compiled to
 * plain HTML, CSS and JavaScript.
 *
 * @param {PurgeOptions} [options]
 */
export function purgeInteractiveStylesCss(options?: PurgeOptions): {
    name: string;
    apply: string;
    enforce: string;
    generateBundle(_: any, bundle: any): Promise<void>;
};
export type PurgeOptions = {
    /**
     * - Additional classes/variables to always keep
     */
    safelist?: string[];
};
