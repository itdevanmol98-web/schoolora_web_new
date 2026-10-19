import React, { useState } from 'react';
import { X, Send, Bot, ChevronUp } from 'lucide-react';

interface FloatingWidgetsProps {
  onOpenDemoModal?: () => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({ onOpenDemoModal }) => {
  const [offerCardMinimized, setOfferCardMinimized] = useState(false);
  const [offerCardClosed, setOfferCardClosed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! 👋 I am your Axionexa AI Assistant. How can I assist you with modern School Management ERP today?',
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'What modules are included?',
    'How much does ERP cost?',
    'Book a free school demo',
    'Get full source code license',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "Thank you for asking! Axionexa ERP includes 40+ comprehensive modules covering Admissions, Fees Collection, Online Exams, Attendance with biometric/QR, CBSE Report Cards, Parent App, and Staff Management.";

      const lower = text.toLowerCase();
      if (lower.includes('cost') || lower.includes('price') || lower.includes('pricing') || lower.includes('source code')) {
        botReply = "Our flexible plans start from ₹15/student/month. We also offer Complete Full Source Code licenses starting at ₹10,000 for customized institutional deployments! You can click 'Ask on WhatsApp' for instant quotation.";
      } else if (lower.includes('demo') || lower.includes('book')) {
        botReply = "We would love to show you a live personalized walkthrough! Click 'Book a Demo' or let us know your school contact number.";
        if (onOpenDemoModal) onOpenDemoModal();
      } else if (lower.includes('cbse') || lower.includes('icse') || lower.includes('academic')) {
        botReply = "Yes! Axionexa is 100% compliant with CBSE, ICSE, and State Board grading patterns, CCE assessment rubrics, and automated report card generators.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi Axionexa team, I saw the live demo and I'm interested in getting the source code / commercial license (₹10,000). Please share details.");
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '14px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ================= 1. OFFER CARD (Matching Mockup Screenshot) ================= */}
      {!offerCardClosed && (
        <>
          {offerCardMinimized ? (
            /* Minimized Offer Pill */
            <button
              onClick={() => setOfferCardMinimized(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '24px',
                backgroundColor: '#FFFBEB',
                border: '2px solid #F59E0B',
                color: '#92400E',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
                animation: 'bounceSlow 3s ease-in-out infinite',
              }}
              title="Expand offer card"
            >
              <span>✨</span>
              <span>Own Source Code: <strong>₹10,000</strong></span>
              <ChevronUp size={15} />
            </button>
          ) : (
            /* Full Expanded Offer Card */
            <div
              style={{
                width: '285px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '2.5px solid #FDE047',
                padding: '16px 18px',
                boxShadow: '0 16px 36px -4px rgba(245, 158, 11, 0.22), 0 6px 16px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                  <span style={{ fontSize: '15px' }}>👀</span>
                  <span>You're viewing the live demo</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* Minimize Button */}
                  <button
                    onClick={() => setOfferCardMinimized(true)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748B',
                      fontSize: '16px',
                      lineHeight: 1,
                    }}
                    title="Minimize"
                    aria-label="Minimize offer"
                  >
                    —
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={() => setOfferCardClosed(true)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#94A3B8',
                    }}
                    title="Dismiss"
                    aria-label="Dismiss offer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Yellow Highlight Card: Own this — get the source code ₹10,000 */}
              <div
                style={{
                  backgroundColor: '#FBBF24',
                  background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1E293B',
                    lineHeight: 1.3,
                  }}
                >
                  Own this — get the source code
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  ₹10,000
                </div>
              </div>

              {/* WhatsApp CTA Button */}
              <button
                onClick={handleWhatsAppClick}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  backgroundColor: '#22C55E',
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  color: '#FFFFFF',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(34, 197, 94, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                className="whatsapp-btn-hover"
                title="Chat on WhatsApp"
              >
                {/* Official WhatsApp SVG Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.04 7.42C8.88 7.42 8.63 7.48 8.41 7.72C8.19 7.96 7.57 8.54 7.57 9.73C7.57 10.92 8.44 12.07 8.56 12.23C8.68 12.39 10.28 14.86 12.73 15.92C13.31 16.17 13.77 16.32 14.12 16.44C14.71 16.62 15.24 16.6 15.67 16.53C16.15 16.46 17.14 15.93 17.35 15.35C17.56 14.76 17.56 14.26 17.5 14.16C17.44 14.05 17.29 13.99 17.06 13.88C16.84 13.76 15.73 13.22 15.52 13.14C15.31 13.07 15.17 13.03 15.02 13.25C14.88 13.47 14.46 13.96 14.33 14.11C14.21 14.26 14.08 14.28 13.86 14.16C13.64 14.05 12.92 13.82 12.08 13.07C11.42 12.48 10.98 11.75 10.85 11.53C10.73 11.31 10.84 11.19 10.95 11.08C11.05 10.98 11.18 10.81 11.29 10.68C11.41 10.55 11.45 10.45 11.52 10.3C11.6 10.16 11.56 10.03 11.5 9.92C11.45 9.81 11.03 8.78 10.86 8.36C10.69 7.96 10.51 8.01 10.38 8C10.26 8 10.11 8 9.96 8C9.82 8 9.59 8.05 9.4 8.26C9.21 8.48 8.67 8.98 8.67 10.02C8.67 11.06 9.43 12.07 9.54 12.22" />
                </svg>
                <span>Ask on WhatsApp</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= 2. AI CHAT WINDOW (Opens on Click) ================= */}
      {chatOpen && (
        <div
          style={{
            width: '350px',
            maxWidth: 'calc(100vw - 32px)',
            height: '480px',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25), 0 8px 16px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: '#1E293B',
                  border: '1.5px solid #38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Bot size={20} color="#38BDF8" />
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                    border: '1.5px solid #0F172A',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                  Axionexa AI
                </div>
                <div style={{ fontSize: '11px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>● Online Assistant</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E2E8F0',
                cursor: 'pointer',
              }}
              title="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: '14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: '#F8FAFC',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: msg.sender === 'user' ? '#2563EB' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                    fontSize: '13px',
                    lineHeight: 1.45,
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(37,99,235,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '3px', padding: '0 4px' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#FFFFFF', borderRadius: '12px', width: 'fit-content' }}>
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94A3B8', animationDelay: '0.2s' }} />
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94A3B8', animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
            }}
          >
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  color: '#2563EB',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '10px 12px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about ERP..."
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                fontSize: '13px',
                outline: 'none',
                color: '#0F172A',
              }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                opacity: inputMessage.trim() ? 1 : 0.6,
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* ================= 3. FLOATING AI ROBOT TRIGGER BUTTON ================= */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          outline: 'none',
          position: 'relative',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="robot-trigger-btn"
        title={chatOpen ? 'Close AI Chat' : 'Chat with Axionexa AI'}
        aria-label="Toggle AI Assistant"
      >
        {/* Glow halo behind robot */}
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '28px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(34,197,94,0.15) 50%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Robot Top Antenna with glowing orange orb */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '-4px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Glowing Orange Orb */}
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FF6B00',
              boxShadow: '0 0 10px #FF6B00, 0 0 16px rgba(255,107,0,0.6)',
              border: '1.5px solid #FFFFFF',
              animation: 'pulseGlow 2s infinite ease-in-out',
            }}
          />
          {/* Antenna Stem */}
          <div
            style={{
              width: '3px',
              height: '8px',
              backgroundColor: '#E2E8F0',
              borderRadius: '1px',
            }}
          />
        </div>

        {/* Robot White Curved Body (Matching Mockup) */}
        <div
          style={{
            width: '68px',
            height: '64px',
            backgroundColor: '#F8FAFC',
            borderRadius: '24px',
            border: '2px solid #FFFFFF',
            boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.2), 0 4px 10px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
          }}
        >
          {/* Dark Curved Visor Screen */}
          <div
            style={{
              width: '46px',
              height: '32px',
              borderRadius: '12px',
              backgroundColor: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Left Glowing Neon Green Capsule Eye */}
            <div
              style={{
                width: '8px',
                height: '15px',
                borderRadius: '5px',
                backgroundColor: '#22C55E',
                boxShadow: '0 0 8px #22C55E, 0 0 14px rgba(34,197,94,0.7)',
                animation: 'robotBlink 4s infinite',
              }}
            />
            {/* Right Glowing Neon Green Capsule Eye */}
            <div
              style={{
                width: '8px',
                height: '15px',
                borderRadius: '5px',
                backgroundColor: '#22C55E',
                boxShadow: '0 0 8px #22C55E, 0 0 14px rgba(34,197,94,0.7)',
                animation: 'robotBlink 4s infinite',
              }}
            />
          </div>
        </div>
      </button>

      {/* Embedded Animations */}
      <style>{`
        .robot-trigger-btn:hover {
          transform: translateY(-4px) scale(1.05);
        }
        .whatsapp-btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(34, 197, 94, 0.5) !important;
        }
        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.85;
          }
        }
        @keyframes robotBlink {
          0%, 45%, 55%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.1);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .typing-dot {
          animation: typingBlink 1.4s infinite both;
        }
        @keyframes typingBlink {
          0%, 80%, 100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
