/**
 * Glowing Element Component
 * Creates glowing/pulsing effects for UI elements
 */

import React from 'react';
import { motion } from 'framer-motion';

interface GlowingElementProps {
  children: React.ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  className?: string;
}

export const GlowingElement: React.FC<GlowingElementProps> = ({
  children,
  color = 'rgba(255, 140, 66, 0.5)',
  intensity = 'medium',
  duration = 2,
  className = '',
}) => {
  const intensityMap = {
    low: { from: 0.2, to: 0.4 },
    medium: { from: 0.3, to: 0.6 },
    high: { from: 0.5, to: 0.8 },
  };

  const { from, to } = intensityMap[intensity];

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 20px ${color}`,
          `0 0 40px ${color}`,
          `0 0 20px ${color}`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
