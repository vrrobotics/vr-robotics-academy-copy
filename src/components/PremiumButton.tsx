import React from 'react';
import { motion } from 'framer-motion';

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'font-heading font-semibold rounded-lg transition-all';

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:shadow-lg',
    secondary: 'bg-secondary text-secondary-foreground hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        boxShadow:
          variant === 'primary'
            ? '0 0 20px rgba(255, 140, 66, 0.3)'
            : variant === 'secondary'
              ? '0 0 20px rgba(255, 179, 102, 0.3)'
              : 'none',
      }}
    >
      {children}
    </motion.button>
  );
};
