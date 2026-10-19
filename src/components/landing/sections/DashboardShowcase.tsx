import React, { useState } from 'react';
import { dashboardTabs } from '@/data/landing/dashboards.data';
import { LayoutDashboard, TrendingUp, Clock, CreditCard, Users, CheckCircle2, CalendarDays } from 'lucide-react';

export const DashboardShowcase: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState('admin');
  const activeTab = dashboardTabs.find((t) => t.id === activeTabId) || dashboardTabs[0];

  const activityIcon = (type: string) => {
    switch (type) {
      case 'fee': return <CreditCard size={14} color="#10B981" />;
      case 'admission': return <Users size={14} color="#2563EB" />;
      case 'academic': return <TrendingUp size={14} color="#FF6B00" />;
      case 'leave': return <Clock size={14} color="#F59E0B" />;
      default: return <CheckCircle2 size={14} color="#64748B" />;
    }
  };

  return (
    <section
      id="dashboard"
      style={{ paddingTop: '90px', paddingBottom: '90px', backgroundColor: '#F8FAFC' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12.5px', fontWeight: 700, marginBottom: '14px' }}>
            <LayoutDashboard size={14} /> Live ERP Dashboard Preview
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
            See Your School at a Glance
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
            Powerful dashboards for every role.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '32px' }} className="db-tabs-bar">
          {dashboardTabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: isActive ? '#0B132B' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: isActive ? '1px solid #0B132B' : '1px solid #E2E8F0',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 14px rgba(11,19,43,0.2)' : 'none',
                }}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Browser Framed Dashboard */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #CBD5E1', boxShadow: '0 20px 60px -15px rgba(15,23,42,0.14)', overflow: 'hidden' }}>
          {/* Browser Bar */}
          <div style={{ backgroundColor: '#0B132B', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', color: '#94A3B8' }}>
              app.axionexa.com / {activeTabId}-dashboard
            </div>
            <span style={{ fontSize: '11px', color: '#00B4D8', fontWeight: 600 }}>● LIVE</span>
          </div>

          {/* Dashboard Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: '420px' }} className="db-body-grid">
            {/* Main Content Area */}
            <div style={{ padding: '24px', borderRight: '1px solid #F1F5F9' }}>
              {/* Welcome Banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                    Welcome back, Admin! 👋
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>Academic Year 2025–26 • {activeTab.badge}</div>
                </div>
                <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                  {activeTab.badge}
                </span>
              </div>

              {/* 4 Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }} className="db-stat-mini-grid">
                {activeTab.stats.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#FAFAFA',
                      border: '1px solid #F1F5F9',
                      borderRadius: '14px',
                      padding: '16px 14px',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>{s.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{s.sublabel}</div>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }} className="db-chart-mini-grid">
                <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #F1F5F9', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>{activeTab.chartTitle}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                    {[82, 88, 94, 91, 96, 93, 89].map((v, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: `${v}%`, backgroundColor: i === 6 ? '#00B4D8' : '#2563EB', borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
                        <span style={{ fontSize: '9px', color: '#94A3B8', marginTop: '3px' }}>
                          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #F1F5F9', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', width: '100%', marginBottom: '8px' }}>{activeTab.donutTitle}</div>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#10B981 0% 62%, #00B4D8 62% 82%, #FF6B00 82% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>88%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Upcoming Events */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarDays size={15} color="#2563EB" /> Upcoming Events
                </div>
                {activeTab.upcomingEvents.map((ev, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #F1F5F9', backgroundColor: '#FAFAFA', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>{ev.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{ev.date}</span>
                      <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{ev.tag}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activities */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                  Recent Activities
                </div>
                {activeTab.recentActivities.slice(0, 3).map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {activityIcon(act.type)}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>{act.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{act.detail}</div>
                      <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .db-body-grid { grid-template-columns: 1fr !important; }
          .db-stat-mini-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .db-chart-mini-grid { grid-template-columns: 1fr !important; }
          .db-tabs-bar { justify-content: flex-start !important; flex-wrap: nowrap !important; overflow-x: auto !important; padding-bottom: 10px; }
        }
        @media (max-width: 480px) {
          .db-stat-mini-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};
