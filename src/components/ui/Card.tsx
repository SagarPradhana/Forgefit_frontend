import { motion } from "framer-motion";
import clsx from "clsx";

export function Card({ children, className }: any) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className={clsx(
        "rounded-2xl p-6",
        "bg-gradient-to-b from-white/10 to-white/5",
        "border border-white/10",
        "backdrop-blur-xl",
        "shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
