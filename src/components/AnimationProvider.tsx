/**
 * Global Animation Provider
 * Manages page transitions, mouse interactions, and global animation effects
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimationContextType {
  isPageTransitioning: boolean;
  mousePosition: { x: number; y: number };
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <AnimationContext.Provider value={{ isPageTransitioning, mousePosition }}>
      {children}
    </AnimationContext.Provider>
  );
};
