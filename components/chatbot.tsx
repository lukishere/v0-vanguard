'use client'
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  user: 'Bot' | 'You';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

const mockMessages: Message[] = [
  { id: '1', user: 'Bot', text: 'Welcome to Live Chat!', timestamp: '7:20', status: 'read' },
  { id: '2', user: 'You', text: 'Hi there!', timestamp: '7:21', status: 'sent' },
];

const EMOJIS = ['😀', '👍', '🎉', '🚀', '🤖', '💡', '🔥', '🙌', '😎', '❤️'];
// VANGUARD logo colors
const VANGUARD_BLUE = '#1976a5'; // main deep blue
const VANGUARD_ACCENT = '#21a1c4'; // accent blue
const VANGUARD_GRADIENT = `from-[${VANGUARD_BLUE}] to-[${VANGUARD_ACCENT}]`;

function ChatHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#23272a] rounded-t-2xl shadow-md border-b-2 border-[#21a1c4]/40">
      <div className="flex items-center gap-3">
        <span className="inline-block w-10 h-10 bg-white/80 rounded-full border-2 border-[#21a1c4] shadow-inner flex items-center justify-center">
          {/* Vanguard logo avatar */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#1976a5" opacity="0.85" />
            <text x="16" y="21" textAnchor="middle" fontSize="13" fill="#21a1c4" fontWeight="bold">V</text>
          </svg>
        </span>
        <div>
          <div className="text-white font-extrabold text-lg tracking-wide flex items-center gap-2">
            GUARDBOT <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded text-[#21a1c4] border border-[#21a1c4]/30 ml-1">LIVE CHAT</span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#21a1c4' }}>
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#21a1c4' }} aria-label="Online" />
            Online
          </div>
        </div>
      </div>
      <button
        aria-label="Close chat"
        className="text-white text-2xl font-light hover:text-[#21a1c4] transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full px-2"
        onClick={onClose}
      >
        ×
      </button>
    </header>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.user === 'You';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}> 
      <div
        className={`max-w-[80vw] md:max-w-md rounded-2xl px-4 py-2 text-sm shadow-md mb-1
          ${isUser
            ? `bg-gradient-to-br from-[${VANGUARD_BLUE}] to-[${VANGUARD_ACCENT}] text-black border border-[${VANGUARD_ACCENT}]/30`
            : 'bg-white/80 backdrop-blur border border-[${VANGUARD_BLUE}]/10 text-black'}
        `}
        tabIndex={0}
        aria-label={`${msg.user} message: ${msg.text}`}
      >
        <div className="text-black">{msg.text}</div>
        <div className="text-xs flex items-center gap-1 mt-1" style={{ color: '#333' }}>
          {msg.timestamp}
          {msg.status === 'read' && <span title="Read">✓✓</span>}
          {msg.status === 'sent' && <span title="Sent">✓</span>}
        </div>
      </div>
    </div>
  );
}

