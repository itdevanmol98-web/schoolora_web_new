import React from 'react';
import { ecosystemApps } from '@/data/landing/ecosystem.data';
import {
  ShieldAlert,
  Building2,
  HeartHandshake,
  BookOpenCheck,
  GraduationCap,
  Bus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AppsEcosystemProps {
  onExploreApp?: (appTitle: string) => void;
}

export const AppsEcosystem: React.FC<AppsEcosystemProps> = ({ onExploreApp }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <ShieldAlert size={22} color="#2563EB" />;
      case 'school':
        return <Building2 size={22} color="#00B4D8" />;
      case 'family':
        return <HeartHandshake size={22} color="#FF6B00" />;
      case 'teacher':
        return <BookOpenCheck size={22} color="#10B981" />;
      case 'student':
        return <GraduationCap size={22} color="#8B5CF6" />;
      case 'bus':
      default:
        return <Bus size={22} color="#F97316" />;
    }
  };

  return (
    <section
      id="apps"
      style={{
        paddingTop: '90px',
        paddingBottom: '90px',
        backgroundColor: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 50px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontSize: '12.5px',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={14} /> 360° Connected Ecosystem
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 800,
              color: '#0B132B',
              letterSpacing: '-0.025em',
            }}
          >
            One ERP.{' '}
            <span className="gradient-text-orange">Multiple Connected Experiences.</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
            Every stakeholder gets the right tools while the school stays completely connected in
            real-time.
          </p>
        </div>

        {/* Central Visual + Radiating Cards */}
        <div style={{ position: 'relative' }}>
          {/* Central Hub Orb for Desktop */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 40px auto',
            }}
            className="ecosystem-center-hub"
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0B132B 0%, #1E3A8A 100%)',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(37, 99, 235, 0.35)',
                border: '4px solid #FFFFFF',
                textAlign: 'center',
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '0.04em',
                }}
              >
                AXION<span style={{ color: '#00B4D8' }}>EXA</span>
              </span>
              <span
                style={{
                  backgroundColor: '#2563EB',
                  fontSize: '9px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  marginTop: '2px',
                }}
              >
                CORE HUB
              </span>
              <span style={{ fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>
                Synced 24×7
              </span>
            </div>
          </div>

          {/* 6 Stakeholder App Cards (3 on top / 3 on bottom or responsive grid) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
            className="ecosystem-cards-grid"
          >
            {ecosystemApps.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.25s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="ecosystem-card-hover"
              >
                {/* Accent Top Strip */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: '#2563EB',
                  }}
                />

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getIcon(app.iconType)}
                    </div>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {app.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                    {app.roleTitle}
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#00B4D8', marginBottom: '10px' }}>
                    {app.subtitle}
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.5', marginBottom: '18px' }}>
                    {app.tagline}
                  </p>

                  {/* Bullet Highlights */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                    {app.features.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '12px',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onExploreApp && onExploreApp(app.roleTitle)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#2563EB',
                    padding: 0,
                  }}
                  className="explore-link-hover"
                >
                  <span>Explore Features</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ecosystem-card-hover:hover {
          transform: translateY(-5px);
          border-color: #38BDF8 !important;
          box-shadow: 0 16px 32px -4px rgba(15, 23, 42, 0.1) !important;
        }
        @media (max-width: 1024px) {
          .ecosystem-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .ecosystem-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .ecosystem-center-hub {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
