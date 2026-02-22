/**
 * Parallax Section Component
 * Creates parallax scrolling effects for depth and visual interest
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  offset = 50,
  className = '',
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        y: scrollY * 0.5,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
