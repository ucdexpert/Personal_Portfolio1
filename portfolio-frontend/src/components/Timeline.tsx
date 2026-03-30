"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Briefcase, GraduationCap, Award, Calendar, Building } from "lucide-react";
import { experiences } from "@/data/experience";

const iconMap = {
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  certificate: Award,
};

export function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-slate-900">
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
              My Journey
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Experience & Education
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              A timeline of my professional and academic journey
            </motion.p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-slate-600 md:-translate-x-1/2" />

            {/* Timeline items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => {
                const Icon = iconMap[experience.icon as keyof typeof iconMap] || Briefcase;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={experience.id}
                    className={`relative flex items-start gap-8 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } flex-col`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 mt-6">
                      <motion.div
                        className="w-full h-full rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-lg"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.15 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-blue-500/30"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.15, repeat: Infinity }}
                      />
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 ml-12 md:ml-0 ${
                        isEven ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <motion.div
                        className="group p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-slate-700 border-l-4 border-l-blue-500"
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        {/* Icon badge */}
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center mb-4 ${
                            isEven ? "md:ml-auto" : ""
                          }`}
                        >
                          <Icon size={22} className="text-white" />
                        </div>

                        {/* Type badge */}
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                            experience.type === "work"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          } ${isEven ? "md:float-right" : ""}`}
                        >
                          {experience.type === "work" ? "Work" : "Education"}
                        </span>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {experience.title}
                        </h3>

                        {/* Company/Institution */}
                        <div
                          className={`flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3 ${
                            isEven ? "md:justify-end" : ""
                          }`}
                        >
                          <Building size={16} />
                          <span className="font-medium">{experience.company}</span>
                        </div>

                        {/* Date */}
                        <div
                          className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 ${
                            isEven ? "md:justify-end" : ""
                          }`}
                        >
                          <Calendar size={14} />
                          <span>{experience.dateRange}</span>
                        </div>

                        {/* Description bullets */}
                        <ul
                          className={`space-y-2 text-gray-700 dark:text-gray-300 text-sm ${
                            isEven ? "md:text-right" : ""
                          }`}
                        >
                          {experience.description.map((item, i) => (
                            <li
                              key={i}
                              className={`flex items-start gap-2 ${
                                isEven ? "md:flex-row-reverse" : ""
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
