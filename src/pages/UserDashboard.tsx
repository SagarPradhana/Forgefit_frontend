import { useState } from "react";
import { motion } from "framer-motion";
import {
  GlassCard,
  Modal,
  SectionTitle,
  StatusBadge,
  CommonButton,
  GlowButton,
} from "../components/ui/primitives";
import { userProfile } from "../data/mockData";
import { useAuthStore } from "../store/authStore";
import {
  Dumbbell,
  CreditCard,
  Flame,
  Zap,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

function UserDashboard() {
  const userName = useAuthStore((s) => s.name);
  const [open, setOpen] = useState(userProfile.daysLeft <= 5);
  const [workoutDone, setWorkoutDone] = useState(false);

  const progress = Math.min(100, Math.max(0, (userProfile.daysLeft / 30) * 100));
  const streak = 5;

  const handleCompleteWorkout = () => {
    setWorkoutDone(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#f97316", "#10b981"]
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* 🚀 HEADER & IDENTITY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <SectionTitle
            title={`Rise & Grind, ${userName?.split(' ')[0] || "Trainee"} 👋`}
            subtitle="Your current mission status and performance metrics"
          />
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
            <Flame size={18} fill="currentColor" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest pr-4">{streak} Day Streak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- MAIN TRAINER COLUMN --- */}
        <div className="lg:col-span-8 space-y-8">

          {/* 🎯 MISSION HERO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <GlassCard className="relative overflow-hidden p-8 border-white/10 bg-slate-950/40">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">Active Mission</span>
                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tier: {userProfile.currentPlan}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none">
                    ENGINEERING <br /> <span className="text-indigo-400">EXCELLENCE</span>
                  </h2>
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Time Remaining</p>
                      <p className="text-2xl font-black text-white mt-1 italic">{userProfile.daysLeft} <span className="text-xs text-orange-400">DAYS</span></p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1 italic uppercase">OPTIMAL</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                  <GlowButton className="h-14 px-10 rounded-2xl text-xs font-black uppercase tracking-widest">Upgrade Access</GlowButton>
                  <CommonButton className="h-12 border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest">Review Contract</CommonButton>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                  <span>Deployment Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-2xl p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 🏋️ ACTIVE WORKOUT SESSION */}
          <GlassCard className="p-8 border-white/5 bg-gradient-to-br from-slate-950 to-slate-900 group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Live Schedule</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Today's Protocol: <span className="text-indigo-400">CHEST & TRICEPS</span></h3>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Dumbbell size={28} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Bench Press", sets: "4 Sets", reps: "10-12 Reps", target: "Power" },
                { name: "Push Ups", sets: "3 Sets", reps: "Failure", target: "Endurance" },
                { name: "Cable Fly", sets: "3 Sets", reps: "15 Reps", target: "Definition" }
              ].map((ex, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{ex.target}</p>
                  <p className="text-lg font-black text-white italic mb-4">{ex.name}</p>
                  <div className="flex justify-between text-[10px] font-black uppercase text-indigo-300">
                    <span>{ex.sets}</span>
                    <span>{ex.reps}</span>
                  </div>
                </div>
              ))}
            </div>

            <GlowButton
              className={`mt-8 w-full h-16 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${workoutDone ? "bg-emerald-500/20 !text-emerald-400 border-emerald-500/30" : ""
                }`}
              onClick={handleCompleteWorkout}
              disabled={workoutDone}
            >
              {workoutDone ? (
                <><CheckCircle2 size={24} /> Protocol Completed</>
              ) : (
                <><Zap size={20} fill="currentColor" /> Finalize Session</>
              )}
            </GlowButton>
          </GlassCard>

          {/* 📊 IMPACT TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <GlassCard className="relative p-6 border-white/5 hover:border-emerald-500/20 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Calendar size={20} />
                  </div>
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Historical Visits</p>
                <p className="text-3xl font-black text-white italic tracking-tighter">{userProfile.attendance} <span className="text-xs text-slate-600 not-italic uppercase tracking-widest font-bold">Days</span></p>
              </GlassCard>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <GlassCard className="relative p-6 border-white/5 hover:border-orange-500/20 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <Flame size={20} />
                  </div>
                  <Zap size={16} className="text-orange-500" fill="currentColor" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Energy Burned</p>
                <p className="text-3xl font-black text-white italic tracking-tighter">320 <span className="text-xs text-slate-600 not-italic uppercase tracking-widest font-bold">Kcal</span></p>
              </GlassCard>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <GlassCard className="relative p-6 border-white/5 hover:border-cyan-500/20 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <CreditCard size={20} />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Finance Status</p>
                <StatusBadge status={userProfile.paymentStatus as any} />
              </GlassCard>
            </div>
          </div>
        </div>

        {/* --- INTELLIGENCE SIDEBAR --- */}
        <div className="lg:col-span-4 space-y-8">

          {/* 🧠 STRATEGIC ALERT */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <GlassCard className="p-6 border-orange-500/30 bg-orange-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-16 -mt-16" />
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-orange-300 uppercase tracking-tight">Contract Renewal Required</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Your performance cycle ends in 5 days. Secure your slot now.</p>
                </div>
              </div>
              <CommonButton className="w-full h-12 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border-orange-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Execute Renewal</CommonButton>
            </GlassCard>
          </motion.div>

          {/* 👨‍🏫 TRAINER INTELLIGENCE */}
          <GlassCard className="p-6 border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mb-16" />
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <MessageSquare size={18} />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Trainer Intelligence</h4>
            </div>
            <div className="space-y-4">
              <div className="relative bg-slate-950/40 p-4 rounded-2xl border border-white/5 italic text-[13px] text-slate-300 leading-relaxed shadow-inner">
                "Focus on controlled eccentric movements today. Hydration is critical for the tricep recovery protocol."
              </div>
              <div className="flex items-center gap-2 px-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Insights generated 10m ago</span>
              </div>
            </div>
          </GlassCard>

          {/* PROFILE */}
          <GlassCard className="p-5 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-xl -mr-8 -mt-8" />
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 p-[2px] mb-3 rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white uppercase tracking-tighter">
                  {userName?.[0] || "U"}
               </div>
            </div>
            <p className="font-black text-white uppercase tracking-tight text-sm truncate px-2">{userName || "Your Profile"}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Active Member</p>
          </GlassCard>

          {/* ⚡ ACTIVITY ARCHIVE */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Activity Archive</h4>
              <span className="text-[10px] font-black text-indigo-400 uppercase cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-8 relative">
              <div className="absolute left-[7px] top-1 bottom-1 w-[1px] bg-slate-800" />
              {[
                { action: "Protocol Finished", type: "Workout", time: "2h ago", color: "bg-indigo-500" },
                { action: "Cardio Integration", type: "Session", time: "1d ago", color: "bg-emerald-500" },
                { action: "Strategy Change", type: "Security", time: "2d ago", color: "bg-orange-500" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 relative z-10">
                  <div className={`h-[15px] w-[15px] rounded-full ${item.color} ring-4 ring-slate-950 mt-1 shadow-2xl`} />
                  <div>
                    <p className="text-sm font-black text-white leading-none mb-1 uppercase tracking-tight italic">{item.action}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.type}</span>
                      <span className="text-[10px] text-slate-700">•</span>
                      <span className="text-[10px] font-bold text-slate-600 italic tracking-widest">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 🚨 CRITICAL ALERT MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Protocol Termination Warning"
      >
        <div className="space-y-6 text-center py-4">
          <div className="h-20 w-20 bg-orange-500/10 rounded-full mx-auto flex items-center justify-center text-orange-500">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-black text-white italic uppercase tracking-tighter">Your membership cycle is ending</p>
            <p className="text-sm text-slate-400 leading-relaxed px-6">
              To avoid manual access termination and maintain your current <span className="text-orange-400 font-bold">5-day streak</span>, please process your cycle renewal.
            </p>
          </div>
          <GlowButton className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest">Execute Immediate Renewal</GlowButton>
        </div>
      </Modal>
    </div>
  );
}

export default UserDashboard;

