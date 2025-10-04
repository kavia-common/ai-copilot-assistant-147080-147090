# Ocean Professional UI - Frontend Structure

This frontend implements a minimalist "Ocean Professional" layout:
- Persistent Sidebar (navigation)
- TopBar (title + quick actions)
- Central Chat Area (messages + input)

Components:
- src/components/Sidebar.jsx
  - PUBLIC_INTERFACE
  - Props:
    - onNewChat?: () => void — clears the conversation
- src/components/TopBar.jsx
  - PUBLIC_INTERFACE
  - Title and simple actions (settings stub, avatar)
- src/components/Chat/MessageList.jsx
  - PUBLIC_INTERFACE
  - Props:
    - messages: Array<{ role: 'user'|'assistant', content: string }>
    - loading: boolean — announces busy state via aria-busy
- src/components/Chat/MessageInput.jsx
  - PUBLIC_INTERFACE
  - Props:
    - onSend: (text: string) => void
    - disabled: boolean
  - UX:
    - Enter to send, Shift+Enter for newline
    - Auto-grows up to a max height

Styling:
- src/App.css contains theme tokens and layout styles:
  - --primary: #374151
  - --secondary: #9CA3AF
  - --success: #10B981
  - --error: #EF4444
  - --bg: #FFFFFF
  - --surface: #F9FAFB
  - --text: #111827

API:
- Chat POST: {REACT_APP_API_BASE_URL}/api/chat
  - Body: { messages: Array<{ role, content }> }
  - Response: { reply: string }
- Configure via .env:
  - REACT_APP_API_BASE_URL=http://localhost:3001 (default used if not set)

Accessibility:
- ARIA roles and aria-live regions for chat log updates
- Focus-visible styles on interactive elements
- Keyboard support for recent items (Enter/Space)

Notes:
- “+ New Chat” resets to the assistant welcome message.
- Consider persisting conversations and wiring recents to specific chats.
