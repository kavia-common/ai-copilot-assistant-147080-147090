import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MessageList from './components/Chat/MessageList';
import MessageInput from './components/Chat/MessageInput';
import { postChat } from './api/client';

/**
 * Root application that renders the Ocean Professional minimalist layout with:
 * - Sidebar for navigation
 * - TopBar for quick actions
 * - Central chat area (messages + input)
 */
// PUBLIC_INTERFACE
function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI Copilot. How can I help today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Local UI state for lightweight panels
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);

  // PUBLIC_INTERFACE
  const sendMessage = async (text) => {
    setError('');
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const data = await postChat(next);
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      const msg =
        e?.message ||
        (e?.body && (e.body.message || e.body.detail || e.body.error)) ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([{ role: 'assistant', content: 'Hi! I\'m your AI Copilot. How can I help today?' }]);
    setError('');
  };

  // Handlers passed to TopBar to toggle panels
  const handleToggleSettings = () => setSettingsOpen((s) => !s);
  const handleToggleDeveloper = () => setDevOpen((s) => !s);

  return (
    <div className="app">
      <Sidebar onNewChat={handleNewChat} />
      <TopBar
        onOpenSettings={handleToggleSettings}
        onOpenDeveloper={handleToggleDeveloper}
      />
      <main className="main" role="main">
        {error && <div role="alert" style={{color:'#EF4444', padding:'8px 16px'}}>{error}</div>}
        <MessageList messages={messages} loading={loading} />
        <MessageInput onSend={sendMessage} disabled={loading} />
      </main>

      {/* Minimal non-blocking settings panel to confirm interaction */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Settings Panel"
          style={{
            position: 'fixed',
            right: 16,
            top: 64,
            width: 300,
            maxWidth: '90vw',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
            padding: 16,
            zIndex: 1000
          }}
        >
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <strong style={{color:'var(--primary)'}}>Settings</strong>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="action-btn"
              aria-label="Close settings"
              title="Close"
            >
              ✖️
            </button>
          </div>
          <div style={{fontSize: 14, color: 'var(--secondary)', marginTop: 8}}>
            Settings panel is a placeholder. Wire real preferences here later.
          </div>
        </div>
      )}

      {/* Minimal developer/about modal */}
      {devOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Developer Info"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
          }}
          onClick={() => setDevOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              padding: 20,
              width: 360,
              maxWidth: '92vw',
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <strong style={{color:'var(--primary)'}}>About / Shortcuts</strong>
              <button
                type="button"
                className="action-btn"
                aria-label="Close developer modal"
                onClick={() => setDevOpen(false)}
                title="Close"
              >
                ✖️
              </button>
            </div>
            <div style={{marginTop: 8, color: 'var(--secondary)', fontSize: 14}}>
              - Enter to send, Shift+Enter for newline.
              <br />
              - “+ New Chat” resets the conversation.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
