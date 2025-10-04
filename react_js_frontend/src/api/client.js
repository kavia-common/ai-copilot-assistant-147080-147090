const baseUrl = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

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
  return request('/');
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
