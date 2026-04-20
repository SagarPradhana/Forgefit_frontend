import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "../../store/toastStore";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-xl border shadow-2xl backdrop-blur-md ${
              toast.type === "success"
                ? "bg-white dark:bg-slate-900 border-emerald-500/50 text-emerald-900 dark:text-emerald-50"
                : "bg-white dark:bg-slate-900 border-red-500/50 text-red-900 dark:text-red-50"
            }`}
          >
            <div className={`p-2 rounded-lg ${
              toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
            }`}>
              {toast.type === "success" ? (
                <CheckCircle size={20} className="text-emerald-500" />
              ) : (
                <AlertCircle size={20} className="text-red-500" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <p className="text-sm font-bold leading-tight">{toast.title}</p>
              <p className="text-[13px] font-medium opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