function ChatMessages({ messages, typing, onScroll, showScrollBtn, onScrollToBottom }: {
  messages: Message[];
  typing: boolean;
  onScroll: () => void;
  showScrollBtn: boolean;
  onScrollToBottom: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && !showScrollBtn) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, showScrollBtn]);
  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-2 bg-white/60 backdrop-blur rounded-b-lg text-base"
      style={{ minHeight: 220, maxHeight: 420 }}
      aria-live="polite"
      onScroll={onScroll}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      {typing && (
        <div className="flex items-center gap-2 text-xs animate-pulse px-4" style={{ color: '#333' }}>
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: VANGUARD_ACCENT }} />
          Bot is typing...
        </div>
      )}
      {showScrollBtn && (
        <button
          className="absolute right-4 bottom-24 text-white rounded-full p-2 shadow-lg transition"
          style={{ zIndex: 10, background: VANGUARD_BLUE }}
          onClick={onScrollToBottom}
          aria-label="Scroll to bottom"
        >
          ↓
        </button>
      )}
    </div>
  );
}

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="absolute bottom-14 right-4 bg-white border rounded-xl shadow-lg p-2 flex flex-wrap gap-1 z-50" style={{ borderColor: VANGUARD_ACCENT }}>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          className="text-xl hover:scale-125 transition-transform"
          onClick={() => onSelect(emoji)}
          type="button"
          aria-label={`Add emoji ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function ChatInput({ value, onChange, onSend, onEmoji, showEmoji, setShowEmoji }: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onEmoji: (emoji: string) => void;
  showEmoji: boolean;
  setShowEmoji: (v: boolean) => void;
}) {
  return (
    <form
      className="relative flex items-center gap-2 px-2 sm:px-4 py-3 border-t bg-white/80 backdrop-blur rounded-b-2xl"
      onSubmit={e => { e.preventDefault(); onSend(); }}
      aria-label="Type your message"
    >
      <button
        type="button"
        className="text-xl px-2"
        style={{ color: VANGUARD_ACCENT }}
        aria-label="Open emoji picker"
        onClick={() => setShowEmoji(!showEmoji)}
      >
        😊
      </button>
      {showEmoji && <EmojiPicker onSelect={onEmoji} />}
      <input
        className="flex-1 border-none rounded-full px-4 py-2 text-sm bg-white/70 focus:outline-none focus:ring-2 shadow-inner text-black placeholder-gray-500"
        style={{
          boxShadow: `0 0 0 2px ${VANGUARD_ACCENT}22`,
          outlineColor: VANGUARD_ACCENT,
        }}
        placeholder="Type your message..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSend()}
        aria-label="Message input"
        autoComplete="off"
      />
      <button
        type="submit"
        className="rounded-full px-5 py-2 font-semibold shadow transition text-white"
        style={{
          background: `linear-gradient(90deg, ${VANGUARD_BLUE} 0%, ${VANGUARD_ACCENT} 100%)`,
        }}
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}

function FloatingChatButton({ onClick, unread }: { onClick: () => void; unread: boolean }) {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-2xl border-4 border-white hover:scale-105 active:scale-95 transition-transform group"
      style={{
        background: `linear-gradient(135deg, ${VANGUARD_BLUE} 0%, ${VANGUARD_ACCENT} 100%)`,
        boxShadow: `0 8px 32px 0 ${VANGUARD_ACCENT}55, 0 0 16px 4px ${VANGUARD_ACCENT}55`,
      }}
      onClick={onClick}
      aria-label="Open live chat"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" fill="#fff" opacity="0.08" />
        <rect x="8" y="13" width="20" height="10" rx="5" fill="#fff" opacity="0.18" />
        <rect x="12" y="17" width="12" height="2" rx="1" fill={VANGUARD_ACCENT} />
        <text x="18" y="25" textAnchor="middle" fontSize="12" fill={VANGUARD_BLUE} fontWeight="bold">V</text>
      </svg>
      {unread && (
        <span className="absolute top-3 right-3 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce shadow">!</span>
      )}
    </button>
  );
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unread, setUnread] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && messages[messages.length - 1]?.user === 'Bot') {
      setUnread(true);
    }
  }, [messages, open]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].user === 'You') {
      setTyping(true);
      const timeout = setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          {
            id: Date.now().toString(),
            user: 'Bot',
            text: 'This is a smart bot reply! 🚀',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
        ]);
        setTyping(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  useEffect(() => {
    if (open) setUnread(false);
  }, [open]);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 60);
  };
  const handleScrollToBottom = () => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    setShowScrollBtn(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      {
        id: Date.now().toString(),
        user: 'You',
        text: input,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      },
    ]);
    setInput('');
    setShowEmoji(false);
  };

  const handleEmoji = (emoji: string) => {
    setInput((v) => v + emoji);
    setShowEmoji(false);
  };

  // Responsive chat window size
  const chatWindowClass =
    'fixed bottom-6 right-6 z-50 w-[98vw] max-w-lg sm:w-[420px] rounded-2xl shadow-2xl border border-[#21a1c4]/30 bg-white/70 backdrop-blur-lg flex flex-col overflow-hidden animate-fade-in ring-2 ring-[#1976a5]/30';

  return (
    <>
      {!open && <FloatingChatButton onClick={() => setOpen(true)} unread={unread} />}
      {open && (
        <section
          className={chatWindowClass}
          aria-label="Live chat widget"
          style={{
            minHeight: '420px',
            maxHeight: '80vh',
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
            boxShadow: `0 8px 32px 0 ${VANGUARD_ACCENT}55, 0 0 16px 4px ${VANGUARD_ACCENT}55`,
          }}
        >
          <ChatHeader onClose={() => setOpen(false)} />
          <div ref={chatRef} className="relative flex-1" style={{ minHeight: 220, maxHeight: 420 }}>
            <ChatMessages
              messages={messages}
              typing={typing}
              onScroll={handleScroll}
              showScrollBtn={showScrollBtn}
              onScrollToBottom={handleScrollToBottom}
            />
          </div>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onEmoji={handleEmoji}
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
          />
        </section>
      )}
      <style>{`
        @media (max-width: 640px) {
          .fixed.bottom-6.right-6.z-50.w-\[98vw\].max-w-lg.sm\:w-\[420px\] {
            width: 99vw !important;
            right: 0.5vw !important;
            left: 0.5vw !important;
            min-height: 60vw !important;
            max-height: 90vh !important;
            font-size: 1rem;
          }
        }
        .animate-fade-in {
          animation: fadeInChat 0.3s cubic-bezier(.4,2,.6,1);
        }
        @keyframes fadeInChat {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
