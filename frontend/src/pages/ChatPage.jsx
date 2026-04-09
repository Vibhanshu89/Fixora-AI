import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AgentThinkingPanel from '../components/AgentThinkingPanel';
import './ChatPage.css';

const SUGGESTIONS = [
  'My fan is not working, please fix it',
  'AC is not cooling properly',
  'Pipe is leaking in the bathroom',
  'Washing machine stopped working',
  'Need house deep cleaning',
  'Wall painting needed for 2 rooms',
];

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`chat-bubble-row ${isUser ? 'user' : 'ai'}`}>
      {!isUser && <div className="chat-avatar ai-avatar">🤖</div>}
      <div className={`chat-bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
        <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
        <span className="bubble-time">{new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      {isUser && (
        <div className="chat-avatar user-avatar">
          {msg.avatar ? <img src={msg.avatar} alt="" /> : msg.initial || 'U'}
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello ${user?.name?.split(' ')[0] || ''}! 👋 I'm **Fixora AI**, your intelligent home service assistant.\n\nDescribe any repair or maintenance problem and I'll find the best technician near you and book the service automatically!\n\nWhat needs fixing today?`, time: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentSteps, setAgentSteps] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Install uuid if needed (use sessionStorage fallback)
  const getSessionId = () => sessionId || `session_${Date.now()}`;

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msgText, time: Date.now(), initial: user?.name?.[0]?.toUpperCase(), avatar: user?.avatar };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setIsThinking(true);
    setAgentSteps([]);

    try {
      const { data } = await axios.post('/api/chat', {
        message: msgText,
        sessionId: getSessionId(),
        city: user?.city,
      });

      // Show agent steps
      if (data.agentSteps?.length) {
        const steps = data.agentSteps.map(s => ({ type: 'result', tool: s.tool, detail: s.step }));
        setAgentSteps(steps);
      }

      setMessages(prev => [...prev, { role: 'ai', content: data.message, time: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '⚠️ Sorry, I ran into an issue. Please make sure the backend is running and your Gemini API key is configured.',
        time: Date.now()
      }]);
    } finally {
      setLoading(false);
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="chat-page">
      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="chat-panel-header">
          <div className="chat-header-ai">
            <div className="chat-ai-avatar">🤖</div>
            <div>
              <h3>Fixora AI Assistant</h3>
              <div className="chat-status"><span className="status-dot" /> Online — Powered by Gemini AI</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setMessages([messages[0]])}>
            🔄 New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
          {loading && (
            <div className="chat-bubble-row ai">
              <div className="chat-avatar ai-avatar">🤖</div>
              <div className="chat-bubble bubble-ai typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Describe your problem... (e.g. My fan is not working)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            disabled={loading}
          />
          <button className="chat-send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '➤'}
          </button>
        </div>
      </div>

      {/* Agent Panel */}
      <div className="chat-agent-panel">
        <AgentThinkingPanel steps={agentSteps} isThinking={isThinking} />
      </div>
    </div>
  );
}
