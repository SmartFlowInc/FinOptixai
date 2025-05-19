import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default' 
}) => {
  // Size mapping
  const sizeMap = {
    sm: {
      container: 'h-8 w-8',
      text: 'text-sm',
      fullText: 'text-lg'
    },
    md: {
      container: 'h-10 w-10',
      text: 'text-base',
      fullText: 'text-xl'
    },
    lg: {
      container: 'h-12 w-12',
      text: 'text-lg',
      fullText: 'text-2xl'
    }
  };

  // Inspired by Abacum's logo (blue square with an icon)
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold ${sizeMap[size].container}`}>
        <span className={sizeMap[size].text}>FO</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold ${sizeMap[size].container}`}>
        <span className={sizeMap[size].text}>FO</span>
      </div>
      <span className={`font-bold ${sizeMap[size].fullText}`}>FinOptix</span>
    </div>
  );
};

export default Logo;