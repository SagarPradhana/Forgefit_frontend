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
import { NotificationModal } from "../components/ui/NotificationModal";
import {
  Dumbbell,
  CreditCard,
  Flame,
  Zap,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Calendar,
  AlertCircle,
  QrCode,
  Circle,
  Clock
} from "lucide-react";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";

function UserDashboard() {
  const userName = useAuthStore((s) => s.name);
  const [open, setOpen] = useState(userProfile.daysLeft <= 5);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Interactive Workout Session State
  const [exercises, setExercises] = useState([
    { id: 1, name: "Bench Press", sets: "4 Sets", reps: "10-12 Reps", target: "Power", done: false },
    { id: 2, name: "Push Ups", sets: "3 Sets", reps: "Failure", target: "Endurance", done: false },
    { id: 3, name: "Cable Fly", sets: "3 Sets", reps: "15 Reps", target: "Definition", done: false }
  ]);

  const streak = 5;

  const toggleExercise = (id: number) => {
    setExercises(prev => prev.map(ex => ex.id === id ? { ...ex, done: !ex.done } : ex));
  };

  const allDone = exercises.every(ex => ex.done);

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
      {/* 🚀 HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <SectionTitle
            title={`Rise & Grind, ${userName?.split(' ')[0] || "Trainee"} 👋`}
            subtitle="Your current mission status and performance metrics"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Flame size={18} fill="currentColor" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest pr-4">{streak} Day Streak</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQrOpen(true)}
              className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all relative group"
            >
              <QrCode size={20} />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[9px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Digital ID</span>
            </button>

          </div>
        </div>
      </div>

      {/* 📊 HIGH-DENSITY SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 border-white/5 bg-indigo-500/5 group hover:bg-indigo-500/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Active Plan</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter">{userProfile.currentPlan}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-emerald-500/5 group hover:bg-emerald-500/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Attendance</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter">Checked In Today</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-orange-500/5 group hover:bg-orange-500/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Next Workout</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter">Legs & Core <span className="text-[10px] text-slate-500 font-bold ml-1">9:00 AM</span></p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-purple-500/5 group hover:bg-purple-500/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Subscription</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter">{userProfile.daysLeft} Days Left</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- MAIN TRAINER COLUMN --- */}
        <div className="lg:col-span-8 space-y-8">

          {/* 🏋️ INTERACTIVE WORKOUT LOGGER */}
          <GlassCard className="p-8 border-white/5 bg-gradient-to-br from-slate-950 to-slate-900 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Protocol in Progress</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">CHEST & TRICEPS <span className="text-indigo-400/50">S04 E12</span></h3>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Dumbbell size={28} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 relative z-10">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group/item ${ex.done
                    ? "bg-emerald-500/5 border-emerald-500/20 opacity-60"
                    : "bg-white/5 border-white/5 hover:border-white/20"
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${ex.done ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-slate-500 group-hover/item:text-indigo-400"
                      }`}>
                      {ex.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{ex.target}</p>
                      <p className={`text-lg font-black italic transition-all ${ex.done ? "text-emerald-400 line-through" : "text-white"}`}>{ex.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-indigo-300">{ex.sets}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{ex.reps}</p>
                  </div>
                </div>
              ))}
            </div>

            <GlowButton
              className={`mt-8 w-full h-16 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${workoutDone ? "bg-emerald-500/20 !text-emerald-400 border-emerald-500/30" : ""
                } ${!allDone && !workoutDone ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleCompleteWorkout}
              disabled={workoutDone || !allDone}
            >
              {workoutDone ? (
                <><CheckCircle2 size={24} /> Protocol Completed</>
              ) : (
                <><Zap size={20} fill="currentColor" /> {allDone ? "Finalize Session" : "Complete All Exercises"}</>
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

          {/* 🧠 STRATEGIC ALERT (Simulated Push Notification) */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <GlassCard className="p-6 border-orange-500/30 bg-orange-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-16 -mt-16" />
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-orange-300 uppercase tracking-tight">Contract Renewal Required</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Your performance cycle ends in {userProfile.daysLeft} days. Secure your slot now.</p>
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

          {/* PROFILE / QR QUICK LINK */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setQrOpen(true)}
            className="cursor-pointer"
          >
            <GlassCard className="p-5 text-center relative overflow-hidden group border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/20 blur-xl -mr-8 -mt-8" />
              <div className="h-16 w-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <QrCode size={30} className="text-indigo-400" />
              </div>
              <p className="font-black text-white uppercase tracking-tight text-sm px-2">Tap to Access QR ID</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Touchless Gym Entry</p>
            </GlassCard>
          </motion.div>

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

      {/* 💳 DYNAMIC QR DIGITAL ID MODAL */}
      <Modal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Digital Access Token"
      >
        <div className="flex flex-col items-center py-10 px-4 space-y-8 text-center">
          <div className="relative p-6 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] border-8 border-indigo-500/20 group">
            <QRCodeSVG
              value={`FORGEFIT-${userName || "USER"}-${Date.now()}`}
              size={220}
              level="H"
              includeMargin={false}
              className="relative z-10"
            />
            <div className="absolute inset-0 bg-indigo-500/5 -z-1 blur-2xl group-hover:scale-110 transition-transform" />
          </div>

          <div className="max-w-[280px] space-y-3">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Dynamic Entry Key</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Hold this QR code near the scanner at the gym entrance. This token refreshes every session for maximum security.
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Active & Authenticated</span>
            </div>
          </div>

          <GlowButton
            className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4"
            onClick={() => setQrOpen(false)}
          >
            Identify Complete
          </GlowButton>
        </div>
      </Modal>

      {/* 🔔 NOTIFICATION CENTER MODAL */}
      <NotificationModal
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

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
              To avoid manual access termination and maintain your current <span className="text-orange-400 font-bold">{streak}-day streak</span>, please process your cycle renewal.
            </p>
          </div>
          <GlowButton className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest">Execute Immediate Renewal</GlowButton>
        </div>
      </Modal>
    </div>
  );
}

export default UserDashboard;

