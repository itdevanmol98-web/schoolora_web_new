import React from 'react';
import { ArrowRight, PhoneCall, CheckCircle2, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onBookDemo: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onBookDemo }) => (
  <section
    id="contact"
    style={{
      paddingTop: '100px',
      paddingBottom: '100px',
      background: 'linear-gradient(135deg, #0B132B 0%, #1E3A8A 50%, #0B132B 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Background particles/glows */}
    <div style={{ position: 'absolute', top: '-100px', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '-80px', left: '8%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,216,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

    <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(255,107,0,0.2)', border: '1px solid rgba(255,107,0,0.4)', color: '#FF8533', fontSize: '13px', fontWeight: 700, marginBottom: '24px' }}>
        <Sparkles size={15} /> Limited Onboarding Slots Available
      </div>

      <h2 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '20px' }}>
        Ready to Transform<br />
        <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your School?</span>
      </h2>

      <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: '#94A3B8', maxWidth: '660px', margin: '0 auto 36px auto', lineHeight: 1.65 }}>
        Bring admissions, academics, attendance, fees, communication and administration together with AXIONEXA ERP.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '36px' }}>
        <button
          onClick={onBookDemo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 30px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FF6B00, #FF8533)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '16px',
            boxShadow: '0 6px 24px rgba(255,107,0,0.45)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          className="cta-primary-hover"
        >
          Book a Free Demo <ArrowRight size={18} />
        </button>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 30px',
            borderRadius: '14px',
            background: 'transparent',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '16px',
            border: '1.5px solid rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          className="cta-secondary-hover"
        >
          <PhoneCall size={17} /> Talk to Our Team
        </button>
      </div>

      {/* Trust Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', color: '#64748B', fontSize: '14px', fontWeight: 600 }}>
        {['No complicated setup.', 'Get a guided product walkthrough.', 'Trusted by 500+ schools.'].map((t) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#10B981" /> {t}
          </span>
        ))}
      </div>
    </div>

    <style>{`
      .cta-primary-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,107,0,0.55) !important; }
      .cta-secondary-hover:hover { background: rgba(255,255,255,0.12) !important; border-color: #FFFFFF !important; }
    `}</style>
  </section>
);
