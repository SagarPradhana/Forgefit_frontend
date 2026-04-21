import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserModal = ({ isOpen, onClose, onConfirm }: DeleteUserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-br from-slate-900/98 to-slate-800/98 border border-white/20 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 text-red-400 mb-4">
            <Trash2 size={24} />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
              Confirm Delete
            </h3>
        </div>
        <p className="text-slate-300 mb-6 font-medium leading-relaxed">
          Are you sure you want to delete this user? This action cannot be
          undone and all associated records will be permanently removed.
        </p>

        <div className="flex gap-3 justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition shadow-lg shadow-red-500/20"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
