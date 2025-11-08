import React from 'react';

interface CodeXonXLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CodeXonXLogo: React.FC<CodeXonXLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        className={`${sizeClasses[size]} text-primary`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="6" fill="currentColor" fillOpacity="0.1" />
        <path d="M10 22V10L22 16L10 22Z" fill="currentColor" className="text-primary" />
        <path d="M10 22V10L22 16L10 22Z" fill="url(#paint0_linear_1_2)" fillOpacity="0.2" />
        <defs>
          <linearGradient
            id="paint0_linear_1_2"
            x1="10"
            y1="16"
            x2="22"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`ml-2 font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent ${
          size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-3xl'
        }`}
      >
        CodeXonX
      </span>
    </div>
  );
};
