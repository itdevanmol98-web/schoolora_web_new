import React, { useState } from 'react';
import { roleWorkspaces } from '@/data/landing/roleDashboards.data';
import { CreditCard, Users, BookOpen, School, GraduationCap, Shield } from 'lucide-react';

export const RoleDashboards: React.FC = () => {
  const [activeRoleId, setActiveRoleId] = useState('principal');
  const activeRole = roleWorkspaces.find((r) => r.id === activeRoleId) || roleWorkspaces[0];

  const getModuleIcon = (icon: string) => {
    switch (icon) {
      case 'school': return <School size={18} color="#2563EB" />;
      case 'academic': return <BookOpen size={18} color="#00B4D8" />;
      case 'fee': return <CreditCard size={18} color="#10B981" />;
      case 'staff': return <Users size={18} color="#FF6B00" />;
      default: return <Shield size={18} color="#8B5CF6" />;
    }
  };

  return (
    <section style={{ paddingTop: '90px', paddingBottom: '90px', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
            One ERP.{' '}
            <span className="gradient-text-orange">Every Role Has Its Own Workspace.</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
            Tailored dashboards for every stakeholder — same platform, personalized experience.
          </p>
        </div>

        {/* Role Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '40px' }} className="role-tabs-bar">
          {roleWorkspaces.map((role) => {
            const isActive = role.id === activeRoleId;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRoleId(role.id)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: isActive ? '#2563EB' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: 'none',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
                }}
              >
                {role.roleName}
              </button>
            );
          })}
        </div>

        {/* Role Content Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px', alignItems: 'start' }} className="role-preview-grid">
          {/* Dashboard Preview (left) */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 8px 24px -6px rgba(15,23,42,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>{activeRole.title}</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>{activeRole.tagline}</div>
              </div>
              <GraduationCap size={22} color="#2563EB" />
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {activeRole.metrics.map((m, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>{m.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{m.value}</div>
                  <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, marginTop: '3px' }}>{m.change}</div>
                </div>
              ))}
            </div>

            {/* Module Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {activeRole.modules.map((mod, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    transition: 'all 0.2s',
                  }}
                  className="role-module-card-hover"
                >
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {getModuleIcon(mod.icon)}
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>{mod.title}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px', lineHeight: 1.4 }}>{mod.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Features List (right) */}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0B132B', marginBottom: '8px' }}>
              {activeRole.roleName} Dashboard
            </h3>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
              {activeRole.tagline}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeRole.modules.map((mod, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB', marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{mod.title}</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{mod.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .role-module-card-hover:hover { border-color: #BFDBFE !important; background-color: #EFF6FF !important; }
        @media (max-width: 900px) {
          .role-preview-grid { grid-template-columns: 1fr !important; }
          .role-tabs-bar { justify-content: flex-start !important; flex-wrap: nowrap !important; overflow-x: auto !important; padding-bottom: 10px; }
          .role-tabs-bar button { flex-shrink: 0; }
        }
      `}</style>
    </section>
  );
};
