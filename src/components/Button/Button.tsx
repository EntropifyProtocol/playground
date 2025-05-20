import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick,
  className = '',
  disabled = false
}: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors font-[var(--font-inter)]';
  
  const variantClasses = {
    primary: 'text-white hover:bg-opacity-90',
    secondary: 'bg-white text-[var(--color-neutral)] border border-[var(--color-neutral)] hover:bg-gray-100'
  };
  
  // Use CSS variables for colors
  const bgColors = {
    primary: 'bg-[var(--color-primary)]',
    secondary: 'bg-white'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button 
      className={`${baseClasses} ${bgColors[variant]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
