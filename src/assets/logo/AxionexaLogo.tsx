import React from 'react';
import logoImg from './axionexa-logo.png';

export interface AxionexaLogoProps {
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  showCompanySubtitle?: boolean;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export const AxionexaLogo: React.FC<AxionexaLogoProps> = ({
  size = 'md',
  className = '',
  style,
}) => {
  // Height adjustments according to size
  const heightMap = {
    sm: 36,
    md: 46,
    lg: 56,
    xl: 68,
  };

  const height = heightMap[size] || 46;

  return (
    <div
      className={`axionexa-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        ...style,
      }}
    >
      <img
        src={logoImg}
        alt="AXIONEXA TECHNOLOGIES PVT. LTD. - Empowering Education. Enabling Excellence."
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
        loading="eager"
      />
    </div>
  );
};

export default AxionexaLogo;
