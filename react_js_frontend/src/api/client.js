/**
 * PUBLIC_INTERFACE
 * A minimal API client with strict timeouts and clear error surfaces.
 *
 * - Enforces a 15s fetch timeout using AbortController.
 * - Returns parsed JSON for success, throws structured error for failure.
 * - Adds a single quick retry for transient 5xx or network/timeout errors.
 */

const DEFAULT_TIMEOUT_MS = 15000;

/**
 * PUBLIC_INTERFACE
 * Perform a fetch with a timeout and one quick retry for transient issues.
 * @param {string} url - Request URL
 * @param {RequestInit} options - fetch options (method, headers, body)
 * @param {number} timeoutMs - timeout in milliseconds (default 15s)
 * @returns {Promise<any>} parsed JSON or throws an error with {code, message, status}
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const opts = { ...options, signal: controller.signal };

  const attempt = async () => {
    try {
      const res = await fetch(url, opts);
      clearTimeout(id);
      if (!res.ok) {
        // Try to parse error body
        let errBody = null;
        try {
          errBody = await res.json();
        } catch (_) {
          // ignore parse errors
        }
        const message =
          (errBody && errBody.error && errBody.error.message) ||
          `Request failed with status ${res.status}`;
        const code =
          (errBody && errBody.error && errBody.error.code) ||
          (res.status === 504 ? "gateway_timeout" : "http_error");
        const error = new Error(message);
        error.code = code;
        error.status = res.status;
        error.details = errBody;
        throw error;
      }
      // Success
      try {
        return await res.json();
      } catch (e) {
        // Non-JSON success fallback
        return null;
      }
    } catch (err) {
      clearTimeout(id);
      // Surface timeout or abort clearly
      if (err && (err.name === "AbortError" || err.code === "AbortError")) {
        const e = new Error("Request timed out. Please try again.");
        e.code = "timeout";
        e.status = 0;
        throw e;
      }
      // Network-like errors bubble up
      throw err;
    }
  };

  try {
    return await attempt();
  } catch (err) {
    // One quick retry for transient issues (timeouts, network, 5xx)
    const transient =
      err?.code === "timeout" ||
      err?.status >= 500 ||
      err?.status === 0;
    if (!transient) throw err;
    // brief backoff
    await new Promise((r) => setTimeout(r, 300));
    return attempt();
  }
}

/**
 * PUBLIC_INTERFACE
 * Post messages to the chat endpoint with enforced timeout.
 * @param {string} baseUrl - backend base url (e.g., http://localhost:3001)
 * @param {{messages: Array<{role: 'user'|'assistant'|'system', content: string}>, response_style?: 'list'|'plain'|'guided'}} payload
 * @param {number} timeoutMs - timeout in milliseconds
 * @returns {Promise<{reply: string}>}
 */
export async function postChat(baseUrl, payload, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const url = `${baseUrl.replace(/\/+$/, "")}/api/chat`;
  return fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, timeoutMs);
}
