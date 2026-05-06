import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  GlassCard,
  SectionTitle,
  Skeleton,
  EmptyState,
  GlowButton,
} from "../../components/ui/primitives";
import { UserManagement } from "../../components/admin/UserManagement";
import { TrainerAttendance } from "../../components/trainer/TrainerAttendance";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Users, ClipboardList, Activity, Clock, ChevronRight, QrCode, Dumbbell, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useGet } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/url";
import { IdCardModal } from "../../components/common/IdCardModal";

const TrainerDashboard = () => {
  const { name, id: userId, mobile, email, profile_image_path, metadata, joining_date, username, qr_url, role } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const myDetails = { mobile, email, profile_image_path, qr_url, metadata, role, joining_date, username };
  const [idCardOpen, setIdCardOpen] = useState(false);

  const { data: statsData } = useGet(
    userId ? API_ENDPOINTS.ADMIN.TRAINER_STATS(userId) : null,
    { useCache: true }
  );
  
  const stats = statsData || { total_assigned_users: 0, new_assigned_users: 0, avg_session_time_minutes: 0 };

  const formatSessionTime = (minutes: number) => {
    if (!minutes || minutes === 0) return "0m";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  const { data: trainerUsersData } = useGet(
    userId ? `${API_ENDPOINTS.ADMIN.TRAINER_USERS}?count=100&offset=0` : null,
    { useCache: true }
  );
  const trainerUsers = trainerUsersData?.data || [];
  
  const [selectedWorkoutUser, setSelectedWorkoutUser] = useState<string>("");
  
  useEffect(() => {
    if (trainerUsers.length > 0 && !selectedWorkoutUser) {
      setSelectedWorkoutUser(trainerUsers[0].id);
    }
  }, [trainerUsers, selectedWorkoutUser]);

  const todayDay = String(new Date().getDay() || 7);
  const [workoutDay, setWorkoutDay] = useState(todayDay);
  const { data: workoutData, loading: workoutLoading } = useGet(
    selectedWorkoutUser ? API_ENDPOINTS.APP.MY_WORKOUT_PLAN(selectedWorkoutUser, workoutDay) : null,
    { useCache: true }
  );
  const workoutPlan = workoutData;
  const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* ── HERO SECTION & ID CARD BUTTON ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle
          title={`${t("welcomeBack")}, COACH ${name?.split(' ')[0] || ""}`}
          subtitle="Trainer Portal"
        />
        <div className="flex flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <GlowButton
            onClick={() => setIdCardOpen(true)}
            className="flex-1 md:flex-none h-12 px-4 sm:px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
          >
            <QrCode size={18} className="shrink-0" />
            <span className="truncate">{t("profile")} ID</span>
          </GlowButton>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Total Assigned Users", value: stats.total_assigned_users, icon: Users, color: "bg-indigo-500", delay: 0.1, action: () => navigate("/trainer/users") },
          { label: "Avg Session Time", value: formatSessionTime(stats.avg_session_time_minutes), icon: Clock, color: "bg-purple-500", delay: 0.2, action: null },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stat.delay }}
            onClick={stat.action || undefined}
            className={`group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-all ${stat.action ? "cursor-pointer" : ""}`}
          >
            <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-10 ${stat.color}`} />
            <div className={`h-10 w-10 rounded-xl ${stat.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── TRAINING PROTOCOLS (User Wise) ── */}
      <GlassCard className="p-6 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Dumbbell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">User Training Protocols</h3>
              <p className="text-xs text-slate-400">View user-specific workout plans</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedWorkoutUser}
              onChange={(e) => setSelectedWorkoutUser(e.target.value)}
              className="flex-1 md:w-48 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 outline-none"
            >
              <option value="" disabled>Select User</option>
              {trainerUsers.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <select
              value={workoutDay}
              onChange={(e) => setWorkoutDay(e.target.value)}
              className="w-32 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 outline-none"
            >
              {dayNames.map((day, i) => i > 0 && <option key={i} value={String(i)}>{day}</option>)}
            </select>
          </div>
        </div>

        {workoutLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-white/[0.06] rounded w-3/4" />
            <div className="h-4 bg-white/[0.06] rounded w-1/2" />
          </div>
        ) : workoutPlan?.workout_details?.workouts?.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Name</p>
                <p className="text-base font-black text-white italic">{workoutPlan.name || "-"}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Focus</p>
                <p className="text-sm font-bold text-indigo-400">{workoutPlan.focus || "-"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Exercises</p>
              {workoutPlan.workout_details.workouts.map((ex: any, idx: number) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{ex.name}</p>
                      <p className="text-[9px] text-slate-500">{ex.target_body_part}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-indigo-400">{ex.no_of_sets} Sets</p>
                    <p className="text-[9px] text-slate-500">{ex.reps} Reps</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border-t border-white/5 mt-4">
            <p className="text-lg font-black text-slate-600 uppercase italic">Rest Day</p>
            <p className="text-xs text-slate-500 mt-1">No workout assigned for {dayNames[parseInt(workoutDay)]}</p>
          </div>
        )}
      </GlassCard>

      {/* 🆔 DIGITAL IDENTITY MODAL */}
      <IdCardModal
        isOpen={idCardOpen}
        onClose={() => setIdCardOpen(false)}
        user={{ id: userId || '', name: name || '', ...myDetails }}
        portalType="trainer"
      />
    </div>
  );
};

