// Framer Motion animation variants and utilities

// Page transition animations
export const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: 20
  }
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// Stagger animations for lists
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

// Stagger container for coordinated animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15
    }
  }
};

// Fade animations
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

// Scale animations
export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 }
};

// Slide animations
export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4 }
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4 }
};

// Bounce animation for success states
export const bounceIn = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 200
    }
  }
};

// Progress bar animation
export const progressVariants = {
  initial: { width: '0%' },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  })
};

// Gauge animation for savings display
export const gaugeVariants = {
  initial: { rotate: -90 },
  animate: (percentage) => ({
    rotate: -90 + (percentage / 100) * 180,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.3
    }
  })
};

// Confetti animation variants
export const confettiVariants = {
  initial: {
    y: -100,
    opacity: 0,
    rotate: 0,
    scale: 0
  },
  animate: {
    y: [0, -50, 100, 200],
    opacity: [0, 1, 1, 0],
    rotate: [0, 180, 360, 540],
    scale: [0, 1, 1, 0.5],
    transition: {
      duration: 2,
      ease: 'easeOut',
      times: [0, 0.2, 0.8, 1]
    }
  }
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 }
};

export const hoverLift = {
  whileHover: { y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  transition: { duration: 0.2 }
};

// Loading spinner animation
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Utility function to create custom spring animations
export const createSpringAnimation = (damping = 10, stiffness = 100) => ({
  type: 'spring',
  damping,
  stiffness
});

// Utility function for delayed animations
export const createDelayedAnimation = (delay = 0) => ({
  ...fadeInUp,
  transition: {
    ...fadeInUp.transition,
    delay
  }
});