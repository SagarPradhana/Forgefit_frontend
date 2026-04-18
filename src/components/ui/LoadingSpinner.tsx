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
          className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-transparent bg-gradient-to-r from-indigo-500/30 to-orange-400/30 mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
        >
          <Dumbbell size={32} className="text-indigo-400" />
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
