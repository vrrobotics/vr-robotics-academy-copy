import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

interface FloatingRobotMascotProps {
  className?: string;
  showOnPages?: string[];
}

export const FloatingRobotMascot: React.FC<FloatingRobotMascotProps> = ({
  className = '',
  showOnPages = ['/', '/curriculum', '/why-vr-robotics'],
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const currentPath = window.location.pathname;
    setIsVisible(showOnPages.includes(currentPath));
  }, [showOnPages]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed bottom-8 right-8 z-40 ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Floating container */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-orange-500 blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Robot mascot */}
        <motion.div
          className="relative w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer border-2 border-orange-300"
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 40px rgba(255, 140, 66, 0.6)',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Robot face */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-3 mb-2">
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  delay: 0.1,
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Mouth */}
            <div className="w-4 h-1 bg-white rounded-full" />

            {/* CPU icon */}
            <Cpu className="w-8 h-8 text-white mt-2 opacity-80" />
          </div>
        </motion.div>

        {/* Floating particles around mascot */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full"
            animate={{
              x: [0, Math.cos((i / 3) * Math.PI * 2) * 40, 0],
              y: [0, Math.sin((i / 3) * Math.PI * 2) * 40, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full right-0 mb-4 bg-background border border-orange-500 rounded-lg px-3 py-2 text-sm text-foreground whitespace-nowrap opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        Your Robotics Guide
      </motion.div>
    </motion.div>
  );
};
