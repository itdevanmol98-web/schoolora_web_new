import React, { useState } from 'react';
import { testimonialsData } from '@/data/landing/testimonials.data';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i === 0 ? testimonialsData.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === testimonialsData.length - 1 ? 0 : i + 1));

  return (
    <section id="testimonials" style={{ paddingTop: '90px', paddingBottom: '90px', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
            What School Teams Say
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
            Trusted by educators and administrators across India.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="testimonial-grid">
          {testimonialsData.map((t, idx) => (
            <div
              key={t.id}
              style={{
                backgroundColor: idx === activeIdx ? '#0B132B' : '#FFFFFF',
                borderRadius: '20px',
                border: idx === activeIdx ? '1px solid #1E3A8A' : '1px solid #E2E8F0',
                padding: '28px',
                transition: 'all 0.3s',
                boxShadow: idx === activeIdx ? '0 20px 40px -10px rgba(11,19,43,0.25)' : '0 2px 8px -2px rgba(15,23,42,0.05)',
                cursor: 'pointer',
              }}
              onClick={() => setActiveIdx(idx)}
            >
              {/* Quote Icon */}
              <Quote size={28} color={idx === activeIdx ? 'rgba(0,180,216,0.5)' : '#E2E8F0'} style={{ marginBottom: '16px' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={15} color="#F59E0B" fill="#F59E0B" />
                ))}
              </div>

              {/* Quote Text */}
              <p style={{ fontSize: '14.5px', color: idx === activeIdx ? '#CBD5E1' : '#475569', lineHeight: 1.65, marginBottom: '20px' }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: idx === activeIdx ? 'linear-gradient(135deg, #2563EB, #00B4D8)' : 'linear-gradient(135deg, #E2E8F0, #CBD5E1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}>
                  {t.authorInitials}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: idx === activeIdx ? '#FFFFFF' : '#0F172A' }}>
                    {t.role}
                  </div>
                  <div style={{ fontSize: '12.5px', color: idx === activeIdx ? '#64748B' : '#94A3B8', marginTop: '2px' }}>
                    {t.schoolName} · {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px', alignItems: 'center' }}>
          <button
            onClick={prev}
            style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', color: '#475569' }}
            className="carousel-btn-hover"
          >
            <ChevronLeft size={18} />
          </button>
          {testimonialsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{ width: i === activeIdx ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === activeIdx ? '#2563EB' : '#CBD5E1', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
            />
          ))}
          <button
            onClick={next}
            style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', color: '#475569' }}
            className="carousel-btn-hover"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .carousel-btn-hover:hover { background-color: #2563EB !important; color: #FFFFFF !important; border-color: #2563EB !important; }
        @media (max-width: 900px) { .testimonial-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};
