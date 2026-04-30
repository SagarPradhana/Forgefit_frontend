import { motion } from "framer-motion";
import { Check, Zap, ShieldCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GlassCard, GlowButton } from "../components/ui/primitives";
import clsx from "clsx";
import { useGymStore } from "../store/gymStore";
import { getCurrencySymbol } from "../utils/currency";

const getDurationLabel = (months: number) => {
  if (!months) return "1 Month";
  if (months === 1) return "1 Month";
  if (months === 3) return "3 Months";
  if (months === 6) return "6 Months";
  if (months === 12) return "1 Year";
  return `${months} Months`;
};

export function SubscriptionCard({
  plan,
  currentPlan,
  onSelect,
  highlight,
}: any) {
  const { t } = useTranslation();
  const { appConfig } = useGymStore();
  const currency = appConfig?.currency || "USD";
  const currencySymbol = getCurrencySymbol(currency);
  const isCurrent = plan.name === currentPlan;

  // Dynamic styling based on plan type
  const isElite = plan.name?.toLowerCase().includes("elite");
  const borderGradient = isElite
    ? "border-amber-500/30 shadow-amber-500/10"
    : highlight
      ? "border-indigo-500/30 shadow-indigo-500/10"
      : "border-emerald-500/30 shadow-emerald-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative h-full"
    >
      <GlassCard
        className={clsx(
          "h-full p-8 flex flex-col justify-between relative transition-all duration-500 overflow-hidden",
          borderGradient,
          isCurrent && "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
        )}
      >
        {/* --- DECORATIVE GLOW --- */}
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-16 -mt-16 rounded-full ${isElite ? "bg-amber-500" : highlight ? "bg-indigo-500" : "bg-emerald-500"
          }`} />

        {/* --- TIER BADGE --- */}
        {highlight && !isCurrent && (
          <div className="absolute top-4 right-4 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
            <Zap size={12} fill="currentColor" /> Popular Choice
          </div>
        )}

        {isCurrent && (
          <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg group">
            <ShieldCheck size={12} fill="currentColor" className="animate-pulse" /> {t("activePlan")}
          </div>
        )}

        {isElite && !isCurrent && !highlight && (
          <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
            <Star size={12} fill="currentColor" /> Ultimate
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${isElite ? "bg-amber-500/10 border-amber-500/20 shadow-amber-500/20"
                : highlight ? "bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20"
              } shadow-inner`}>
              {isElite ? <Star className="text-amber-400" /> : highlight ? <Zap className="text-indigo-400" /> : <ShieldCheck className="text-emerald-400" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none">{plan.name}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{plan.duration_in_months} {plan.duration_in_months === 1 ? "Month" : "Months"}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white italic tracking-tighter">{currencySymbol}{plan.price}</span>
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">/{getDurationLabel(plan.duration_in_months)}</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2 leading-relaxed">
              Unlock professional gym equipment and specialized training zones with this tier.
            </p>
          </div>

          {/* --- FEATURES LIST --- */}
          <div className="space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
            <ul className="space-y-3">
              {plan.features?.map((f: string) => (
                <li key={f} className="flex items-center gap-3 group/item">
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${isCurrent ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/5 border border-white/10 group-hover/item:border-white/20"
                    }`}>
                    <Check size={12} className={isCurrent ? "text-emerald-400" : "text-white/40 group-hover/item:text-white"} />
                  </div>
                  <span className={`text-[13px] font-bold transition-colors ${isCurrent ? "text-white" : "text-slate-400 group-hover/item:text-slate-200"
                    }`}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- ACTION BUTTON --- */}
        <div className="mt-10 relative z-10">
          <GlowButton
            className={clsx(
              "w-full h-12 text-xs font-black uppercase tracking-widest transition-all",
              isCurrent ? "bg-emerald-500/10 border-emerald-500/20 !text-emerald-400 cursor-default shadow-none" : ""
            )}
            onClick={() => !isCurrent && onSelect(plan)}
          >
            {isCurrent ? "Current Plan Active" : "Choose Strategy"}
          </GlowButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

