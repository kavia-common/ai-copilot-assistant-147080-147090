import React, { useState, useEffect, useRef } from 'react';

/**
 * Text input and submit button for sending chat messages.
 * Accessible label and keyboard-friendly.
 * - Enter to send
 * - Shift+Enter for newline
 * - Auto-grows up to a max height
 * @param {(text: string) => void} onSend
 * @param {boolean} disabled
 */
// PUBLIC_INTERFACE
export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textAreaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Submit on Enter without newline
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-size textarea when value changes
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      const next = Math.min(textAreaRef.current.scrollHeight, 160);
      textAreaRef.current.style.height = `${next}px`;
    }
  }, [value]);

  return (
    <form className="message-input" onSubmit={handleSubmit} aria-label="Send a message">
      <label htmlFor="chat-input" className="sr-only">Your message</label>
      <textarea
        id="chat-input"
        ref={textAreaRef}
        rows={1}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            const next = Math.min(textAreaRef.current.scrollHeight, 160);
            textAreaRef.current.style.height = `${next}px`;
          }
        }}
        onKeyDown={onKeyDown}
        placeholder="Ask anything…"
        disabled={disabled}
        autoComplete="off"
        aria-disabled={disabled}
        style={{ resize: 'none' }}
      />
      <button type="submit" disabled={disabled || !value.trim()} aria-label="Send">Send</button>
    </form>
  );
}
