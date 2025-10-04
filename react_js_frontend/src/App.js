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

  return (
    <div className="app">
      <Sidebar onNewChat={handleNewChat} />
      <TopBar />
      <main className="main" role="main">
        {error && <div role="alert" style={{color:'#EF4444', padding:'8px 16px'}}>{error}</div>}
        <MessageList messages={messages} loading={loading} />
        <MessageInput onSend={sendMessage} disabled={loading} />
      </main>
    </div>
  );
}

export default App;
