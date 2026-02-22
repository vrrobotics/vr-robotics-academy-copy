/**
 * Mouse Follower Component
 * Creates interactive mouse-following effects for enhanced interactivity
 */

import React, { useEffect, useRef } from 'react';

interface MouseFollowerProps {
  className?: string;
  size?: number;
  color?: string;
}

export const MouseFollower: React.FC<MouseFollowerProps> = ({
  className = '',
  size = 30,
  color = 'rgba(216, 255, 145, 0.3)',
}) => {
  const followerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const followerX = useRef(0);
  const followerY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop for smooth following
    const animate = () => {
      if (followerRef.current) {
        followerX.current += (mouseX.current - followerX.current) * 0.2;
        followerY.current += (mouseY.current - followerY.current) * 0.2;

        followerRef.current.style.left = `${followerX.current - size / 2}px`;
        followerRef.current.style.top = `${followerY.current - size / 2}px`;
      }
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  return (
    <div
      ref={followerRef}
      className={`fixed pointer-events-none rounded-full blur-xl transition-all duration-300 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        zIndex: 1,
      }}
    />
  );
};
