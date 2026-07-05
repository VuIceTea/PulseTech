"use client";
import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** How far (px) element starts below before rising */
  yOffset?: number;
  /** Duration in seconds */
  duration?: number;
  /** Whether animation plays only once */
  once?: boolean;
}

/**
 * Wraps children with a fade-up scroll reveal animation powered by framer-motion.
 * Elements start invisible and translated downward, then animate into view
 * as they enter the viewport.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  yOffset = 40,
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container — children animate one after another */
interface ScrollRevealGroupProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function ScrollRevealGroup({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: ScrollRevealGroupProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** Individual item inside a ScrollRevealGroup */
interface ScrollRevealItemProps {
  children: ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
}

export function ScrollRevealItem({
  children,
  className,
  yOffset = 30,
  duration = 0.55,
}: ScrollRevealItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
