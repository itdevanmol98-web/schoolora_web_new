import React from 'react';
import { integrationsData } from '@/data/landing/integrations.data';
import { MessageSquare, Send, Mail, FileSpreadsheet, CreditCard, Fingerprint, Navigation, Video, Smartphone, Cloud, Link2, CheckCircle2 } from 'lucide-react';

export const Integrations: React.FC = () => {
  const getIcon = (iconType: string) => {
    const props = { size: 22 };
    switch (iconType) {
      case 'MessageSquare': return <MessageSquare {...props} />;
      case 'Send': return <Send {...props} />;
      case 'Mail': return <Mail {...props} />;
      case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      case 'Fingerprint': return <Fingerprint {...props} />;
      case 'Navigation': return <Navigation {...props} />;
      case 'Video': return <Video {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'Cloud': return <Cloud {...props} />;
      default: return <Link2 {...props} />;
    }
  };

  return (
    <section id="integrations" style={{ paddingTop: '90px', paddingBottom: '90px', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
            Connects With Your Existing Tools
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
            Easily integrate with the tools your school already uses — from communication to finance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="integrations-grid">
          {integrationsData.map((int) => (
            <div
              key={int.id}
              style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.25s', boxShadow: '0 2px 6px rgba(15,23,42,0.04)' }}
              className="integration-card-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${int.brandColor}15`, color: int.brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getIcon(int.iconType)}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: int.status === 'Connected' ? '#F0FDF4' : int.status === 'Verified' ? '#EFF6FF' : '#F8FAFC',
                  color: int.status === 'Connected' ? '#15803D' : int.status === 'Verified' ? '#1D4ED8' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <CheckCircle2 size={11} />
                  {int.status}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A' }}>{int.name}</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', fontWeight: 500 }}>{int.category}</div>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5 }}>{int.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .integration-card-hover:hover { transform: translateY(-3px); border-color: #BFDBFE !important; box-shadow: 0 10px 20px -6px rgba(37,99,235,0.1) !important; }
        @media (max-width: 1024px) { .integrations-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px) { .integrations-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .integrations-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};
