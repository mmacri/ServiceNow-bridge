
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

# Create a CNAME file if needed for custom domain (uncomment and edit if needed)
# echo "your-custom-domain.com" > $BUILD_DIR/CNAME

# Add base element to index.html to handle GitHub Pages subfolder pathing
# This helps with routing in single-page applications
echo "Configuring for GitHub Pages deployment..."
sed -i.bak 's/<head>/<head><base href="\/">/' $BUILD_DIR/index.html

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d $BUILD_DIR

echo "✅ Successfully deployed to GitHub Pages!"
echo "Your application should be available at: https://[username].github.io/[repository-name]/"
echo "Note: It might take a few minutes for the changes to be visible."
echo ""
echo "If you're using a custom domain:"
echo "1. Go to your repository settings"
echo "2. Scroll down to GitHub Pages section"
echo "3. Enter your custom domain and save"
echo "4. Ensure CNAME is correctly set in your repository"
