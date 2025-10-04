import React from 'react';

/**
 * Sidebar component featuring app title, quick actions, and recent list.
 * Ocean Professional minimalist style; accessible with clear aria labels.
 */
// PUBLIC_INTERFACE
export default function Sidebar({ onNewChat }) {
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="sidebar-header">AI Copilot</div>
      <nav className="sidebar-nav" aria-label="Main Navigation">
        <button type="button" className="nav-item" aria-label="New Chat" onClick={onNewChat}>+ New Chat</button>
        <div className="nav-section" aria-hidden>Recent</div>
        <ul className="nav-list">
          <li
            className="nav-list-item"
            tabIndex={0}
            role="button"
            aria-label="Open Welcome chat"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const btn = document.querySelector('.nav-item');
                btn?.click();
              }
            }}
          >
            Welcome
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer" aria-label="App version">v0.1</div>
    </aside>
  );
}
