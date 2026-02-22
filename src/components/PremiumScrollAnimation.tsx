import React from 'react';
import { motion } from 'framer-motion';
import { premiumAnimations } from '@/lib/premium-animations';

interface PremiumScrollAnimationProps {
  children: React.ReactNode;
  variant?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
  className?: string;
  viewport?: { once?: boolean; amount?: number | 'some' | 'all' };
}

export const PremiumScrollAnimation: React.FC<PremiumScrollAnimationProps> = ({
  children,
  variant = 'fadeInUp',
  delay = 0,
  className = '',
  viewport = { once: true, amount: 0.3 },
}) => {
  const animation = premiumAnimations[variant];

  return (
    <motion.div
      initial={animation.initial}
      whileInView={animation.whileInView}
      transition={{
        ...animation.transition,
        delay,
      }}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
};
