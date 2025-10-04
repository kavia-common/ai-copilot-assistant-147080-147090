import React from 'react';

/**
 * TopBar with app title and user actions in a minimalist, clean style.
 *
 * Props:
 * - onOpenSettings?: () => void
 * - onOpenDeveloper?: () => void
 */
// PUBLIC_INTERFACE
export default function TopBar({ onOpenSettings, onOpenDeveloper }) {
  const handleKeyActivate = (e, cb) => {
    if (!cb) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cb();
    }
  };

  return (
    <header className="topbar" role="banner">
      <h1 className="app-title">AI Copilot</h1>
      <div className="topbar-actions">
        <button
          className="action-btn"
          type="button"
          aria-label="Settings"
          title="Settings"
          onClick={onOpenSettings}
          onKeyDown={(e) => handleKeyActivate(e, onOpenSettings)}
        >
          ⚙️
        </button>

        {/* Use a button for proper semantics and interactivity */}
        <button
          className="avatar"
          type="button"
          aria-label="Open developer/about"
          title="About / Shortcuts"
          onClick={onOpenDeveloper}
          onKeyDown={(e) => handleKeyActivate(e, onOpenDeveloper)}
          style={{ cursor: 'pointer' }}
        >
          🧑‍💻
        </button>
      </div>
    </header>
  );
}
