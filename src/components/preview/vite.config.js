import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

export default defineConfig({
  root: "src/components/preview",
  publicDir: "../../../dist",
  plugins: [svelte()],
  server: { open: true },
})
