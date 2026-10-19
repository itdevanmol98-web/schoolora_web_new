import React from 'react';
import { achievementsData } from '@/data/landing/achievements.data';
import { Trophy, Award, Star } from 'lucide-react';

export const Achievements: React.FC = () => (
  <section style={{ paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#F8FAFC' }}>
    <div className="container">
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
          Recognition & Achievements
        </h2>
        <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
          Recognised for excellence in EdTech innovation and institutional empowerment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="achievements-grid">
        {achievementsData.map((ach) => (
          <div
            key={ach.id}
            style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px 28px', textAlign: 'center', boxShadow: '0 2px 8px -2px rgba(15,23,42,0.05)', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
            className="achievement-card-hover"
          >
            {/* Corner Accent */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'linear-gradient(135deg, transparent 50%, #FEF3C7 50%)' }} />

            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 8px 20px rgba(251,191,36,0.35)' }}>
              <Trophy size={30} color="#FFFFFF" />
            </div>

            <div style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '6px', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
              {ach.code} · {ach.year}
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
              {ach.awardName}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#FF6B00', marginBottom: '12px' }}>
              <Award size={15} />
              {ach.issuingOrganization}
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55 }}>{ach.description}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '16px' }}>
              {[...Array(3)].map((_, i) => <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />)}
            </div>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      .achievement-card-hover:hover { transform: translateY(-5px); border-color: #FCD34D !important; box-shadow: 0 14px 30px -6px rgba(251,191,36,0.18) !important; }
      @media (max-width: 900px) { .achievements-grid { grid-template-columns: 1fr !important; } }
    `}</style>
  </section>
);
