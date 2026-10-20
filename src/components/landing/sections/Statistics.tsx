import React from 'react';
import { statisticsData } from '@/data/landing/statistics.data';
import { Building, LayoutGrid, GraduationCap, Users, Headphones } from 'lucide-react';

export const Statistics: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building':
        return <Building size={24} color="#00B4D8" />;
      case 'LayoutGrid':
        return <LayoutGrid size={24} color="#38BDF8" />;
      case 'GraduationCap':
        return <GraduationCap size={24} color="#FF8533" />;
      case 'Users':
        return <Users size={24} color="#60A5FA" />;
      case 'Headphones':
      default:
        return <Headphones size={24} color="#34D399" />;
    }
  };

  return (
    <section
      id="features"
      style={{
        backgroundColor: '#0B132B',
        paddingTop: '80px',
        paddingBottom: '80px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.15) 0%, rgba(11, 19, 43, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px auto' }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 3.8vw, 38px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
            }}
          >
            One Platform. Every School Operation.
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#94A3B8',
              marginTop: '8px',
              fontWeight: 400,
            }}
          >
            Simplify. Automate. Empower Education.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '18px',
          }}
          className="statistics-grid"
        >
          {statisticsData.map((stat) => (
            <div
              key={stat.id}
              style={{
                backgroundColor: '#152244',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '28px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.25s',
              }}
              className="stat-card-hover"
            >
              {/* Icon Container */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                {getIcon(stat.iconName)}
              </div>

              {/* Big Number */}
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(28px, 3vw, 36px)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>

              {/* Title / Label */}
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#38BDF8',
                  marginBottom: '6px',
                }}
              >
                {stat.label}
              </div>

              {/* Small description */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#94A3B8',
                  lineHeight: 1.4,
                }}
              >
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stat-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 180, 216, 0.4) !important;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4) !important;
        }
        @media (max-width: 1024px) {
          .statistics-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .statistics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};
