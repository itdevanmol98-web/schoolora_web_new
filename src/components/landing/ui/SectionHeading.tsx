import React from 'react';
import { Badge } from './Badge';

export interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: 'blue' | 'orange' | 'cyan' | 'green';
  badgeIcon?: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeVariant = 'blue',
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';
  const isCenter = align === 'center';

  return (
    <div
      className={`section-heading ${className}`}
      style={{
        textAlign: align,
        maxWidth: isCenter ? '820px' : '650px',
        margin: isCenter ? '0 auto 48px auto' : '0 0 40px 0',
      }}
    >
      {badge && (
        <div style={{ marginBottom: '14px' }}>
          <Badge variant={badgeVariant} icon={badgeIcon}>
            {badge}
          </Badge>
        </div>
      )}

      <h2
        style={{
          fontSize: 'clamp(28px, 4vw, 38px)',
          fontWeight: 800,
          color: isDark ? 'var(--text-white)' : 'var(--text-main)',
          lineHeight: 1.22,
          marginBottom: subtitle ? '14px' : '0',
          letterSpacing: '-0.025em',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: isDark ? 'var(--text-white-muted)' : 'var(--text-body)',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
