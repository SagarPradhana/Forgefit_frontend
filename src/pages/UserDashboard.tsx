import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  GlassCard,
  SectionTitle,
  GlowButton,
  Modal,
} from "../components/ui/primitives";

import { useAuthStore } from "../store/authStore";
import {
  CheckCircle2,
  Calendar,
  Zap,
  Circle,
  Dumbbell,
  AlertCircle,
  XCircle,
  QrCode,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGet } from "../hooks/useApi";
import confetti from "canvas-confetti";
import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";
import { toast } from "../store/toastStore";
import { IdCardModal } from "../components/common/IdCardModal";

function UserDashboard() {
  const { t } = useTranslation();
  const userName = useAuthStore((s) => s.name);
  const userId = useAuthStore((s) => s.id);
  const mobile = useAuthStore((s) => s.mobile);
  const email = useAuthStore((s) => s.email);
  const profile_image_path = useAuthStore((s) => s.profile_image_path);
  const metadata = useAuthStore((s) => s.metadata);
  const latest_subscription_details = useAuthStore((s) => s.latest_subscription_details);
  const userRole = useAuthStore((s) => s.role);
  const joining_date = useAuthStore((s) => s.joining_date);
  const username = useAuthStore((s) => s.username);
  const qr_url = useAuthStore((s) => s.qr_url);

  const myDetails = {
    mobile,
    email,
    profile_image_path,
    qr_url,
    metadata,
    latest_subscription_details,
    role: userRole,
    joining_date,
    username
  };
  const [workoutDone, setWorkoutDone] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();



  // Auto-sync plan on home mount
  const { refetch: syncUserPlan } = useGet(
    userId ? `${API_ENDPOINTS.ADMIN.SYNC_SUBSCRIPTIONS}?user_id=${userId}` : null,
    {
      onSuccess: () => {
        toast.success("Subscription plan synchronized.");
        setIsSyncing(false);
      },
      onError: () => {
        setIsSyncing(false);
      }
    }
  );

  // Active plan fetch — /current-subscription/{userId}
  const { data: activePlanRes, loading: planLoading } = useGet(
    userId ? API_ENDPOINTS.APP.CURRENT_SUBSCRIPTION(userId) : null
  );
  const activePlanData =
    activePlanRes?.data?.[0] ??
    (activePlanRes?.start_date != null ? activePlanRes : null);

  // Consistency Tracker fetch — /consistency-tracker/{userId}
  const { data: trackerRes, loading: trackerLoading } = useGet(
    userId ? API_ENDPOINTS.APP.CONSISTENCY_TRACKER(userId) : null
  );
  const trackerData = trackerRes || {};

  const handleManualSync = () => {
    setIsSyncing(true);
    syncUserPlan();
  };

  const trackerDays = trackerData.days || [];

  // Use .filter() to find today's tracker entry from the consistency-tracker API
  const todayTrackerEntry = trackerDays.filter((day: any) => {
    const dateObj = new Date(day.date * 1000);
    return new Date().toLocaleDateString() === dateObj.toLocaleDateString();
  });
  const isPresentToday =
    todayTrackerEntry.length > 0 && todayTrackerEntry[0].attended === true;

  const [exercises, setExercises] = useState([
    { id: 1, name: "Bench Press", sets: "4 Sets", reps: "10-12 Reps", target: "Power", done: false },
    { id: 2, name: "Push Ups", sets: "3 Sets", reps: "Failure", target: "Endurance", done: false },
    { id: 3, name: "Cable Fly", sets: "3 Sets", reps: "15 Reps", target: "Definition", done: false }
  ]);

  // Plan Dates
  const planInfo = activePlanData ? {
    startDate: new Date(activePlanData.start_date * 1000).toLocaleDateString(),
    expiryDate: new Date(activePlanData.end_date * 1000).toLocaleDateString(),
    daysRemaining: activePlanData.remaining_days,
    name: activePlanData.subscription_name,
    status: activePlanData.status
  } : {
    startDate: "-",
    expiryDate: "-",
    daysRemaining: 0,
    name: "No Active Plan",
    status: false
  };

  // Subscription expired when status === false
  const isExpired = planInfo.status === false;

  // Calendar Data
  const monthName = trackerData.month ? new Date(trackerData.year, trackerData.month - 1).toLocaleString('default', { month: 'long' }).toUpperCase() : "";
  const yearName = trackerData.year || "";
  const firstDayOfMonth = trackerDays.length > 0 ? new Date(trackerDays[0].date * 1000).getDay() : 0;
  
  // Set expiry modal if needed
  useEffect(() => {
    if (planInfo.daysRemaining > 0 && planInfo.daysRemaining <= 5) {
      setShowExpiryModal(true);
    }
  }, [planInfo.daysRemaining]);

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

  // Shimmer skeleton block
  const Sk = ({ cls }: { cls: string }) => (
    <div className={`animate-pulse bg-white/[0.06] rounded-xl ${cls}`} />
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle
          title={`${t("welcomeBack")}, ${userName?.split(' ')[0] || "Member"}`}
          subtitle={t("trackConsistency")}
        />
        <div className="flex items-center gap-3">
          <GlowButton
            onClick={handleManualSync}
            disabled={isSyncing}
            className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 bg-white/5 border-white/10 hover:bg-white/10 transition-all shadow-lg"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Re-sync Plan"}
          </GlowButton>
          <GlowButton
            onClick={() => navigate("/user/subscription?history=1")}
            className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
          >
            <Clock size={18} />
            Sub History
          </GlowButton>
          <GlowButton
            onClick={() => setIdCardOpen(true)}
            className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
          >
            <QrCode size={18} />
            {t("profile")} ID
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- PLAN STATUS --- */}
        {planLoading ? (
          <GlassCard className="p-8 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <Sk cls="h-10 w-10" />
              <Sk cls="h-6 flex-1" />
              <Sk cls="h-7 w-20 rounded-full" />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Sk cls="h-20" />
                <Sk cls="h-20" />
              </div>
              <Sk cls="h-20" />
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-8 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex-1">
                {t("activePlan")} {planInfo.name !== "No Active Plan" && `- ${planInfo.name}`}
              </h3>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${planInfo.status ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${planInfo.status ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                {planInfo.status ? "Active" : "Expired"}
              </div>
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
              <div className={`relative h-20 rounded-2xl shadow-lg flex items-center justify-between px-8 overflow-hidden ${isExpired ? "bg-gradient-to-r from-red-600 to-orange-500 shadow-red-500/20" : "bg-indigo-500 shadow-indigo-500/20"}`}>
                <div className="absolute top-0 right-0 w-32 h-full bg-white/10 -skew-x-12 translate-x-8" />
                <div>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{isExpired ? "Plan Expired" : "Remaining Days"}</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">{isExpired ? "0 Days" : `${planInfo.daysRemaining} Days`}</p>
                </div>
                <Zap size={32} className="text-white/20" />
              </div>
            </div>
          </GlassCard>
        )}

        {/* --- ATTENDANCE STATUS --- */}
        {trackerLoading || planLoading ? (
          <GlassCard className="p-8 border-white/5 flex flex-col items-center justify-center gap-6">
            <Sk cls="h-24 w-24 rounded-full" />
            <Sk cls="h-8 w-48" />
            <Sk cls="h-4 w-40" />
            <Sk cls="h-14 w-full rounded-2xl" />
          </GlassCard>
        ) : (
          <GlassCard className={`p-8 border-[1px] flex flex-col justify-center text-center transition-all ${isExpired ? "border-orange-500/20 bg-orange-500/5 shadow-lg shadow-orange-500/5" : isPresentToday ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5 shadow-lg shadow-red-500/5"}`}>
            <div className="mb-6">
              <div className={`h-24 w-24 mx-auto rounded-full flex items-center justify-center transition-all duration-700 shadow-xl ${isExpired ? "bg-orange-500 text-white shadow-orange-500/20" : isPresentToday ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20 animate-pulse"}`}>
                {isExpired ? <AlertCircle size={48} /> : isPresentToday ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
              </div>
              <h3 className="mt-6 text-3xl font-black text-white uppercase italic tracking-tighter">
                {isExpired ? "Plan Expired" : isPresentToday ? t("verifiedPresent") : t("markedAbsent")}
              </h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">Official Registry Status for Today</p>
            </div>
            {isExpired ? (
              <div className="space-y-3">
                <div className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border bg-orange-500/10 text-orange-400 border-orange-500/20">Subscription Expired • Access Restricted</div>
                <p className="text-xs text-slate-500 italic leading-relaxed px-2">Your membership plan has expired. Please renew your subscription to regain gym access.</p>
              </div>
            ) : (
              <div className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${isPresentToday ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                {isPresentToday ? "Scan Complete • Access Granted" : "Awaiting Scanner Authentication"}
              </div>
            )}
          </GlassCard>
        )}
      </div>

      {/* --- ATTENDANCE CALENDAR --- */}
      {trackerLoading ? (
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <Sk cls="h-10 w-10" />
            <Sk cls="h-6 w-56" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => <Sk key={i} cls="h-4 mb-2" />)}
            {Array.from({ length: 35 }).map((_, i) => <Sk key={i} cls="aspect-square" />)}
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                <Calendar size={20} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{t("consistencyTracker")} <span className="text-slate-600 ml-2">{monthName} {yearName}</span></h3>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">{day}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {trackerDays.map((dayData: any) => {
              const dateObj = new Date(dayData.date * 1000);
              const day = dateObj.getDate();
              const wasPresent = dayData.attended;
              const isToday = new Date().toLocaleDateString() === dateObj.toLocaleDateString();
              return (
                <div key={day} className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${(isToday && wasPresent) || wasPresent ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : isToday ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-400 animate-pulse" : "bg-white/5 border-white/5 text-slate-600"}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* --- TODAY WORKOUT --- */}
      <GlassCard className="p-8 border-white/5 bg-gradient-to-br from-slate-950 to-slate-900 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{t("protocolInProgress")}</span>
            </div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{t("todayWorkout")} <span className="text-indigo-400/50">CHEST & TRICEPS</span></h3>
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
              Your current access protocol is scheduled to terminate in <span className="text-orange-400 font-bold">{planInfo.daysRemaining} days</span>. Please process renewal to maintain continuity.
            </p>
          </div>
          <GlowButton className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest">Execute Immediate Renewal</GlowButton>
        </div>
      </Modal>

      {/* 🆔 DIGITAL IDENTITY MODAL */}
      <IdCardModal
        isOpen={idCardOpen}
        onClose={() => setIdCardOpen(false)}
        user={{ id: userId || '', name: userName || '', ...myDetails }}
        portalType="user"
      />
    </div>
  );
}

export default UserDashboard;
