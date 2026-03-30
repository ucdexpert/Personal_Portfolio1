"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Code, Server, Settings } from "lucide-react";
import { skillCategories } from "@/data/skills";
import { SkillCard } from "./SkillBar";

const categoryIcons = {
  Frontend: Code,
  Backend: Server,
  "Tools & DevOps": Settings,
};

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <section id="skills" className="py-20 md:py-32 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-4 border border-blue-200 dark:border-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              My Skills
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Technologies I Work With
            </motion.h2>
            <motion.p
              className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              A comprehensive toolkit for building modern web applications
            </motion.p>
          </div>

          {/* Skills Categories */}
          <div className="space-y-12">
            {skillCategories.map((category, categoryIndex) => {
              const Icon = categoryIcons[category.name as keyof typeof categoryIcons];
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + categoryIndex * 0.2 }}
                >
                  {/* Category Header */}
                  <div
                    className="flex items-center gap-3 mb-6 cursor-pointer"
                    onClick={() =>
                      setActiveCategory(activeCategory === categoryIndex ? null : categoryIndex)
                    }
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center shadow-md">
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <motion.div
                      animate={{ rotate: activeCategory === categoryIndex ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-auto"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Skills Grid */}
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                    layout
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <SkillCard
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        icon={skill.icon}
                        delay={skillIndex}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Skills Tags */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Also experienced with
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "GraphQL",
                "Redis",
                "Elasticsearch",
                "Kubernetes",
                "Terraform",
                "Jest",
                "Cypress",
                "Storybook",
                "Figma",
                "Agile",
              ].map((skill, index) => (
                <motion.span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-sm font-medium shadow-md border border-gray-200 dark:border-slate-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
