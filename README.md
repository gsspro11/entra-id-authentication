# Shared Post Office — Authentication (Angular)

Shared-PostOffice-Auth is an Angular 17 application that provides authentication UI and SSR support for the Post Office authentication flows.

## Prerequisites

- Node.js 18.x — 20.x recommended (Node 22 is unsupported for this project)
- npm 8+ (or the version compatible with your Node release)
- Angular CLI 17.1.0 (recommended)

## Quick setup

1. Clone the repo and change into the project folder:
   - cd c:\Users\gsdasilva\source\repos\Shared-PostOffice-Auth

2. Install dependencies:
   - npm ci

3. Verify Node version and switch if necessary (nvm or nvm-windows recommended).

## Development

Run the development server (with SSL as configured):
- npm start
- Visit: https://localhost:4200/

To run a development build that watches files:
- npm run watch

## Builds

Standard production browser build:
- npm run build
- Or: npx ng build --configuration=production

Azure / environment-specific build:
- npm run build:azure
- Or: npx ng build --configuration=azure

Server-Side Rendering (SSR) build (server + browser):
- npm run build:ssr
- After successful build, run the SSR server:
  - npm run serve:ssr
  - or run the generated server file directly (path depends on build output, e.g. node dist/shared-entra-id-auth-server/server/main.js)

Note: Confirm the server output filename after building and update scripts if needed.

## Environment configuration

Environment files live in src/environments/. Common files:
- environment.ts (default)
- environment.dev.ts
- environment.uat.ts
- environment.azure.ts
- environment.stg.ts

Do not commit secrets or client secrets to the repository. Use environment-specific secure configuration (CI/CD secrets, key vaults, etc.).

## Authentication

This project uses MSAL packages:
- @azure/msal-angular
- @azure/msal-browser

Verify MSAL configuration and compatibility with SSR flows when deploying server-side rendering. Keep authentication client IDs and secrets out of source control.

## Testing

Run unit tests:
- npm test
Tests use Karma + Jasmine as configured.

## Linting & Formatting

Add and configure linters (recommended):
- @angular-eslint for linting
- Prettier for formatting

Example (not included in this repo): add lint and format scripts to package.json and CI.

## CI / Troubleshooting

- Ensure Node version compatibility (use nvm to switch to supported Node).
- If you see schema validation errors referencing `browser`, ensure your angular.json includes a browser/build target (Angular CLI expects a browser target).
- If SSR script paths fail, inspect the dist folder after build to confirm the actual server output path and filename.

Useful commands for diagnostics:
- npx ng version
- npx ng build --configuration=azure
- npx ng run shared-entra-id-auth:server:production

## Design / References

- Design System / Storybook: https://tsr-delaunayui-cdn-web-d.azureedge.net/v1/?path=/story/docs-como-utilizar--page
- Dev Auth (example): https://auth-dev.entra-id.gsspro11.net/home
- Angular CLI: https://angular.io/cli

## Contributing

- Open issues or pull requests with clear descriptions.
- Follow repository coding standards and add tests for new functionality.
- Keep sensitive configuration out of the repo.
