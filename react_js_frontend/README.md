# React Frontend

This frontend includes a minimal API client with strict timeouts to avoid long hangs.

- fetchWithTimeout: 15s AbortController-based timeout with one quick retry for transient failures.
- postChat(baseUrl, payload): helper to call the backend `POST /api/chat`.

Usage example:
```js
import { postChat } from "./src/api/client";

async function sendMessage() {
  try {
    const res = await postChat(process.env.REACT_APP_BACKEND_URL || "http://localhost:3001", {
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
- Configure the backend CORS origin using the backend's `FRONTEND_ORIGIN` env if needed.
