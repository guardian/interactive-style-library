import { globSync } from "fs"
import { execSync } from "child_process"

// TODO: accept params to run specific generators?
let pattern = "./src/**/generate/**/*.js"

const files = globSync(pattern)

files.forEach((file) => {
  execSync(`node ${file}`, { stdio: "inherit" })
})
