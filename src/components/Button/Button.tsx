import React, { useState } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  icon,
  iconPosition = 'left'
}: ButtonProps) => {
  // State for click animation
  const [isPressed, setIsPressed] = useState(false);
  
  // Handle mouse down and up for click animation
  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };
  
  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };
  
  // Base classes for all buttons
  const baseClasses = 'relative overflow-hidden font-medium rounded-md transition-all duration-300 font-[var(--font-inter)] flex items-center justify-center';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant specific classes
  const variantClasses = {
    primary: 'text-white shadow-sm hover:shadow-md active:shadow-inner',
    secondary: 'bg-white text-[var(--color-neutral)] border border-[var(--color-neutral)] hover:bg-gray-100 active:bg-gray-200 shadow-sm hover:shadow',
    gradient: 'text-white shadow-md hover:shadow-lg active:shadow-inner bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    outline: 'bg-transparent border border-current text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:bg-opacity-10 active:bg-opacity-20'
  };
  
  // Background colors
  const bgColors = {
    primary: 'bg-[var(--color-primary)]',
    secondary: 'bg-white',
    gradient: '',  // Gradient is handled in variantClasses
    outline: 'bg-transparent'
  };

  // Hover effect classes
  const hoverClasses = {
    primary: 'hover:bg-opacity-90',
    secondary: 'hover:bg-gray-50',
    gradient: 'hover:opacity-95',
    outline: 'hover:bg-opacity-10'
  };
  
  // Active effect classes
  const activeClasses = {
    primary: 'active:bg-opacity-100',
    secondary: 'active:bg-gray-100',
    gradient: 'active:opacity-100',
    outline: 'active:bg-opacity-20'
  };

  // Disabled state - more visible styling
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none bg-opacity-75 grayscale' : '';
  
  // Ripple effect style for pressed state
  const pressedStyle = isPressed ? {
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)'
  } : {};
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${bgColors[variant]} ${variantClasses[variant]} ${hoverClasses[variant]} ${activeClasses[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={pressedStyle}
    >
      {/* Ripple effect overlay */}
      {isPressed && (
        <span className="absolute inset-0 bg-black bg-opacity-10 animate-ripple"></span>
      )}
      
      {/* Button content with icon */}
      <span className="relative flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && <span className="transition-transform group-hover:scale-110">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="transition-transform group-hover:scale-110">{icon}</span>}
      </span>
    </button>
  );
};

export default Button;
