import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'white' | 'dark' | 'glass' | 'glass-dark' | 'outline';
  hoverEffect?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  borderRadius?: 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  hoverEffect = true,
  padding = 'md',
  borderRadius = 'xl',
  className = '',
  style,
  onClick,
}) => {
  const getBgStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'dark':
        return {
          background: 'var(--color-brand-navy-light)',
          border: '1px solid var(--color-brand-navy-border)',
          color: 'var(--text-white)',
        };
      case 'glass':
        return {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          boxShadow: 'var(--shadow-md)',
        };
      case 'glass-dark':
        return {
          background: 'rgba(21, 34, 68, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--text-white)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        };
      case 'outline':
        return {
          background: 'var(--bg-white)',
          border: '1px solid var(--border-light)',
        };
      case 'white':
      default:
        return {
          background: 'var(--bg-white)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
        };
    }
  };

  const getPaddingStyle = (): string => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return '16px';
      case 'lg':
        return '32px';
      case 'md':
      default:
        return '24px';
    }
  };

  const getRadiusStyle = (): string => {
    switch (borderRadius) {
      case 'md':
        return 'var(--radius-md)';
      case 'lg':
        return 'var(--radius-lg)';
      case '2xl':
        return 'var(--radius-2xl)';
      case 'xl':
      default:
        return 'var(--radius-xl)';
    }
  };

  return (
    <div
      className={`card-container ${hoverEffect ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
      style={{
        ...getBgStyle(),
        padding: getPaddingStyle(),
        borderRadius: getRadiusStyle(),
        transition: 'all var(--transition-normal)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
