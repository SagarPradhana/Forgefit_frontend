import { GlassCard, GlowButton } from "../components/ui/primitives";
import { Check, Crown } from "lucide-react";
import clsx from "clsx";

export function SubscriptionCard({
  plan,
  currentPlan,
  onSelect,
  highlight,
}: any) {
  const isCurrent = plan.name === currentPlan;

  return (
    <GlassCard
      className={clsx(
        "p-6 flex flex-col justify-between relative transition",
        highlight &&
          "border-orange-400/40 shadow-[0_0_30px_rgba(249,115,22,0.3)] scale-105",
      )}
    >
      {/* 🔥 BADGE */}
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-orange-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <Crown size={12} /> Popular
        </div>
      )}

      <div>
        <p className="text-lg font-semibold">{plan.name}</p>
        <p className="text-3xl font-bold mt-2">
          ${plan.price}
          <span className="text-sm text-slate-400">/month</span>
        </p>

        {/* FEATURES */}
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {plan.features?.map((f: string) => (
            <li key={f} className="flex items-center gap-2">
              <Check size={14} className="text-green-400" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* ACTION */}
      <GlowButton
        className="mt-6 w-full"
        disabled={isCurrent}
        onClick={() => onSelect(plan)}
      >
        {isCurrent ? "Current Plan" : "Choose Plan"}
      </GlowButton>
    </GlassCard>
  );
}
