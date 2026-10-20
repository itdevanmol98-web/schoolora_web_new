import React, { useState } from 'react';
import { pricingTiersMonthly, pricingTiersYearly } from '@/data/landing/pricing.data';
import { CheckCircle2, Zap, Star } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const tiers = billing === 'monthly' ? pricingTiersMonthly : pricingTiersYearly;

  return (
    <section id="pricing" style={{ paddingTop: '90px', paddingBottom: '90px', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '10px' }}>
            Choose a plan that fits your school's requirements.
          </p>
          {/* Monthly / Yearly Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', backgroundColor: '#F1F5F9', borderRadius: '12px', padding: '4px', marginTop: '24px' }}>
            {(['monthly', 'yearly'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '8px 22px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: billing === b ? '#FFFFFF' : 'transparent',
                  color: billing === b ? '#0F172A' : '#64748B',
                  boxShadow: billing === b ? '0 2px 8px rgba(15,23,42,0.1)' : 'none',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {b}{b === 'yearly' && <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 6px', borderRadius: '4px' }}>2 MONTHS FREE</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' }} className="pricing-grid">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                backgroundColor: tier.isPopular ? '#0B132B' : '#FFFFFF',
                borderRadius: '24px',
                border: tier.isPopular ? '2px solid #2563EB' : '1px solid #E2E8F0',
                padding: '32px 28px',
                position: 'relative',
                boxShadow: tier.isPopular ? '0 20px 48px -10px rgba(11,19,43,0.3)' : '0 2px 8px rgba(15,23,42,0.04)',
                transition: 'all 0.25s',
              }}
              className="pricing-card-hover"
            >
              {tier.isPopular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FF6B00', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, padding: '4px 16px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Star size={12} fill="#FFFFFF" /> Most Popular
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: tier.isPopular ? '#FFFFFF' : '#0F172A', marginBottom: '4px' }}>
                  {tier.name}
                </div>
                <div style={{ fontSize: '13px', color: tier.isPopular ? '#94A3B8' : '#64748B' }}>{tier.subtitle}</div>
              </div>

              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: tier.isPopular ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: tier.isPopular ? '#00B4D8' : '#0F172A' }}>
                  {tier.priceDisplay}
                </div>
                <div style={{ fontSize: '12.5px', color: tier.isPopular ? '#64748B' : '#94A3B8', marginTop: '4px' }}>{tier.priceNote}</div>
              </div>

              {/* Spec Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {Object.values(tier.specs).map((spec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: tier.isPopular ? '#CBD5E1' : '#475569' }}>
                    <CheckCircle2 size={15} color={tier.isPopular ? '#00B4D8' : '#10B981'} style={{ flexShrink: 0 }} />
                    {spec}
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: tier.isPopular ? '#FF6B00' : '#F1F5F9',
                  color: tier.isPopular ? '#FFFFFF' : '#0F172A',
                  border: 'none',
                  boxShadow: tier.isPopular ? '0 4px 14px rgba(255,107,0,0.35)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                className={tier.isPopular ? 'pricing-cta-popular' : 'pricing-cta-default'}
              >
                {tier.isPopular && <Zap size={16} />}
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pricing-card-hover:hover { transform: translateY(-4px); }
        .pricing-cta-popular:hover { background-color: #E05300 !important; }
        .pricing-cta-default:hover { background-color: #E2E8F0 !important; }
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};
