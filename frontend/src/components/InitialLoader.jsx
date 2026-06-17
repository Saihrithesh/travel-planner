import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function InitialLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds loading
    const intervalTime = 15;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300); // Small delay after 100%
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white px-8"
    >
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 1 }}
          className="text-2xl font-black uppercase tracking-widest text-neutral-100"
        >
          TravelPlanner
        </motion.h1>

        {/* Counter */}
        <div className="relative overflow-hidden h-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-extrabold tabular-nums text-white"
          >
            {Math.floor(progress)}%
          </motion.div>
        </div>

        {/* Elegant Line Progress Bar */}
        <div className="w-full h-[1px] bg-neutral-900 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
        </div>

        {/* Loading status */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold"
        >
          Curating Your Adventures
        </motion.p>
      </div>
    </motion.div>
  );
}

export default InitialLoader;
