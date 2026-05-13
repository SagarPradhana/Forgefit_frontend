import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        {/* ANIMATED LOGO */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex h-24 w-24 items-center justify-center rounded-3xl border border-indigo-500/30 bg-slate-900/80 mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.2)] relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-orange-400/20 animate-pulse" />
          <Dumbbell size={36} className="text-indigo-400 relative z-10" />
        </motion.div>

        {/* TEXT */}
        <h3 className="text-lg font-semibold text-white mb-2">Loading</h3>
        <p className="text-sm text-slate-400">
          Preparing your fitness journey...
        </p>

        {/* ANIMATED DOTS */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-orange-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
