import { useState } from "react";
import { GlassCard, SectionTitle, GlowButton } from "../ui/primitives";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "../../store/toastStore";
import { motion } from "framer-motion";

export function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Security Credentials Updated Successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to update password. Please verify current credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <GlassCard className="p-8 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Security Protocol</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update Your Access Credentials</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Strategic Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showNew ? "text" : "password"}
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Credentials</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <GlowButton
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20"
            >
              {loading ? "Re-encrypting..." : "Initialize Security Update"}
            </GlowButton>
          </div>
        </form>
      </GlassCard>

      <div className="mt-8 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Security Guidelines</h4>
        <ul className="space-y-2 text-xs font-medium text-slate-500">
          <li className="flex items-center gap-2">• Minimum 8 characters with alphanumeric complexity</li>
          <li className="flex items-center gap-2">• Avoid repeating patterns and generic credentials</li>
          <li className="flex items-center gap-2">• Change credentials immediately if account compromise is suspected</li>
        </ul>
      </div>
    </motion.div>
  );
}
