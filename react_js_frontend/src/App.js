import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MessageList from './components/Chat/MessageList';
import MessageInput from './components/Chat/MessageInput';

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
      const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
      const res = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError('Something went wrong. Please try again.');
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
