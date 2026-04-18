import { motion } from "framer-motion";
import clsx from "clsx";

export function Button({ children, className, ...props }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "px-6 py-3 rounded-xl font-semibold text-white",
        "bg-gradient-to-r from-indigo-500 to-orange-400",
        "shadow-[0_0_25px_rgba(99,102,241,0.5)]",
        "hover:shadow-[0_0_35px_rgba(249,115,22,0.6)]",
        "transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
