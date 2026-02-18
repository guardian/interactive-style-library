import { globSync } from "fs"
import path from "path"
import { logGeneratedFiles } from "../src/cli.js"

const files = globSync("./src/**/generate/**/*.js").filter(
  (f) => !path.basename(f).startsWith("common"),
)

await Promise.all(
  files.map(async (file) => {
    const { generate } = await import(path.resolve(file))
    const { files } = await generate()
    logGeneratedFiles(path.resolve(file), files)
  }),
)
