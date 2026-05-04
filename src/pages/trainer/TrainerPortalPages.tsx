import { useTranslation } from "react-i18next";
import {
  GlassCard,
  SectionTitle,
  Skeleton,
  EmptyState,
} from "../../components/ui/primitives";
import { UserManagement } from "../../components/admin/UserManagement";
import { AttendanceManagement } from "../../components/admin/AttendanceManagement";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Users, ClipboardList, Activity, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const TrainerDashboard = () => {
  const { name } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* ── HERO SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-1 rounded-[2.5rem] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-orange-500/20 shadow-2xl"
      >
        <div className="bg-slate-950/90 backdrop-blur-2xl px-10 py-12 rounded-[2.3rem] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -mr-48 -mt-48" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 relative z-10">
            <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-[3px] shadow-2xl shadow-indigo-500/30">
              <div className="h-full w-full bg-slate-950 rounded-[1.8rem] flex items-center justify-center text-3xl font-black text-white italic">
                {name?.[0]?.toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Trainer Portal</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter leading-none mb-4">
                COACH {name?.toUpperCase()}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Activity size={14} className="text-emerald-400" /> 8 Sessions Today
                </span>
                <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Users size={14} className="text-indigo-400" /> 12 Active Clients
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "New Assignments", value: "05", icon: Users, color: "bg-indigo-500", delay: 0.1 },
          { label: "Completion Rate", value: "94%", icon: Activity, color: "bg-emerald-500", delay: 0.2 },
          { label: "Avg Session Time", value: "45m", icon: Clock, color: "bg-purple-500", delay: 0.3 },
          { label: "Protocol Updates", value: "03", icon: ClipboardList, color: "bg-orange-500", delay: 0.4 },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stat.delay }}
            className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-all cursor-pointer"
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

      {/* ── ACTION CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-8 group hover:bg-indigo-500/5 transition-all cursor-pointer" onClick={() => navigate("/trainer/workouts")}>
          <div className="flex items-center justify-between mb-6">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <ClipboardList size={28} />
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Training Protocols</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Design specialized workout routines and manage intensity levels for your assigned athletes.</p>
        </GlassCard>

        <GlassCard className="p-8 group hover:bg-orange-500/5 transition-all cursor-pointer" onClick={() => navigate("/trainer/diets")}>
          <div className="flex items-center justify-between mb-6">
            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <ClipboardList size={28} />
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-2 transition-all" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Nutrition Blueprints</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Customize meal plans and supplement schedules to fuel performance and recovery goals.</p>
        </GlassCard>
      </div>
    </div>
  );
};

export function TrainerPortalPages({ page }: { page: string }) {
  const { t } = useTranslation();

  if (page === "dashboard") return <TrainerDashboard />;
  if (page === "users") return <UserManagement />;
  if (page === "attendance") return <AttendanceManagement />;

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
