import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Dumbbell, Target, Ruler, Scale, MapPin, Edit3, Phone, AtSign, Fingerprint } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import {
  GlassCard,
  StatusBadge,
  Modal,
  SectionTitle
} from "../components/ui/primitives";

export function ProfileCard({ user: initialUser }: any) {
  const { t } = useTranslation();
  const [user, setUser] = useState(initialUser);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    height: user.height || 175,
    weight: user.weight || 72,
    address: user.address || "123 Fitness St, Muscle City",
  });

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setIsEditOpen(false);
  };

  const auth = useAuthStore();
  const userName = auth.name;
  const userEmail = auth.email || user.email;
  const userPhone = auth.mobile || user.phone;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Main Identity */}
        <GlassCard className="lg:col-span-1 p-8 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700" />

          <div className="relative mb-6">
            <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 p-[3px] shadow-2xl rotate-3">
              <div className="flex h-full w-full items-center justify-center rounded-[1.8rem] bg-slate-950 -rotate-3 overflow-hidden font-black text-4xl text-white uppercase tracking-tighter">
                {userName?.[0] || user.name?.[0] || "U"}
              </div>
            </div>
            <div className="absolute -bottom-2 -left-2 h-10 w-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center p-2 shadow-xl">
              <User className="text-indigo-400" size={18} />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{userName || user.name}</h2>
          <p className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8">{user.currentPlan}</p>

          <div className="flex flex-col gap-3 w-full">
            <div className="group/field relative items-center gap-4 px-5 py-4 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/20 transition-all flex h-14 cursor-default">
              <AtSign size={18} className="text-indigo-400 group-hover/field:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Authenticated Account</p>
                <span className="text-xs font-black text-white truncate block">{userEmail}</span>
              </div>
            </div>

            <div className="group/field relative items-center gap-4 px-5 py-4 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-orange-500/20 transition-all flex h-14 cursor-default">
              <Phone size={18} className="text-orange-400 group-hover/field:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Direct Communication</p>
                <span className="text-xs font-black text-white truncate block">{userPhone}</span>
              </div>
            </div>

            <div className="group/field relative items-center gap-4 px-5 py-4 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 transition-all flex h-14 cursor-default">
              <Fingerprint size={18} className="text-emerald-400 group-hover/field:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Global Handle</p>
                <span className="text-xs font-black text-emerald-400 truncate block">@{ (userName || user.name)?.toLowerCase()?.replace(/\s+/g, "_") || "user_identifier"}</span>
              </div>
            </div>

            <div className="group/field relative items-center gap-4 px-5 py-4 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-amber-500/20 transition-all flex h-14 cursor-default">
              <Dumbbell size={18} className="text-amber-400 group-hover/field:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Assigned Trainer</p>
                <span className="text-xs font-black text-white truncate block">{user?.trainer}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 w-full flex justify-between items-center px-2">
            <StatusBadge status={user.paymentStatus as any} />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">EST. 2024</span>
          </div>
        </GlassCard>

        {/* Right Col: Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 relative overflow-hidden group shadow-2xl">
              <div className="absolute -bottom-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 scale-150 rotate-12">
                <Ruler size={100} />
              </div>
              <SectionTitle title={t("biologicalMetrics") || "Biological Metrics"} className="mb-6" />
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 shadow-inner">
                      <Ruler size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-300/60 uppercase tracking-[0.2em] mb-0.5">Current Height</p>
                      <p className="text-2xl font-black text-white">{editForm.height} <span className="text-xs font-black text-slate-600 ml-1">CM</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 rounded-3xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-300 shadow-inner">
                      <Scale size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-orange-300/60 uppercase tracking-[0.2em] mb-0.5">Current Weight</p>
                      <p className="text-2xl font-black text-white">{editForm.weight} <span className="text-xs font-black text-slate-600 ml-1">KG</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 relative overflow-hidden group shadow-2xl">
              <div className="absolute -bottom-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 scale-150 -rotate-12">
                <MapPin size={100} />
              </div>
              <SectionTitle title={t("residence") || "Residence"} className="mb-6" />
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 h-[calc(100%-4rem)] flex flex-col justify-center gap-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Mailing Address</p>
                    <p className="text-sm font-bold text-white leading-relaxed">{editForm.address}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-8 relative overflow-hidden group shadow-2xl border-white/15">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <SectionTitle title={t("performanceSnapshot") || "Performance Snapshot"} />
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-500/30 active:scale-95 group/btn"
              >
                <Edit3 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all">
                <Target className="text-indigo-400 mb-3" size={24} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target</p>
                <p className="text-sm font-bold text-white truncate">{user.fitnessGoal}</p>
              </div>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all">
                <div className="text-orange-400 mb-3 font-black text-xl italic tracking-tighter">18d</div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Attendance</p>
                <p className="text-xs font-bold text-white uppercase tracking-tighter">Current Month</p>
              </div>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all">
                <div className="text-emerald-400 mb-3 font-black text-xl italic tracking-tighter">{user.daysLeft}d</div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-bold text-white uppercase tracking-tighter">Subscription Left</p>
              </div>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all">
                <Target className="text-blue-400 mb-3" size={24} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Legacy</p>
                <p className="text-sm font-bold text-white truncate uppercase">Member Since '24</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <Modal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Profile Information"
      >
        <div className="space-y-6 pt-2">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.15em] mb-4">
            Security Notice: Only physical metrics and address can be modified.
          </p>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-widest">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: Number(e.target.value) })}
                  placeholder="175"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-orange-300 uppercase tracking-widest">Weight (kg)</label>
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                  placeholder="72"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-emerald-300 uppercase tracking-widest">Current Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-5 text-slate-500" size={18} />
              <textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="Enter your residence address"
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all h-32 resize-none font-bold"
              />
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <button
              onClick={() => setIsEditOpen(false)}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
            >
              Sync Profile
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
