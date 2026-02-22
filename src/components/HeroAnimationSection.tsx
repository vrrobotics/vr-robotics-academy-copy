/**
 * Hero Animation Section Component
 * Enhanced hero section with advanced animations and 3D effects
 */

import React from 'react';
import { motion } from 'framer-motion';

interface HeroAnimationSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const HeroAnimationSection: React.FC<HeroAnimationSectionProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  } as const;

  const titleVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  } as const;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Title with advanced animation */}
      <motion.h1
        className="font-heading text-6xl md:text-7xl font-bold text-primary mb-4"
        variants={titleVariants}
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="font-paragraph text-xl md:text-2xl text-foreground mb-8 max-w-2xl"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Children with staggered animation */}
      <motion.div variants={itemVariants}>
        {children}
      </motion.div>

      {/* Floating accent elements */}
      <motion.div
        className="absolute top-20 right-20 w-20 h-20 border-2 border-primary rounded-lg opacity-20"
        animate={{
          rotate: 360,
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-16 h-16 border-2 border-secondary rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [-360, 0],
        }}
        transition={{
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
        }}
      />
    </motion.div>
  );
};
