import React from 'react';
import { motion } from 'framer-motion';

interface FuturisticTitleProps {
  children: string;
  className?: string;
  delay?: number;
}

export const FuturisticTitle: React.FC<FuturisticTitleProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const letters = children.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  } as const;

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: '1000px' }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          style={{
            textShadow: '0 0 20px rgba(255, 140, 66, 0.5)',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};
