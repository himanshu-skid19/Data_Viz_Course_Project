import React from 'react';

interface IconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

export const ChevronLeftIcon: React.FC<IconProps> = ({ 
  className = 'w-6 h-6', 
  'aria-hidden': ariaHidden = true 
}) => {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M15 19l-7-7 7-7" 
      />
    </svg>
  );
};

export const ChevronRightIcon: React.FC<IconProps> = ({ 
  className = 'w-6 h-6', 
  'aria-hidden': ariaHidden = true 
}) => {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 5l7 7-7 7" 
      />
    </svg>
  );
};