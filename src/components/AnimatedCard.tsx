/**
 * Animated Card Component
 * Reusable card with hover effects, micro-interactions, and animations
 */

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'rotate';
  delay?: number;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hoverEffect = 'lift',
  delay = 0,
  onClick,
}) => {
  const hoverVariants = {
    lift: {
      y: -10,
      boxShadow: '0 20px 40px rgba(216, 255, 145, 0.2)',
    },
    glow: {
      boxShadow: '0 0 30px rgba(216, 255, 145, 0.4)',
    },
    scale: {
      scale: 1.05,
    },
    rotate: {
      rotate: 2,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={hoverVariants[hoverEffect]}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      viewport={{ once: true, margin: '-50px' }}
      onClick={onClick}
      className={`cursor-pointer transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};
