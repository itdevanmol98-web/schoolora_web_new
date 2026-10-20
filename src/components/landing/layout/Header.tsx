import React, { useState, useEffect } from 'react';
import { AxionexaLogo } from '@/assets/logo/AxionexaLogo';
import { navigationLinks } from '@/data/landing/navigation.data';
import {
  ChevronDown,
  Menu,
  X,
  Search,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';

export interface HeaderProps {
  onOpenDemoModal: () => void;
  onOpenLoginModal: () => void;
  onOpenSearchModal: () => void;
  isLoggedIn?: boolean;
  onNavigateToDashboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDemoModal,
  onOpenLoginModal,
  onOpenSearchModal,
  isLoggedIn = false,
  onNavigateToDashboard,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: isScrolled ? '1px solid #E2E8F0' : '1px solid #F1F5F9',
          boxShadow: isScrolled
            ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)'
            : '0 1px 2px rgba(0,0,0,0.02)',
          transition: 'all 0.25s ease-in-out',
          height: 'var(--header-height, 76px)',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          {/* Brand Logo with Official User Provided Image */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            title="AXIONEXA ERP Home"
          >
            <AxionexaLogo size="md" showTagline={true} />
          </a>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flexWrap: 'nowrap',
            }}
            className="desktop-nav"
          >
            {navigationLinks.map((link) => (
              <div
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
              >
                <a
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '6px 9px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: link.badge ? '#2563EB' : '#1E293B',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #00B4D8 0%, #2563EB 100%)',
                        color: '#FFFFFF',
                        fontSize: '9.5px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        marginLeft: '2px',
                        lineHeight: 1.2,
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                  {link.hasDropdown && (
                    <ChevronDown
                      size={13}
                      style={{
                        transition: 'transform 0.2s',
                        transform: activeDropdown === link.label ? 'rotate(180deg)' : 'none',
                        color: '#64748B',
                      }}
                    />
                  )}
                </a>

                {/* Dropdown Menu */}
                {link.hasDropdown && activeDropdown === link.label && link.dropdownItems && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: link.label === 'Modules' ? '-80px' : '0px',
                      width: link.label === 'Modules' ? '460px' : '280px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '14px',
                      boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.18)',
                      border: '1px solid #E2E8F0',
                      display: 'grid',
                      gridTemplateColumns: link.label === 'Modules' ? '1fr 1fr' : '1fr',
                      gap: '6px',
                      zIndex: 1050,
                    }}
                  >
                    {link.dropdownItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        style={{
                          display: 'block',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          transition: 'background 0.2s',
                          color: '#0F172A',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                          {item.title}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            {item.description}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {/* Search Icon */}
            <button
              onClick={onOpenSearchModal}
              title="Search ERP modules and features"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
                e.currentTarget.style.borderColor = '#BFDBFE';
                e.currentTarget.style.color = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <Search size={16} />
            </button>

            {/* Dashboard / Login Button */}
            {isLoggedIn && onNavigateToDashboard ? (
              <button
                onClick={onNavigateToDashboard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 15px',
                  borderRadius: '9px',
                  border: '1.5px solid #2563EB',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)',
                }}
                title="Go to ERP Dashboard"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                style={{
                  padding: '7px 15px',
                  borderRadius: '9px',
                  border: '1.5px solid #2563EB',
                  backgroundColor: '#FFFFFF',
                  color: '#2563EB',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#2563EB';
                }}
              >
                Sign In
              </button>
            )}

            {/* Book a Demo Button */}
            <button
              onClick={onOpenDemoModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9px',
                backgroundColor: '#FF6B00',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FA541C 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13.5px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
              }}
            >
              <span>Book a Demo</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                background: '#F1F5F9',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height, 76px)',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 999,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 20px 30px rgba(0,0,0,0.1)',
          }}
        >
          {/* Quick Search Bar inside Mobile Drawer */}
          <div style={{ marginBottom: '8px' }}>
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearchModal();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '10px',
                color: '#64748B',
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              <Search size={16} />
              <span>Search modules, features...</span>
            </div>
          </div>

          {navigationLinks.map((link) => (
            <div key={link.label} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              <a
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                }}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #00B4D8 0%, #2563EB 100%)',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </a>
              {link.dropdownItems && (
                <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {link.dropdownItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ fontSize: '13px', color: '#64748B', padding: '4px 0' }}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {isLoggedIn && onNavigateToDashboard ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToDashboard();
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <LayoutDashboard size={18} /> Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #2563EB',
                  color: '#2563EB',
                  fontWeight: 700,
                  fontSize: '15px',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                }}
              >
                Sign In to Portal
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FA541C 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Book a Free Demo <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
