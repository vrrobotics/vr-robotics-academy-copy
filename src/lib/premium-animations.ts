// Premium animation configurations for 10/10 professional grade
export const premiumAnimations = {
  // Scroll animations
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },
  
  // Hover animations
  hoverLift: {
    whileHover: { y: -8, transition: { duration: 0.3 } }
  },
  hoverGlow: {
    whileHover: { 
      boxShadow: '0 0 30px rgba(255, 140, 66, 0.4)',
      transition: { duration: 0.3 }
    }
  },
  hoverScale: {
    whileHover: { scale: 1.05, transition: { duration: 0.3 } }
  },
  
  // Stagger animations
  staggerContainer: {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true },
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
  },
  staggerItem: {
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    },
  },

  // Floating animations
  float: {
    animate: { y: [0, -15, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  },
  floatSlow: {
    animate: { y: [0, -20, 0] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  },

  // Pulse animations
  pulse: {
    animate: { opacity: [1, 0.7, 1] },
    transition: { duration: 2, repeat: Infinity }
  },
  pulseScale: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity }
  },

  // Rotate animations
  rotate: {
    animate: { rotate: 360 },
    transition: { duration: 20, repeat: Infinity, ease: "linear" }
  },
  rotateSlow: {
    animate: { rotate: 360 },
    transition: { duration: 30, repeat: Infinity, ease: "linear" }
  },

  // Shimmer effect
  shimmer: {
    animate: { backgroundPosition: ["0% 0%", "100% 0%"] },
    transition: { duration: 3, repeat: Infinity }
  },

  // Glow pulse
  glowPulse: {
    animate: { 
      boxShadow: [
        "0 0 20px rgba(255, 140, 66, 0.3)",
        "0 0 40px rgba(255, 140, 66, 0.6)",
        "0 0 20px rgba(255, 140, 66, 0.3)"
      ]
    },
    transition: { duration: 3, repeat: Infinity }
  },

  // Slide animations
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Text reveal
  textReveal: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

// Easing functions
export const easings = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  sharp: [0.4, 0, 0.2, 1],
};

// Color animations
export const colorAnimations = {
  orangeGlow: {
    animate: { 
      color: ["#FF8C42", "#FFB366", "#FF8C42"],
      textShadow: [
        "0 0 10px rgba(255, 140, 66, 0.5)",
        "0 0 20px rgba(255, 140, 66, 0.8)",
        "0 0 10px rgba(255, 140, 66, 0.5)"
      ]
    },
    transition: { duration: 3, repeat: Infinity }
  },
  orangePulse: {
    animate: { 
      boxShadow: [
        "0 0 10px rgba(255, 140, 66, 0.3)",
        "0 0 30px rgba(255, 140, 66, 0.6)",
        "0 0 10px rgba(255, 140, 66, 0.3)"
      ]
    },
    transition: { duration: 2.5, repeat: Infinity }
  }
};
