# React JS Frontend

This is the React frontend for the AI Copilot.

## Development: Avoid mixed content and CORS via proxy

When running the frontend with `npm start`, we enable a development proxy (Create React App convention) that forwards API calls to the FastAPI backend. This prevents HTTPS/HTTP mixed-content errors and CORS issues during local development.

- Proxy file: `src/setupProxy.js`
- Proxied paths:
  - `/api/*`  -> `http://localhost:3001`
  - `/health` -> `http://localhost:3001`

How it works:
- The frontend API client uses relative URLs (e.g., `/api/chat`) in development.
- The CRA dev server proxies those requests to the backend defined in `setupProxy.js`.
- No change to your start commands is needed; just run the backend on port 3001 and the frontend on port 3000.

Environment variable note:
- If `REACT_APP_API_BASE_URL` is left unset in development, the client uses relative paths and the proxy will handle routing automatically.
- In production, set `REACT_APP_API_BASE_URL` to your backend URL when not deploying behind the same origin.

## Production: Fixing HTTPS/HTTP "Failed to fetch" (mixed content)

When the site is served over HTTPS, the browser blocks API calls to HTTP (unencrypted) backends. Use one of these strategies:

1) Deploy behind a reverse proxy (recommended)
- Terminate TLS at an edge proxy like NGINX, Caddy, or a managed load balancer.
- Serve the frontend and route `/api` and `/health` to the backend over HTTP internally.
- Example NGINX snippet:

  server {
    listen 443 ssl;
    server_name yourdomain.com;

    # ssl_certificate /path/to/fullchain.pem;
    # ssl_certificate_key /path/to/privkey.pem;

    root /usr/share/nginx/html; # your built React app

    location / {
      try_files $uri /index.html;
    }

    location /api/ {
      proxy_pass http://backend:3001/;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-Proto https;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /health {
      proxy_pass http://backend:3001/health;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-Proto https;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }

2) Use the same scheme (full HTTPS)
- Expose your FastAPI backend over HTTPS directly (e.g., via a reverse proxy in front of it).
- Set `REACT_APP_API_BASE_URL` to the HTTPS URL of your backend, e.g.:
  - `REACT_APP_API_BASE_URL=https://api.yourdomain.com`

3) Same-origin deployment
- Host the backend under the same domain and path as the frontend (e.g., yourdomain.com/api).
- In this setup, you can keep relative paths in the frontend and handle routing at the edge proxy.

Important:
- Do not mix HTTPS frontend with HTTP backend publicly; browsers will block it.
- The dev proxy is for local development only and does not apply to production builds.

## Optional: Supabase
Supabase is not required to run the frontend. If you want to enable optional Supabase features later:

1. Copy `.env.example` to `.env`.
2. Provide the following variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

The app will continue to function normally without these variables; the Supabase client stub simply exports `null` if not configured.
