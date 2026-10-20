import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  CreditCard,
  GraduationCap,
  Building,
  ChevronRight,
} from 'lucide-react';

interface HeroProps {
  onBookDemo: () => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookDemo, onExplore }) => {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        paddingTop: '60px',
        paddingBottom: '80px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      }}
    >
      {/* Background Subtle Gradient Blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 180, 216, 0.12) 0%, rgba(37, 99, 235, 0.06) 50%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1.15fr',
            gap: '48px',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left Column: Copy & Actions */}
          <div style={{ maxWidth: '620px' }}>
            {/* Small Badge */}
            <div style={{ marginBottom: '20px' }}>
              <Badge variant="blue" icon={<Sparkles size={14} color="#2563EB" />}>
                AI-Powered School Management Platform
              </Badge>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(34px, 4.5vw, 54px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0B132B',
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              Smart School Management.{' '}
              <span className="gradient-text-orange" style={{ display: 'block' }}>
                One Powerful ERP.
              </span>
            </h1>

            {/* Supporting Headline */}
            <p
              style={{
                fontSize: 'clamp(16px, 1.8vw, 18px)',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '32px',
                fontWeight: 400,
              }}
            >
              Manage academics, admissions, attendance, fees, communication, staff, transport and
              more from one connected school management platform.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '36px',
              }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onBookDemo}
                icon={<ArrowRight size={17} />}
              >
                Book a Free Demo
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onExplore}
                icon={<ChevronRight size={17} />}
              >
                Explore ERP
              </Button>
            </div>

            {/* Trust Badges Below CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '20px',
                color: '#475569',
                fontSize: '13.5px',
                fontWeight: 600,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10B981" /> Easy to Use
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#2563EB" /> Secure & Reliable
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#FF6B00" /> Dedicated Support
              </span>
            </div>
          </div>

          {/* Right Column: Realistic ERP Dashboard Mockup & Floating Glassmorphism Cards */}
          <div style={{ position: 'relative' }}>
            {/* Main Mockup Window */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #CBD5E1',
                boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.18)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Mockup Header Bar */}
              <div
                style={{
                  backgroundColor: '#0B132B',
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '10px', fontWeight: 500 }}>
                    axionexa.erp/dashboard/overview
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 180, 216, 0.2)',
                    color: '#38BDF8',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  LIVE SYSTEM
                </span>
              </div>

              {/* Mockup Dashboard Content */}
              <div style={{ padding: '20px', backgroundColor: '#F8FAFC' }}>
                {/* 4 Quick Stat Tiles */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    marginBottom: '18px',
                  }}
                  className="mockup-stats-grid"
                >
                  <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} color="#2563EB" /> Students
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>1,248</div>
                  </div>

                  <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} color="#10B981" /> Present
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>1,166</div>
                  </div>

                  <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CreditCard size={12} color="#FF6B00" /> Fees
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#FF6B00', marginTop: '2px' }}>₹12.5L</div>
                  </div>

                  <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={12} color="#8B5CF6" /> Staff
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#8B5CF6', marginTop: '2px' }}>86</div>
                  </div>
                </div>

                {/* Visual Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', marginBottom: '16px' }} className="mockup-charts-grid">
                  {/* Attendance Bar Chart Representation */}
                  <div style={{ background: '#FFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                      Attendance Overview
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', gap: '8px' }}>
                      {[
                        { day: 'M', h: '88%', c: '#2563EB' },
                        { day: 'T', h: '94%', c: '#2563EB' },
                        { day: 'W', h: '96%', c: '#2563EB' },
                        { day: 'T', h: '92%', c: '#2563EB' },
                        { day: 'F', h: '95%', c: '#00B4D8' },
                        { day: 'S', h: '90%', c: '#00B4D8' },
                      ].map((b, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <div
                            style={{
                              width: '100%',
                              height: b.h,
                              backgroundColor: b.c,
                              borderRadius: '4px 4px 0 0',
                            }}
                          />
                          <span style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>{b.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fee Collection Donut Chart Representation */}
                  <div style={{ background: '#FFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', width: '100%', marginBottom: '8px' }}>
                      Fee Collection
                    </div>
                    {/* CSS Donut Circle */}
                    <div
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        background: 'conic-gradient(#00B4D8 0% 72%, #FF6B00 72% 88%, #E2E8F0 88% 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#0F172A',
                        }}
                      >
                        88%
                      </div>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: 600, marginTop: '6px' }}>
                      ₹12.5L collected
                    </span>
                  </div>
                </div>

                {/* Recent Activities Mini List */}
                <div style={{ background: '#FFF', padding: '12px 14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Recent School Activities
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <span style={{ color: '#1E293B', fontWeight: 500 }}>Term Fee Received - Grade 10</span>
                      <span style={{ color: '#10B981', fontWeight: 600 }}>+₹18,500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <span style={{ color: '#1E293B', fontWeight: 500 }}>New Admission - Grade 7</span>
                      <span style={{ color: '#2563EB', fontWeight: 600 }}>Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphic Card: Attendance 94% (Top Right) */}
            <div
              className="glass-card animate-float"
              style={{
                position: 'absolute',
                top: '-24px',
                right: '-20px',
                padding: '12px 16px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00B4D8 0%, #2563EB 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '12px',
                }}
              >
                94%
              </div>
              <div>
                <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Attendance
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>High Presence</div>
              </div>
            </div>

            {/* Floating Glassmorphic Card: Trusted by Schools (Bottom Left) */}
            <div
              className="glass-card animate-float-delay"
              style={{
                position: 'absolute',
                bottom: '-22px',
                left: '-24px',
                padding: '10px 16px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                }}
              >
                <Building size={18} />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Trusted by</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>500+ Top Schools</div>
              </div>
            </div>

            {/* Floating Glassmorphic Card: AI Insights (Bottom Right) */}
            <div
              className="glass-card animate-float"
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '-28px',
                padding: '10px 16px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 2,
                border: '1px solid rgba(0, 180, 216, 0.4)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FFA048 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#EA580C', fontWeight: 700 }}>AI Insights</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Automated Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 640px) {
          .mockup-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .mockup-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
