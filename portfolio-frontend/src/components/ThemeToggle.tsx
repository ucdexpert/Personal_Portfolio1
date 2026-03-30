"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Stars } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative w-[72px] h-9 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
        aria-label="Toggle theme"
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-md absolute top-0.5 left-0.5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-[72px] h-9 rounded-full overflow-hidden transition-all duration-500 ease-in-out ${
        isDark
          ? "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/50"
          : "bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg shadow-amber-500/50"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "dark" : "light"} mode`}
    >
      {/* Stars for dark mode */}
      {isDark && (
        <>
          <motion.div
            className="absolute top-1.5 left-1.5 text-white/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Stars size={8} />
          </motion.div>
          <motion.div
            className="absolute top-2.5 left-3 text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <Stars size={5} />
          </motion.div>
        </>
      )}

      {/* Sun rays for light mode */}
      {!isDark && (
        <motion.div
          className="absolute -right-1 -top-1 text-orange-300/50"
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Sun size={20} />
        </motion.div>
      )}

      {/* Toggle thumb (circle) */}
      <motion.div
        className={`absolute top-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isDark ? "bg-indigo-900/50" : "bg-white/50"
        }`}
        animate={{
          x: isDark ? 36 : 0,
          rotate: isDark ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon size={14} className="text-indigo-200" />
        ) : (
          <Sun size={14} className="text-amber-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
