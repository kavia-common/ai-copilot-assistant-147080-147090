const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * CRA development proxy to avoid HTTPS/HTTP mixed content and CORS issues.
 * Proxies frontend requests to the backend during "npm start" dev runs.
 *
 * Targets:
 * - /api/*   -> http://localhost:3001
 * - /health  -> http://localhost:3001
 *
 * Notes:
 * - changeOrigin: true adjusts the Origin host header to the target.
 * - secure: false allows self-signed certs if your backend is using HTTPS locally.
 * - This only affects the local dev server. Production should use a reverse proxy or same-origin deploy.
 */
module.exports = function(app) {
  const target = 'http://localhost:3001';

  app.use(
    ['/api', '/health'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      // Optionally log proxying in development for easier debugging
      logLevel: 'warn',
      // Preserve path, just forward as-is
    })
  );
};
