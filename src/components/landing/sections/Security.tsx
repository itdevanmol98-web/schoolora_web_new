import React from 'react';
import { securityPillars, securityTags } from '@/data/landing/security.data';
import { Shield, Lock, Database, RefreshCw, ShieldCheck } from 'lucide-react';

export const Security: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'shield': return <Shield size={24} color="#2563EB" />;
      case 'lock': return <Lock size={24} color="#10B981" />;
      case 'database': return <Database size={24} color="#00B4D8" />;
      case 'refresh': return <RefreshCw size={24} color="#FF6B00" />;
      default: return <Shield size={24} color="#2563EB" />;
    }
  };

  return (
    <section
      id="security"
      style={{ paddingTop: '90px', paddingBottom: '90px', backgroundColor: '#F8FAFC' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
            Secure School Data.{' '}
            <span className="gradient-text-cyan">Built for Trust.</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
            Every piece of student, staff, and financial data is protected by enterprise-grade security standards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }} className="security-cards-grid">
          {securityPillars.map((pillar) => (
            <div
              key={pillar.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                textAlign: 'center',
                transition: 'all 0.25s',
                boxShadow: '0 2px 8px -2px rgba(15,23,42,0.05)',
              }}
              className="security-card-hover"
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', border: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px auto' }}>
                {getIcon(pillar.icon)}
              </div>
              <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>{pillar.title}</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>{pillar.description}</p>
              <div style={{ marginTop: '14px', display: 'inline-block', padding: '4px 10px', backgroundColor: '#F0FDF4', color: '#15803D', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                {pillar.badge}
              </div>
            </div>
          ))}
        </div>

        {/* Security Tags Row + Central Shield */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* Central Shield Visual */}
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #0B132B, #1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>
              <ShieldCheck size={44} color="#FFFFFF" />
            </div>
          </div>

          {/* Security Feature Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {securityTags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '7px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#334155',
                  boxShadow: '0 2px 4px rgba(15,23,42,0.04)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .security-card-hover:hover { transform: translateY(-4px); border-color: #BFDBFE !important; box-shadow: 0 12px 24px -6px rgba(37,99,235,0.1) !important; }
        @media (max-width: 1024px) { .security-cards-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .security-cards-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};
