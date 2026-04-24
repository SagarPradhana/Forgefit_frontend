import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Clock, LogIn, LogOut, CheckCircle2 } from "lucide-react";
import { GlassCard } from "../components/ui/primitives";

export function AttendanceCalendar({ data }: any) {
  const { t } = useTranslation();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const attendanceMap: Record<string, any> = {};
  data.forEach((d: any) => {
    const day = d.date.split("-")[2];
    attendanceMap[day] = d;
  });

  return (
    <GlassCard className="p-8 shadow-2xl relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
      
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} className="text-indigo-400" />
          {t("attendanceStatus")}
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            {t("verifiedPresent")}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-slate-700" />
            {t("markedAbsent")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4">
        {days.map((day) => {
          const key = String(day).padStart(2, "0");
          const record = attendanceMap[key];

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative h-24 sm:h-28 rounded-xl sm:rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center p-1 sm:p-2
                ${record 
                  ? "bg-gradient-to-br from-indigo-500/20 to-orange-400/20 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                  : "bg-white/5 border-white/5 text-slate-600 hover:border-white/10"
                }`}
            >
              {/* DATE NUMBER */}
              <span className={`absolute top-1.5 left-2 sm:top-2 sm:left-3 text-[8px] sm:text-xs font-black tracking-tighter ${record ? "text-indigo-300" : "text-slate-700"}`}>
                {day}
              </span>

              {/* DATA POINT */}
              {record ? (
                <div className="flex flex-col items-center gap-1 sm:gap-2 mt-2 w-full">
                  <div className="flex flex-col items-center group">
                    <span className="text-[7px] sm:text-[10px] font-black text-white/90 tracking-tighter flex items-center gap-0.5 sm:gap-1">
                      <LogIn size={8} className="text-emerald-400 sm:w-[10px] sm:h-[10px]" />
                      {record.checkIn}
                    </span>
                    <span className="text-[7px] sm:text-[10px] font-black text-white/50 tracking-tighter flex items-center gap-0.5 sm:gap-1">
                      <LogOut size={8} className="text-orange-400 sm:w-[10px] sm:h-[10px]" />
                      {record.checkOut}
                    </span>
                  </div>
                  <CheckCircle2 size={10} className="text-emerald-400 sm:w-[12px] sm:h-[12px] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                </div>
              ) : (
                <div className="h-1 w-1 rounded-full bg-slate-800" />
              )}

              {/* ACTIVE GLOW */}
              {record && (
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 animate-pulse -z-10" />
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

