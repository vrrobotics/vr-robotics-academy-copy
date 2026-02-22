/**
 * Premium Minimal Animated Background Component
 * Creates a subtle, high-end futuristic background with glowing particles and ultra-light circuit lines
 * Designed to be immersive yet non-distracting
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'hero' | 'dashboard';
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'default',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circuitCanvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle particle animation with minimal glow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      maxOpacity: number;
      pulsePhase: number;
    }

    const particles: Particle[] = [];
    // Reduced particle count for minimal effect
    const particleCount = variant === 'hero' ? 40 : 25;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.3,
        // Much slower movement
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        opacity: 0,
        // Lower max opacity for subtlety
        maxOpacity: Math.random() * 0.25 + 0.08,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005; // Slower animation

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulsePhase += 0.008; // Slower pulse

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Subtle pulsing opacity
        particle.opacity = particle.maxOpacity * (0.4 + 0.6 * Math.sin(particle.pulsePhase));

        // Draw subtle outer glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2.5
        );
        glowGradient.addColorStop(0, `rgba(255, 140, 66, ${particle.opacity * 0.4})`);
        glowGradient.addColorStop(0.6, `rgba(255, 140, 66, ${particle.opacity * 0.1})`);
        glowGradient.addColorStop(1, `rgba(255, 140, 66, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw minimal core particle
        ctx.fillStyle = `rgba(255, 140, 66, ${particle.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [variant]);

  // Ultra-light circuit lines animation (2% opacity)
  useEffect(() => {
    const canvas = circuitCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface CircuitLine {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
      speed: number;
      phase: number;
    }

    const lines: CircuitLine[] = [];
    // Fewer lines for minimal effect
    const lineCount = variant === 'hero' ? 10 : 6;

    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        opacity: 0.02,
        speed: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005; // Slower animation

      lines.forEach((line) => {
        // Very subtle opacity variation (stays around 2%)
        line.opacity = (Math.sin(time * line.speed + line.phase) + 1) * 0.01 + 0.015;

        // Draw ultra-light line
        ctx.strokeStyle = `rgba(255, 140, 66, ${line.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();

        // Draw minimal connection nodes
        const nodeGradient = ctx.createRadialGradient(line.x1, line.y1, 0, line.x1, line.y1, 2);
        nodeGradient.addColorStop(0, `rgba(255, 140, 66, ${line.opacity * 0.8})`);
        nodeGradient.addColorStop(1, `rgba(255, 140, 66, 0)`);

        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(line.x1, line.y1, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(line.x2, line.y2, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [variant]);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {/* Ultra-light circuit lines canvas (2% opacity) */}
      <canvas
        ref={circuitCanvasRef}
        className="absolute inset-0 opacity-20"
      />

      {/* Subtle particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-60"
      />

      {/* Soft dark-to-darker gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#0A0A0A] to-[#050505]" />

      {/* Minimal animated gradient blobs for depth */}
      <motion.div
        className="absolute top-0 left-1/3 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/3 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-4"
        animate={{
          x: [0, -60, 30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      {/* Very subtle center blob for immersion */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-2"
        animate={{
          x: [0, 80, -80, 0],
          y: [0, -80, 80, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 6,
        }}
      />
    </div>
  );
};
