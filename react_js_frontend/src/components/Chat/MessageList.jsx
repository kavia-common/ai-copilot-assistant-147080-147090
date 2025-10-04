import React, { useEffect, useRef } from 'react';

/**
 * Renders a list of chat messages with smooth autoscroll and ARIA live region.
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @param {boolean} loading
 */
// PUBLIC_INTERFACE
export default function MessageList({ messages, loading }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onlyWelcome = messages.length === 1 && messages[0]?.role === 'assistant';

  return (
    <div className="message-list" role="log" aria-busy={loading} aria-live="polite">
      {onlyWelcome && (
        <div className="loading" aria-hidden>
          Tip: Ask about features, troubleshooting, or generate a plan to get started.
        </div>
      )}
      {messages.map((m, i) => (
        <div key={i} className={`message ${m.role}`}>
          <div className="bubble">{m.content}</div>
        </div>
      ))}
      {loading && <div className="loading">Thinking…</div>}
      <div ref={endRef} />
    </div>
  );
}
