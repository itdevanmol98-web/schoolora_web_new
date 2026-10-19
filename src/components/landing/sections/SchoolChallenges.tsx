import React, { useState } from 'react';
import { schoolChallenges } from '@/data/landing/challenges.data';
import { CheckCircle2, AlertCircle, Target } from 'lucide-react';

export const SchoolChallenges: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      id="why-axionexa"
      style={{
        paddingTop: '90px',
        paddingBottom: '90px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="challenges-grid"
        >
          {/* Left: Challenge List */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFF7ED',
                  color: '#FF6B00',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  marginBottom: '14px',
                }}
              >
                <Target size={14} /> Real School Challenges Solved
              </div>
              <h2
                style={{
                  fontSize: 'clamp(26px, 3.5vw, 36px)',
                  fontWeight: 800,
                  color: '#0B132B',
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                }}
              >
                Built for Real Schools.{' '}
                <span className="gradient-text-orange">Designed for Real Work.</span>
              </h2>
              <p style={{ fontSize: '16px', color: '#64748B', marginTop: '12px', lineHeight: 1.6 }}>
                Every challenge your school faces daily has been carefully thought through and solved
                inside Axionexa ERP.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {schoolChallenges.map((ch) => (
                <div
                  key={ch.id}
                  onMouseEnter={() => setHovered(ch.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: hovered === ch.id ? '1px solid #BFDBFE' : '1px solid #F1F5F9',
                    backgroundColor: hovered === ch.id ? '#EFF6FF' : '#FAFAFA',
                    transition: 'all 0.25s',
                    cursor: 'default',
                  }}
                >
                  {hovered === ch.id ? (
                    <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <AlertCircle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A' }}>
                      {ch.title}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#64748B',
                        marginTop: '3px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {hovered === ch.id ? ch.solutionText : ch.problemText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard Performance Visual */}
          <div style={{ position: 'relative' }}>
            {/* Main Dashboard Mockup Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 48px -12px rgba(15, 23, 42, 0.14)',
                padding: '28px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                    School Performance Overview
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                    Academic Year 2025–26 • Real-time Sync
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#F0FDF4',
                    color: '#15803D',
                    border: '1px solid #BBF7D0',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  ● LIVE
                </div>
              </div>

              {/* 3 Metric Bars */}
              {[
                { label: 'Student Attendance', value: '94.6%', width: '94.6%', color: '#2563EB' },
                { label: 'Fee Collection', value: '88.0%', width: '88%', color: '#10B981' },
                { label: 'Academic Progress', value: '76.4%', width: '76.4%', color: '#FF6B00' },
              ].map((m) => (
                <div key={m.label} style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px',
                    }}
                  >
                    <span>{m.label}</span>
                    <span style={{ color: m.color, fontWeight: 800 }}>{m.value}</span>
                  </div>
                  <div
                    style={{
                      height: '10px',
                      borderRadius: '99px',
                      backgroundColor: '#F1F5F9',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: m.width,
                        borderRadius: '99px',
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Circular Performance Score */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginTop: '24px',
                  padding: '18px',
                  borderRadius: '16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 34 * 0.8} ${2 * Math.PI * 34}`}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#0F172A',
                    }}
                  >
                    80%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                    Overall ERP Efficiency
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>
                    Based on attendance, fee & academic metrics across all wings.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Caption */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '20px',
                fontSize: '13px',
                color: '#64748B',
                fontWeight: 500,
              }}
            >
              One centralized platform for your entire school operation.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .challenges-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
