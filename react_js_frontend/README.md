# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight: No heavy UI frameworks - uses only vanilla CSS and React
- Modern UI: Clean, responsive design with KAVIA brand styling
- Fast: Minimal dependencies for quick loading times
- Simple: Easy to understand and modify

## Environment Setup

Configure environment variables to point the frontend to your backend and optionally enable Supabase.

1) Copy the example file and edit as needed:
   cp .env.example .env

2) Variables:
- REACT_APP_API_BASE_URL
  - Base URL for the FastAPI backend (no trailing slash)
  - Default used by the app if not set: http://localhost:3001
  - Used in: src/api/client.js to build endpoints such as `${REACT_APP_API_BASE_URL}/api/chat`
- REACT_APP_SUPABASE_URL (optional)
  - Your Supabase project URL (only needed if enabling Supabase features)
- REACT_APP_SUPABASE_ANON_KEY (optional)
  - Your Supabase anon public key (only needed if enabling Supabase features)

Notes:
- Create React App only exposes variables prefixed with REACT_APP_ to the browser.
- For production deployments, set these variables via your hosting provider’s environment configuration.

For a concise reference, see ENVIRONMENT.md.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open http://localhost:3000 to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## How configuration is used

- API Base URL
  - The code reads REACT_APP_API_BASE_URL in src/api/client.js and defaults to http://localhost:3001.
  - All API calls are prefixed with this base URL (e.g., /api/chat).
- Supabase (optional)
  - If you wire Supabase into the app, initialize the client with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
  - These variables are optional and unused unless such integration is added.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the React documentation: https://reactjs.org/

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
