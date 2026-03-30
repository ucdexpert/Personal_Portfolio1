"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({
  end,
  duration = 2,
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 50,
    damping: 20,
  });

  const display = useTransform(spring, (current) => {
    const value = Math.round(current);
    return `${prefix}${value}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        spring.set(end);
      }, duration * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, spring, end, duration]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
