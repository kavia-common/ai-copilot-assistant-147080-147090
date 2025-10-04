# Frontend Environment Configuration

- PUBLIC_INTERFACE
REACT_APP_API_BASE_URL: Base URL for the FastAPI backend (e.g., https://your-domain.tld or http://localhost:3001)

Notes:
- Do not include trailing slash.
- In preview/production, the app defaults to same-origin (window.location.origin), so you usually do not need to set this variable.
- If you need to point to a different backend origin, set REACT_APP_API_BASE_URL explicitly.
- For local development with `npm start`, setupProxy.js proxies `/api/*` and `/health` to http://localhost:3001.
