# React Frontend

This frontend includes a minimal API client with strict timeouts to avoid long hangs.

- fetchWithTimeout: 15s AbortController-based timeout with one quick retry for transient failures.
- postChat(payload): helper to call the backend `POST /api/chat`. Defaults to same-origin or uses `REACT_APP_API_BASE_URL` if explicitly set.

Usage example:
```js
import { postChat } from "./src/api/client";

async function sendMessage() {
  try {
    // Prefer same-origin in preview/prod; override by passing a base URL or setting REACT_APP_API_BASE_URL
    const res = await postChat({
      messages: [{ role: "user", content: "Hello!" }],
      response_style: "plain",
    });
    console.log("Reply:", res?.reply);
  } catch (e) {
    // Display a friendly message to the user
    const msg =
      e?.code === "timeout"
        ? "The request timed out. Please try again."
        : e?.message || "Something went wrong.";
    console.error(msg, e);
  }
}
```

Notes:
- Ensure the UI surfaces error messages from thrown errors for a clear user experience.
- For local development with `npm start`, `/api/*` and `/health` requests are proxied to http://localhost:3001 (see src/setupProxy.js).
- In preview/production with HTTPS, using same-origin avoids mixed-content and CORS issues.
