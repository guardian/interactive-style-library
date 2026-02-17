import { defineConfig } from "vite"

export default defineConfig({
  root: "src/components/preview",
  publicDir: "../../../dist",
  server: { open: true },
})
