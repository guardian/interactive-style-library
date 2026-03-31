import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

export default defineConfig({
  root: "src/components/preview",
  publicDir: "../../../dist",
  plugins: [svelte({ preprocess: vitePreprocess() })],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ["dist/source", "dist/visuals"],
      },
    },
  },
  server: { open: true },
})
