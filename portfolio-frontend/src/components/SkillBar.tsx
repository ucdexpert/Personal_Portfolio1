"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getSkillIconColor } from "@/data/skills";

interface SkillBarProps {
  name: string;
  level: number;
  delay?: number;
}

export function SkillBar({ name, level, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {level}%
        </span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: delay * 0.1,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}

interface SkillCardProps {
  name: string;
  level: number;
  icon: string;
  delay?: number;
}

export function SkillCard({ name, level, icon, delay = 0 }: SkillCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const iconColor = getSkillIconColor(icon);

  return (
    <motion.div
      ref={ref}
      className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-slate-700"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Icon */}
      <div className="w-12 h-12 mb-4 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-100 dark:border-slate-700">
        <span className={`text-xl font-bold ${iconColor}`}>
          {name.charAt(0)}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {name}
      </h3>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: delay * 0.1 + 0.3,
            ease: "easeOut",
          }}
        />
      </div>

      {/* Level text */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{level}% proficiency</p>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
