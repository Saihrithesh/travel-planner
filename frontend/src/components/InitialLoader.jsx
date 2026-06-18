import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function InitialLoader({ onComplete, ready }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;

    if (!ready) {
      // Simulate progress asymptotically towards 90% while waiting
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          const remaining = 90 - prev;
          const step = Math.max(0.2, remaining * 0.05); // Slow down as we approach 90%
          return Math.min(prev + step, 90);
        });
      }, 30);
    } else {
      // Once ready, quickly animate to 100%
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(onComplete, 200); // Wait briefly at 100% before finishing
            return 100;
          }
          // Increment faster to complete the loading sequence
          const step = Math.max(4, (100 - prev) * 0.25);
          return Math.min(prev + step, 100);
        });
      }, 16);
    }

    return () => clearInterval(timer);
  }, [ready, onComplete]);

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
