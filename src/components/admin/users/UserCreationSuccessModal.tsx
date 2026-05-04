import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, CheckCircle, User, Mail, Phone, Calendar, Shield, Key } from "lucide-react";

interface UserCreationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    username?: string;
    role: string;
    email?: string;
    mobile: string;
    name: string;
    joining_date: number;
    password: string;
  } | null;
}

export const UserCreationSuccessModal = ({ 
  isOpen, 
  onClose, 
  userData 
}: UserCreationSuccessModalProps) => {
  if (!isOpen || !userData) return null;

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp * 1000).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-slate-900 to-indigo-950 shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="text-emerald-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">User Created</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                  Successfully registered
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <User size={12} /> Username
                </div>
                <p className="text-sm text-white font-bold">{userData.username || "—"}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Shield size={12} /> Role
                </div>
                <p className="text-sm text-white font-bold capitalize">{userData.role}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <User size={12} /> Name
              </div>
              <p className="text-sm text-white font-bold">{userData.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Mail size={12} /> Email
                </div>
                <p className="text-sm text-white font-bold">{userData.email || "—"}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Phone size={12} /> Mobile
                </div>
                <p className="text-sm text-white font-bold">{userData.mobile}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Calendar size={12} /> Joining Date
                </div>
                <p className="text-sm text-white font-bold">{formatDate(userData.joining_date)}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Key size={12} /> Password
                </div>
                <p className="text-sm text-emerald-400 font-bold">{userData.password}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full px-6 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black uppercase tracking-widest text-[10px] border border-indigo-400 transition-all shadow-xl shadow-indigo-500/20"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};