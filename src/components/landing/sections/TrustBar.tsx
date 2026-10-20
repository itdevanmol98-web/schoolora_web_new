import React from 'react';
import {
  UserPlus,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  FileCheck2,
  Users,
  BookOpen,
  Bus,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const TrustBar: React.FC = () => {
  const chips = [
    { label: 'Admissions', icon: <UserPlus size={18} />, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Attendance', icon: <CalendarCheck size={18} />, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Fees', icon: <CreditCard size={18} />, color: '#6366F1', bg: '#EEF2FF' },
    { label: 'Academics', icon: <GraduationCap size={18} />, color: '#00B4D8', bg: '#E0F2FE' },
    { label: 'Exams', icon: <FileCheck2 size={18} />, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'HR & Payroll', icon: <Users size={18} />, color: '#FF6B00', bg: '#FFF7ED' },
    { label: 'Library', icon: <BookOpen size={18} />, color: '#1E293B', bg: '#F1F5F9' },
    { label: 'Transport', icon: <Bus size={18} />, color: '#F97316', bg: '#FFF7ED' },
    { label: 'Communication', icon: <MessageSquare size={18} />, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'AI Analytics', icon: <Sparkles size={18} />, color: '#0284C7', bg: '#E0F2FE' },
  ];

  return (
    <section
      style={{
        paddingTop: '40px',
        paddingBottom: '50px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #F1F5F9',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <div className="container">
        {/* Compact Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 800,
              color: '#0B132B',
              letterSpacing: '-0.02em',
            }}
          >
            Everything Your School Needs.{' '}
            <span className="gradient-text-orange">Connected in One Platform.</span>
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            A complete ecosystem to manage your school efficiently and effortlessly.
          </p>
        </div>

        {/* 10 Feature Chips Grid / Horizontal Scroll on Mobile */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
          className="chips-scroll-container"
        >
          {chips.map((chip) => (
            <div
              key={chip.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="chip-card-hover"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: chip.bg,
                  color: chip.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {chip.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                {chip.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .chip-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 18px -4px rgba(15, 23, 42, 0.1) !important;
          border-color: #CBD5E1 !important;
        }
        @media (max-width: 768px) {
          .chips-scroll-container {
            justify-content: flex-start !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            padding-bottom: 12px;
            scroll-snap-type: x mandatory;
          }
          .chips-scroll-container > div {
            flex-shrink: 0;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};
