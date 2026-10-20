import React, { useState } from 'react';
import { featureCategories } from '@/data/landing/features.data';
import { ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

interface FeatureExplorerProps {
  onSelectModule?: (name: string) => void;
}

export const FeatureExplorer: React.FC<FeatureExplorerProps> = ({ onSelectModule }) => {
  const [activeCategoryId, setActiveCategoryId] = useState('admissions');

  const activeCategory =
    featureCategories.find((c) => c.id === activeCategoryId) || featureCategories[0];

  return (
    <section
      id="modules"
      style={{
        paddingTop: '90px',
        paddingBottom: '90px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
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
            <Layers size={14} /> Comprehensive ERP Architecture
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 800,
              color: '#0B132B',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            Everything Your School Needs,{' '}
            <span className="gradient-text-orange" style={{ display: 'inline-block' }}>
              In One Powerful ERP
            </span>
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginTop: '12px' }}>
            Explore our comprehensive modules designed for modern educational institutions.
          </p>
        </div>

        {/* Category Tabs Container */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '40px',
          }}
          className="feature-tabs-bar"
        >
          {featureCategories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  backgroundColor: isActive ? '#2563EB' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#475569',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
                }}
                className="category-tab-hover"
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Responsive Cards Grid (4 per row on desktop) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
          className="feature-module-grid"
        >
          {activeCategory.modules.map((mod) => (
            <div
              key={mod.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
              }}
              className="module-card-hover"
            >
              <div>
                {/* Accent Icon Badge */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: `${mod.iconColor || '#2563EB'}15`,
                    color: mod.iconColor || '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <CheckCircle2 size={20} />
                </div>

                {/* Module Name */}
                <h3
                  style={{
                    fontSize: '16.5px',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {mod.name}
                </h3>

                {/* 1-Line Description */}
                <p
                  style={{
                    fontSize: '13.5px',
                    color: '#64748B',
                    lineHeight: 1.55,
                    marginBottom: '18px',
                  }}
                >
                  {mod.description}
                </p>
              </div>

              {/* Explore Link */}
              <button
                onClick={() => onSelectModule && onSelectModule(mod.name)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#2563EB',
                  padding: 0,
                  marginTop: 'auto',
                }}
                className="explore-link-hover"
              >
                <span>Explore</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .module-card-hover:hover {
          transform: translateY(-4px);
          border-color: #2563EB !important;
          box-shadow: 0 12px 24px -6px rgba(37, 99, 235, 0.12) !important;
        }
        .explore-link-hover:hover {
          color: #FF6B00 !important;
          gap: 9px !important;
        }
        @media (max-width: 1024px) {
          .feature-module-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .feature-module-grid {
            grid-template-columns: 1fr !important;
          }
          .feature-tabs-bar {
            justify-content: flex-start !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            padding-bottom: 10px;
          }
          .feature-tabs-bar button {
            flex-shrink: 0;
          }
        }
      `}</style>
    </section>
  );
};
