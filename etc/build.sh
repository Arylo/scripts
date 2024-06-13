#!/bin/bash

# Set the source and destination directories
src_dir="./src/qinglong"
dist_dir="./dist/qinglong"

# Loop through all the .ts files in the source directory
for file in "$src_dir"/*.ts; do
    # Get the filename without the extension
    filename=$(basename "$file" .ts)
    
    # Use esbuild to transpile the .ts file to .js
    command="npx esbuild \"$file\" --outfile=\"$dist_dir/$filename.js\""
    echo "> ${command}"
    eval ${command}
done