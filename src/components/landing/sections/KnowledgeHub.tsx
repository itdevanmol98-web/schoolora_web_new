import React from 'react';
import { knowledgeArticles } from '@/data/landing/knowledgeHub.data';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';

export const KnowledgeHub: React.FC = () => (
  <section id="knowledge-hub" style={{ paddingTop: '90px', paddingBottom: '90px', backgroundColor: '#F8FAFC' }}>
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12.5px', fontWeight: 700, marginBottom: '10px' }}>
            <BookOpen size={13} /> Knowledge Hub
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.025em' }}>
            From Our Knowledge Hub
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>
            Insights, guides and updates for the modern school leader.
          </p>
        </div>
        <a href="#resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14.5px', fontWeight: 700, color: '#2563EB', padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #BFDBFE', backgroundColor: '#EFF6FF', transition: 'all 0.2s' }} className="view-all-btn">
          View All Articles <ArrowRight size={15} />
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="knowledge-grid">
        {knowledgeArticles.map((art) => (
          <div
            key={art.id}
            style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', transition: 'all 0.25s', boxShadow: '0 2px 8px -2px rgba(15,23,42,0.05)' }}
            className="article-card-hover"
          >
            {/* Article Image */}
            <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={art.imageUrl}
                alt={art.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                className="article-img"
              />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  backgroundColor: art.badgeColor === 'blue' ? '#EFF6FF' : art.badgeColor === 'cyan' ? '#E0F2FE' : '#FFF7ED',
                  color: art.badgeColor === 'blue' ? '#1D4ED8' : art.badgeColor === 'cyan' ? '#0284C7' : '#EA580C',
                  backdropFilter: 'blur(4px)',
                }}>
                  {art.category}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '10px', lineHeight: 1.4 }}>
                {art.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
                {art.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
                  <Clock size={13} />
                  {art.readTime} · {art.publishedDate}
                </div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 700, color: '#2563EB', padding: 0 }} className="read-more-hover">
                  Read More <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      .article-card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -6px rgba(15,23,42,0.1) !important; border-color: #CBD5E1 !important; }
      .article-card-hover:hover .article-img { transform: scale(1.06); }
      .read-more-hover:hover { color: #FF6B00 !important; }
      .view-all-btn:hover { background-color: #2563EB !important; color: #FFFFFF !important; }
      @media (max-width: 900px) { .knowledge-grid { grid-template-columns: 1fr !important; } }
    `}</style>
  </section>
);
