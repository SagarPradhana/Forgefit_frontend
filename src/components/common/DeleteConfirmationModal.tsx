import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { CommonButton } from "../ui/primitives";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to permanently remove this record? This action cannot be undone.",
  confirmLabel = "Delete Now"
}: DeleteConfirmationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop with heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-md overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/30 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_-10px_rgba(239,68,68,0.3)]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20"
            >
              <X size={18} />
            </button>

            {/* Red Accent Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="p-8 relative z-10">
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                  <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white shadow-2xl shadow-red-500/40">
                    <Trash2 size={36} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-slate-900 border-4 border-slate-900 flex items-center justify-center text-red-400 shadow-lg">
                    <AlertTriangle size={14} fill="currentColor" className="text-red-400" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                  {title}
                </h3>
                <div className="h-1 w-12 bg-red-500 rounded-full mb-4" />
                <p className="text-slate-400 font-medium leading-relaxed max-w-[280px]">
                  {description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <CommonButton
                  variant="ghost"
                  onClick={onClose}
                  className="py-4 rounded-2xl border-white/5 hover:border-white/10 text-slate-300 font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </CommonButton>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-red-500/30 transition-all border border-red-400/20"
                >
                  {confirmLabel}
                </motion.button>
              </div>
            </div>

            {/* Bottom Bar Decorative */}
            <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-30" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