export function TrainerPortalPages({ page }: { page: string }) {
  const { t } = useTranslation();

  if (page === "dashboard") return <TrainerDashboard />;
  if (page === "users") return <UserManagement portalType="trainer" />;
  if (page === "attendance") return <TrainerAttendance />;

  if (page === "profile") {
    const user = useAuthStore.getState();
    const fmtDate = (ts: number | null | undefined) =>
      ts ? new Date(Number(ts) * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
      <div className="space-y-4 md:space-y-6">
        <GlassCard className="p-6 md:p-10 border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]" />
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
            <div className="relative shrink-0">
              {user.profile_image_path ? (
                <img src={user.profile_image_path} alt={user.name || ""}
                  className="h-24 w-24 md:h-32 md:w-32 rounded-2xl md:rounded-3xl object-cover shadow-2xl shadow-indigo-500/30 border-2 border-indigo-500/30" />
              ) : (
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 to-orange-400 flex items-center justify-center text-3xl md:text-5xl font-black text-white shadow-2xl shadow-indigo-500/40">
                  {user.name?.[0]?.toUpperCase() || "T"}
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-indigo-500 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                {user.role || "trainer"}
              </span>
            </div>
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{user.name}</h2>
              {user.username && <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">{user.username}</p>}
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Personal Trainer</p>
              {user.joining_date && (
                <p className="text-[10px] text-slate-500 font-bold">
                  Member since {fmtDate(user.joining_date)}
                </p>
              )}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-3">Contact Information</h3>
            {[
              { label: "Full Name", value: user.name },
              { label: "Username", value: user.username },
              { label: "Email", value: user.email },
              { label: "Mobile", value: user.mobile },
              { label: "Address", value: user.address },
              { label: "Joining Date", value: fmtDate(user.joining_date) },
            ].map(({ label, value }) => (
              <div key={label} className="grid gap-0.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-sm text-white font-bold">{value || "—"}</p>
              </div>
            ))}
          </GlassCard>

          <GlassCard className="p-6 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-3">Professional Details</h3>
            {[
              { label: "Employee ID", value: user.id },
              { label: "Role", value: user.role },
              { label: "Specialization", value: user.metadata?.specialization },
              { label: "Experience", value: user.metadata?.experience ? `${user.metadata.experience} years` : null },
              { label: "Certifications", value: user.metadata?.certifications },
            ].map(({ label, value }) => (
              <div key={label} className="grid gap-0.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-sm text-white font-bold">{value || "—"}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    );
  }

  if (page === "workouts") {
    return (
      <GlassCard className="p-8">
        <SectionTitle
          title="Workout Protocols"
          subtitle="Design and assign high-performance training routines."
        />
        <div className="mt-8">
          <EmptyState
            title="Protocol Vault Empty"
            hint="Start by defining your first training methodology for members."
          />
        </div>
      </GlassCard>
    );
  }

  if (page === "diets") {
    return (
      <GlassCard className="p-8">
        <SectionTitle
          title="Nutritional Strategies"
          subtitle="Optimize member recovery and performance with tailored diet plans."
        />
        <div className="mt-8">
          <EmptyState
            title="Nutrition Archive Empty"
            hint="Create a meal blueprint to fuel member progress."
          />
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}
