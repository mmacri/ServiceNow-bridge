
# ServiceNow Knowledge Assistant

A comprehensive search tool that provides on-demand information about ServiceNow products, best practices, use cases, and development guidance.

## Features

- Search across multiple ServiceNow knowledge sources
- Voice search capabilities
- Authentication for accessing restricted content
- Categorization by product, persona, and use case
- Responsive design for desktop and mobile

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Deployment to GitHub Pages

### Automatic Deployment (GitHub Actions)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

1. Push your changes to the main branch
2. GitHub Actions will build and deploy to the gh-pages branch
3. Your site will be available at `https://[username].github.io/[repository-name]/`

### Manual Deployment

You can also deploy manually using the included script:

```
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```

### Configuring for Custom Domain

1. Add your domain in the GitHub repository settings
2. Create a CNAME record with your DNS provider pointing to `[username].github.io`
3. Uncomment and update the CNAME file creation in the deploy script

## Knowledge Sources

This assistant searches and aggregates results from:

- ServiceNow Documentation
- ServiceNow Community
- ServiceNow Developer Portal
- ServiceNow Blog
- ServiceNow Now Create (requires login)
- ServiceNow GitHub repositories
- ServiceNow YouTube videos
- ServiceNow TechNotes (requires login)

## Authentication

Some content sources require ServiceNow authentication. The application allows users to log in to access these sources, but credentials are not stored - they are only used for the current session.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
