import React from 'react';

/**
 * TopBar with app title and user actions in a minimalist, clean style.
 */
// PUBLIC_INTERFACE
export default function TopBar() {
  return (
    <header className="topbar" role="banner">
      <h1 className="app-title">AI Copilot</h1>
      <div className="topbar-actions">
        <button className="action-btn" aria-label="Settings" title="Settings">⚙️</button>
        <div className="avatar" aria-hidden>🧑‍💻</div>
      </div>
    </header>
  );
}
