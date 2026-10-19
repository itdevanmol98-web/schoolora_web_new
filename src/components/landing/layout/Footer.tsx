import React from 'react';
import { AxionexaLogo } from '@/assets/logo/AxionexaLogo';
import { footerNavigation } from '@/data/landing/navigation.data';
import {
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Shield,
} from 'lucide-react';

const LinkedinIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0B132B',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '80px',
        paddingBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 180, 216, 0.08) 0%, rgba(11, 19, 43, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.06) 0%, rgba(11, 19, 43, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.2fr',
            gap: '40px',
            marginBottom: '60px',
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '8px 14px', borderRadius: '12px', display: 'inline-block' }}>
              <AxionexaLogo size="md" showTagline={true} />
            </div>
            <p
              style={{
                color: '#94A3B8',
                fontSize: '14px',
                lineHeight: 1.6,
                marginBottom: '24px',
                maxWidth: '320px',
              }}
            >
              Enterprise-grade, AI-powered School Management Platform empowering educational institutions with seamless multi-tenant administration, academics, and operations.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: <LinkedinIcon />, label: 'LinkedIn', href: 'https://linkedin.com' },
                { icon: <FacebookIcon />, label: 'Facebook', href: 'https://facebook.com' },
                { icon: <InstagramIcon />, label: 'Instagram', href: 'https://instagram.com' },
                { icon: <YoutubeIcon />, label: 'YouTube', href: 'https://youtube.com' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#CBD5E1';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '18px',
                letterSpacing: '0.02em',
              }}
            >
              Modules & ERP
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {footerNavigation.products.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    style={{
                      fontSize: '13.5px',
                      color: '#94A3B8',
                      transition: 'color 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00B4D8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '18px',
                letterSpacing: '0.02em',
              }}
            >
              Ecosystem
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {footerNavigation.solutions.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    style={{
                      fontSize: '13.5px',
                      color: '#94A3B8',
                      transition: 'color 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00B4D8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '18px',
                letterSpacing: '0.02em',
              }}
            >
              Support & Help
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {footerNavigation.support.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    style={{
                      fontSize: '13.5px',
                      color: '#94A3B8',
                      transition: 'color 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00B4D8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '18px',
                letterSpacing: '0.02em',
              }}
            >
              Corporate Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', color: '#94A3B8' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={17} color="#00B4D8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Axionexa Technologies Pvt. Ltd., Knowledge Park, Sector 62, Noida, NCR, India</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={17} color="#00B4D8" style={{ flexShrink: 0 }} />
                <a
                  href="tel:+919876543210"
                  style={{ color: '#E2E8F0', fontWeight: 500 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
                >
                  +91 98765 43210 / +91 87654 32109
                </a>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={17} color="#00B4D8" style={{ flexShrink: 0 }} />
                <a
                  href="mailto:contact@axionexa.com"
                  style={{ color: '#E2E8F0', fontWeight: 500 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
                >
                  contact@axionexa.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: '#64748B',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} AXIONEXA TECHNOLOGIES PVT. LTD. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="#security" style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} color="#10B981" /> ISO 27001 Certified
            </a>
            <a href="#privacy" style={{ color: '#94A3B8' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#94A3B8' }}>Terms of Service</a>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ color: '#00B4D8', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              Back to top <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
