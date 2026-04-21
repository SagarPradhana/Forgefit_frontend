import { useState } from "react";
import {
  GlassCard,
  SectionTitle,
  GlowButton,
  Modal,
} from "../components/ui/primitives";
import { userProfile } from "../data/mockData";
import { useAuthStore } from "../store/authStore";
import {
  CheckCircle2,
  Calendar,
  Zap,
  Circle,
  Dumbbell,
  AlertCircle,
  XCircle,
  QrCode
} from "lucide-react";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";

function UserDashboard() {
  const userName = useAuthStore((s) => s.name);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(userProfile.daysLeft <= 5);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Mock Admin-Driven Attendance Status
  const isPresentToday = true; // This would come from backend/admin state

  const [exercises, setExercises] = useState([
    { id: 1, name: "Bench Press", sets: "4 Sets", reps: "10-12 Reps", target: "Power", done: false },
    { id: 2, name: "Push Ups", sets: "3 Sets", reps: "Failure", target: "Endurance", done: false },
    { id: 3, name: "Cable Fly", sets: "3 Sets", reps: "15 Reps", target: "Definition", done: false }
  ]);

  // Mock Plan Dates
  const planInfo = {
    startDate: "2026-04-01",
    expiryDate: "2026-05-01",
    daysRemaining: userProfile.daysLeft
  };

  // Mock Calendar Data
  const daysInMonth = 30;
  const attendedDays = [1, 3, 4, 7, 8, 10, 12, 15, 18, 20, 21];

  const toggleExercise = (id: number) => {
    setExercises(prev => prev.map(ex => ex.id === id ? { ...ex, done: !ex.done } : ex));
  };

  const allDone = exercises.every(ex => ex.done);

  const handleCompleteWorkout = () => {
    setWorkoutDone(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#f97316", "#10b981"]
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionTitle
            title={`Welcome Back, ${userName?.split(' ')[0] || "Member"}`}
            subtitle="Track your consistency and manage your membership cycle."
          />
          <GlowButton 
            onClick={() => setQrModalOpen(true)}
            className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
          >
            <QrCode size={18} />
            Digital ID Card
          </GlowButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- PLAN STATUS --- */}
        <GlassCard className="p-8 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Plan Status</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Start Date</p>
                <p className="text-lg font-black text-white italic tracking-tighter">{planInfo.startDate}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expiry Date</p>
                <p className="text-lg font-black text-orange-400 italic tracking-tighter">{planInfo.expiryDate}</p>
              </div>
            </div>

            <div className="relative h-20 rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-between px-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-full bg-white/10 -skew-x-12 translate-x-8" />
              <div>
                <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest opacity-80">Remaining Protocol</p>
                <p className="text-3xl font-black text-white italic tracking-tighter">{planInfo.daysRemaining} Days</p>
              </div>
              <Zap size={32} className="text-white/20" />
            </div>
          </div>
        </GlassCard>

        {/* --- ATTENDANCE STATUS (Admin Driven) --- */}
        <GlassCard className={`p-8 border-[1px] flex flex-col justify-center text-center transition-all ${isPresentToday ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5 shadow-lg shadow-red-500/5"}`}>
          <div className="mb-6">
            <div className={`h-24 w-24 mx-auto rounded-full flex items-center justify-center transition-all duration-700 shadow-xl ${isPresentToday ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20 animate-pulse"}`}>
              {isPresentToday ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>
            <h3 className="mt-6 text-3xl font-black text-white uppercase italic tracking-tighter">
              {isPresentToday ? "Verified Present" : "Marked Absent"}
            </h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">Official Registry Status for Today</p>
          </div>

          <div className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${isPresentToday ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
            {isPresentToday ? "Scan Complete • Access Granted" : "Awaiting Scanner Authentication"}
          </div>
        </GlassCard>
      </div>

      {/* --- ATTENDANCE CALENDAR --- */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
              <Calendar size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Consistency Tracker <span className="text-slate-600 ml-2">APRIL 2026</span></h3>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">{day}</div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const wasPresent = attendedDays.includes(day);
            const isToday = day === 21;
            const isDone = isToday && isPresentToday;

            return (
              <div
                key={day}
                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${isDone || wasPresent
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : isToday
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-400 animate-pulse"
                  : "bg-white/5 border-white/5 text-slate-600"
                  }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* --- TODAY WORKOUT --- */}
      <GlassCard className="p-8 border-white/5 bg-gradient-to-br from-slate-950 to-slate-900 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Protocol in Progress</span>
            </div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Today's Workout <span className="text-indigo-400/50">CHEST & TRICEPS</span></h3>
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
            <><CheckCircle2 size={24} /> Workout Logged</>
          ) : (
            <><Zap size={20} fill="currentColor" /> {allDone ? "Finalize Session" : "Incomplete Session"}</>
          )}
        </GlowButton>
      </GlassCard>

      {/* 🚨 CRITICAL ALERT MODAL */}
      <Modal
        open={showExpiryModal}
        onClose={() => setShowExpiryModal(false)}
        title="Protocol Termination Warning"
      >
        <div className="space-y-6 text-center py-4">
          <div className="h-20 w-20 bg-orange-500/10 rounded-full mx-auto flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/10">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-black text-white italic uppercase tracking-tighter">Membership Cycle Expiring</p>
            <p className="text-sm text-slate-400 leading-relaxed px-6">
              Your current access protocol is scheduled to terminate in <span className="text-orange-400 font-bold">{userProfile.daysLeft} days</span>. Please process renewal to maintain continuity.
            </p>
          </div>
          <GlowButton className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest">Execute Immediate Renewal</GlowButton>
        </div>
      </Modal>

      {/* 🆔 DIGITAL IDENTITY MODAL */}
      <Modal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
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
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Identity Verification</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Present this code to the security scanner or staff for immediate facility access. Token is cryptographically unique.
                </p>
                <div className="flex items-center justify-center gap-2 pt-4">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Active & Authenticated</span>
                </div>
            </div>

            <GlowButton
                className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4"
                onClick={() => setQrModalOpen(false)}
            >
                Protocol Secure
            </GlowButton>
        </div>
      </Modal>
    </div>
  );
}

export default UserDashboard;
