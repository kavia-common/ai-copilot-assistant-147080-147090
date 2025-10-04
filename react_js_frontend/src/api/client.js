/**
 * Determine base URL for API requests.
 * - In development with CRA proxy, leave base empty '' to use relative paths so that setupProxy.js handles routing.
 * - If REACT_APP_API_BASE_URL is provided (e.g., in production), use it.
 * - Avoid forcing http://localhost:3001 by default to prevent mixed-content under HTTPS; instead prefer '' so same-origin or proxy is used.
 */
const resolvedBase =
  typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production'
    ? '' // dev: rely on CRA proxy when available
    : (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, ''); // prod: require explicit base or same-origin

const baseUrl = resolvedBase;

/**
 * INTERNAL: Generic JSON fetch wrapper with timeout and robust error handling.
 * - Prefixes baseUrl
 * - Sets JSON headers
 * - Uses AbortController with 20s timeout
 * - Parses JSON responses
 * - Throws Error on non-2xx with status, message, and body
 * @param {string} path - path starting with '/'
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  // Merge headers with default JSON content type
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const res = await window.fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const isJson =
      res.headers.get('content-type')?.toLowerCase().includes('application/json');

    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

    if (!res.ok) {
      const err = new Error(
        (body && (body.message || body.detail || body.error)) ||
          `HTTP ${res.status} ${res.statusText}`
      );
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body;
  } catch (err) {
    if (err?.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out');
      timeoutErr.status = 408;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// PUBLIC_INTERFACE
export async function getHealth() {
  /** Checks backend health. Returns parsed JSON or text (depending on backend). */
  return request('/health');
}

// PUBLIC_INTERFACE
export async function postChat(messages) {
  /** Sends chat messages to backend and returns the response JSON. */
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
}

export default {
  getHealth,
  postChat,
};
