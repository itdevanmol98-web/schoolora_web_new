import React, { useState, useRef, useEffect } from 'react';
import { aiPresetPrompts, aiFeaturePills } from '@/data/landing/aiAssistant.data';
import { Sparkles, Send, Bot, User, ChevronRight } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "👋 Hi! I'm your Axionexa AI Copilot. Ask me anything about your school's attendance, fees, academics, or generate a report instantly." },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;
    const userMessage: Message = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const preset = aiPresetPrompts.find((p) =>
        text.toLowerCase().includes(p.prompt.toLowerCase().slice(0, 15))
      );
      const aiResponse = preset
        ? preset.response
        : `📊 Analyzing your request: "${text}"\n\nBased on current school data, I've prepared a real-time summary. Connect Axionexa AI to your live school database for accurate actionable insights and automated reports.`;

      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section
      id="ai-assistant"
      style={{
        paddingTop: '90px',
        paddingBottom: '90px',
        backgroundColor: '#060B18',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glowing orb */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.2) 0%, rgba(37,99,235,0.1) 40%, transparent 70%)',
          animation: 'pulseSlow 6s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '64px', alignItems: 'center' }} className="ai-section-grid">
          {/* Left: Copy & AI Pills */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: '#00B4D8', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
              <Sparkles size={15} /> Axionexa AI Copilot
            </div>

            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '16px' }}>
              Your School's{' '}
              <span style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI Assistant.
              </span>{' '}
              <br />Available 24×7.
            </h2>

            <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.7, marginBottom: '32px' }}>
              Turn your school data into useful insights, smart summaries, and actionable recommendations — without any manual effort.
            </p>

            {/* AI Feature Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {aiFeaturePills.map((pill) => (
                <span
                  key={pill}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#CBD5E1',
                    fontSize: '13.5px',
                    fontWeight: 600,
                  }}
                >
                  <ChevronRight size={13} color="#00B4D8" />
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right: AI Chat Interface */}
          <div
            style={{
              backgroundColor: 'rgba(21,34,68,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Chat Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,180,216,0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#FFF" />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF' }}>Axionexa AI Copilot</div>
                <div style={{ fontSize: '11.5px', color: '#00B4D8', fontWeight: 600 }}>● Online & Ready</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ height: '280px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'ai' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={14} color="#FFF" />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: msg.role === 'user' ? '#2563EB' : 'rgba(255,255,255,0.08)',
                      border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      color: '#E2E8F0',
                      fontSize: '13px',
                      lineHeight: 1.55,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={14} color="#CBD5E1" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={14} color="#FFF" />
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00B4D8', animation: `pulseSlow ${0.8 + i * 0.2}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset Prompt Buttons */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {aiPresetPrompts.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSend(p.prompt)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#94A3B8',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  className="preset-btn-hover"
                >
                  {p.prompt}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about your school..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSend()}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563EB, #00B4D8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                <Send size={17} color="#FFF" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .preset-btn-hover:hover { background-color: rgba(0,180,216,0.15) !important; color: #00B4D8 !important; border-color: rgba(0,180,216,0.4) !important; }
        @media (max-width: 1024px) { .ai-section-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};
