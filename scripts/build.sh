#!/usr/bin/env sh

# Check package.json exists in ., otherwise fail
if [ ! -f ./package.json ]; then
  echo "$0 must be run in project root directory"
  exit 1
fi

# Clean build directory
rm -rf ./dist

# Generate and copy files over
node ./scripts/run-generators.js

# Copy and generate .d.ts files for plugins, and copy constants files
cp -r ./src/vite ./dist/vite
npx tsc

# Copy constants files, but remove .d.ts files (they're not needed)
cp -r ./src/source/constants.js ./dist/source
cp -r ./src/visuals/constants.js ./dist/visuals
rm -rf ./dist/**/constants.d.ts ./dist/**/constants.d.ts
