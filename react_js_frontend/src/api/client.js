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
 * Normalize a provided base URL-like value to a safe string or empty string.
 * - Returns trimmed string if input is a non-empty string.
 * - Returns empty string for anything else (undefined, null, objects, etc).
 * - Does not modify slashes; consumers should rely on URL(path, base) for joining.
 */
// PUBLIC_INTERFACE
export function normalizeBase(base) {
  if (typeof base === "string") {
    const t = base.trim();
    return t;
  }
  if (base != null && typeof base !== "string") {
    // eslint-disable-next-line no-console
    console.warn("[api] Expected base URL string but received:", base);
  }
  return "";
}

/**
 * Resolve the API base URL for the current runtime.
 * Priority:
 * 1) REACT_APP_API_BASE_URL if explicitly set
 * 2) window.location.origin (same-origin; works in preview/prod with reverse proxy)
 * 3) http://localhost:3001 as last resort
 *
 * Always returns a string.
 */
function getApiBase() {
  // Prefer explicit env override if provided
  const envBase =
    typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_BASE_URL;
  const envNorm = normalizeBase(envBase);
  if (envNorm) return envNorm;

  // Fallback to same-origin
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    const origin = normalizeBase(window.location.origin);
    if (origin) return origin;
  }

  // Last resort: common local default
  return "http://localhost:3001";
}

/**
 * Join a path with a base using URL() when base is absolute; otherwise return the path.
 * - If base is a valid absolute URL string, returns new URL(path, base).toString()
 * - If base is invalid or relative/empty, returns the path unchanged (relative to same-origin)
 * - Never calls string methods on non-strings
 */
function buildUrl(path, baseMaybe) {
  const base = normalizeBase(baseMaybe);
  const safePath = typeof path === "string" ? path : String(path || "");
  if (!base) {
    return safePath; // relative path
  }
  try {
    // Only use URL if base is absolute
    const baseUrl = new URL(base);
    return new URL(safePath, baseUrl).toString();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[api] Invalid base URL; falling back to relative path. base:", base, e?.message);
    return safePath;
  }
}

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
      } catch (_e) {
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
    const transient = err?.code === "timeout" || err?.status >= 500 || err?.status === 0;
    if (!transient) throw err;
    // brief backoff
    await new Promise((r) => setTimeout(r, 300));
    return attempt();
  }
}

/**
 * Determine if a value looks like a payload object for chat.
 */
function isPayload(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

/**
 * PUBLIC_INTERFACE
 * Post messages to the chat endpoint with enforced timeout.
 *
 * USAGE:
 * - postChat(payload[, timeoutMs]) -> uses resolved base (env or same-origin)
 * - postChat(baseUrl, payload[, timeoutMs]) -> explicit base URL
 * - postChat(payload[, timeoutMs]) also supported with undefined base for compatibility
 *
 * @param {string|object} arg1 - baseUrl or payload object
 * @param {object|number} arg2 - payload or timeoutMs
 * @param {number} arg3 - timeoutMs
 * @returns {Promise<{reply: string}>}
 */
export async function postChat(arg1, arg2, arg3) {
  let baseUrlMaybe = "";
  let payload = null;
  let timeoutMs = DEFAULT_TIMEOUT_MS;

  // Disambiguate signatures safely without assuming string methods
  if (typeof arg1 === "string" || arg1 == null) {
    // postChat(baseUrl, payload, timeoutMs?) or postChat(undefined, payload)
    baseUrlMaybe = arg1;
    if (isPayload(arg2)) {
      payload = arg2;
      if (typeof arg3 === "number") timeoutMs = arg3;
    } else {
      // If payload is not provided or invalid, use empty object to avoid crashing fetch
      payload = {};
      if (typeof arg2 === "number") timeoutMs = arg2;
    }
  } else if (isPayload(arg1)) {
    // postChat(payload, timeoutMs?)
    baseUrlMaybe = getApiBase();
    payload = arg1;
    if (typeof arg2 === "number") timeoutMs = arg2;
  } else {
    // Unexpected type for arg1
    // eslint-disable-next-line no-console
    console.warn("[api] postChat called with unexpected first argument:", arg1);
    baseUrlMaybe = getApiBase();
    payload = isPayload(arg2) ? arg2 : {};
    if (typeof arg3 === "number") timeoutMs = arg3;
    else if (typeof arg2 === "number") timeoutMs = arg2;
  }

  const baseToUse = normalizeBase(baseUrlMaybe) || getApiBase();
  const url = buildUrl("/api/chat", baseToUse);

  return fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    },
    timeoutMs
  );
}

// PUBLIC_INTERFACE
/**
 * Simple health check helper to verify backend connectivity in UI flows if needed.
 * Tries GET /health on the resolved base.
 * @param {number} timeoutMs
 */
export async function healthCheck(timeoutMs = 5000) {
  const base = getApiBase();
  const url = buildUrl("/health", base);
  return fetchWithTimeout(url, { method: "GET" }, timeoutMs);
}
