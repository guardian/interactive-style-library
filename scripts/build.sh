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

# Build index files (all.css, all.scss)
node ./scripts/build-indexes.js

# Copy JS files that need .d.ts generation
cp -r ./src/vite ./dist/vite
cp ./src/source/constants.js ./dist/source
cp ./src/visuals/constants.js ./dist/visuals

# Generate .d.ts files for all JS files in dist
npx tsc -p tsconfig.dist.json

# Remove .d.ts files for constants (they're not needed)
rm -f ./dist/source/constants.d.ts ./dist/visuals/constants.d.ts
