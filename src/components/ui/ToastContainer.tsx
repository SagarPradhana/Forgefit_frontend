import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "../../store/toastStore";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

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
            className={`pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-xl border shadow-2xl backdrop-blur-md cursor-pointer ${
              toast.type === "success"
                ? "bg-white dark:bg-slate-900 border-emerald-500/50 text-emerald-900 dark:text-emerald-50"
                : toast.type === "info"
                ? "bg-white dark:bg-slate-900 border-indigo-500/50 text-indigo-900 dark:text-indigo-50"
                : "bg-white dark:bg-slate-900 border-red-500/50 text-red-900 dark:text-red-50"
            }`}
            onClick={() => removeToast(toast.id)}
          >
            <div className={`p-2 rounded-lg ${
              toast.type === "success" 
                ? "bg-emerald-500/20" 
                : toast.type === "info"
                ? "bg-indigo-500/20"
                : "bg-red-500/20"
            }`}>
              {toast.type === "success" ? (
                <CheckCircle size={20} className="text-emerald-500" />
              ) : toast.type === "info" ? (
                <Info size={20} className="text-indigo-500" />
              ) : (
                <AlertCircle size={20} className="text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
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