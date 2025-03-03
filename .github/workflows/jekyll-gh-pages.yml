
#!/bin/bash

# Exit script if any command fails
set -e

# Define variables
REPO_URL=${1:-$(git config --get remote.origin.url)}
GH_PAGES_BRANCH="gh-pages"
BUILD_DIR="dist"

# Install dependencies if node_modules doesn't exist or is incomplete
echo "Installing dependencies..."
npm install

# Build the application for production
echo "Building application..."
npm run build

# Create a .nojekyll file to disable Jekyll processing
touch $BUILD_DIR/.nojekyll

# Create a 404.html file that's a copy of index.html for SPA routing
cp $BUILD_DIR/index.html $BUILD_DIR/404.html

# Add base element to index.html to handle GitHub Pages subfolder pathing if needed
# This is already done in the Vite config, so we don't need to add it here

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d $BUILD_DIR

echo "✅ Successfully deployed to GitHub Pages!"
echo "Your application should be available at: https://mmacri.github.io/ServiceNow-bridge/"
echo "Note: It might take a few minutes for the changes to be visible."
