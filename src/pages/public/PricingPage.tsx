import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GlowButton,
  GlassCard,
  SectionTitle,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { useGymStore } from "../../store/gymStore";
import { Check, Crown, ShieldCheck } from "lucide-react";

export function PricingPage() {
  const plans = useGymStore((s) => s.plans);
  const allFeatures = Array.from(
    new Set(plans.flatMap((plan) => plan.features)),
  );

  return (
    <PublicLayout>
      <div className="space-y-14 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_35%)] opacity-90 pointer-events-none" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_0.9fr] items-center">
            <div className="space-y-4 max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300 shadow-sm">
                Premium Memberships
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Pricing plans built to fit your goals and lifestyle.
              </h1>
              <p className="max-w-xl text-sm sm:text-base leading-7 text-slate-300">
                Choose the right membership for your routine, whether you're
                just getting started or training like an athlete. Every plan
                includes access to our full gym, modern equipment, and
                supportive coaching.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Gym Access", value: "24/7" },
                  { label: "Trainers", value: "Expert-led" },
                  { label: "Support", value: "Easy signup" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-center"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl">
              <p className="text-sm text-orange-300 uppercase tracking-[0.3em]">
                Find your best fit
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Flexible options for every fitness stage.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Each plan is designed to scale with you. Start with the
                essentials, upgrade to guided training, or unlock premium
                recovery and coaching.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Starter</p>
                  <p className="mt-2">
                    Best for new members learning the basics.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Elite</p>
                  <p className="mt-2">
                    Ideal for high-performing athletes and recovery focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle
            title="Choose Your Plan"
            subtitle="Transparent pricing with clear benefits at every level."
          />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {plans.map((plan, index) => {
              const isPopular = index === 1;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-orange-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-xl">
                      <Crown size={14} /> Most Popular
                    </div>
                  )}
                  <GlassCard
                    className={`h-full overflow-hidden p-6 transition ${
                      isPopular
                        ? "border-orange-400/30 shadow-[0_24px_80px_rgba(249,115,22,0.22)]"
                        : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">
                          {plan.name}
                        </p>
                        <ShieldCheck className="h-5 w-5 text-slate-400" />
                      </div>

                      <div>
                        <p className="text-4xl font-bold text-white">
                          ${plan.price}
                        </p>
                        <p className="text-sm text-slate-400">
                          per {plan.duration.toLowerCase()}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {plan.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3 text-sm text-slate-300"
                          >
                            <Check className="h-4 w-4 text-emerald-400" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link to="/signin" className="mt-6 block">
                      <GlowButton className="w-full py-3">
                        Choose Plan
                      </GlowButton>
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "No Hidden Fees",
                description: "What you see is what you pay.",
              },
              {
                title: "Cancel Anytime",
                description: "Flexible memberships with no surprises.",
              },
              {
                title: "Secure Payments",
                description: "Your billing is encrypted and protected.",
              },
            ].map((item) => (
              <GlassCard key={item.title} className="p-6 text-center">
                <p className="text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-3 text-sm text-slate-300">
                  {item.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            title="Plan Comparison"
            subtitle="See what each membership includes at a glance."
          />
          <GlassCard className="overflow-x-auto p-4 sm:p-6">
            <table className="min-w-[700px] w-full border-collapse text-left text-xs sm:text-sm text-slate-300">
              <thead>
                <tr className="text-slate-400">
                  <th className="border-b border-white/10 px-4 py-3">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="border-b border-white/10 px-4 py-3 text-center"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr
                    key={feature}
                    className={
                      index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                    }
                  >
                    <td className="border-b border-white/10 px-4 py-3 text-slate-200">
                      {feature}
                    </td>
                    {plans.map((plan) => (
                      <td
                        key={plan.id}
                        className="border-b border-white/10 px-4 py-3 text-center"
                      >
                        {plan.features.includes(feature) ? (
                          <span className="inline-flex items-center justify-center rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-300">
                            ✓
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </section>

        <section className="text-center">
          <GlassCard className="mx-auto max-w-2xl p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-300">
              Ready to commit?
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
              Choose the plan that fits your goals and start stronger today.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Get access to the gym, premium coaching, and a supportive
              community with a membership built for your progress.
            </p>
            <Link to="/signin">
              <GlowButton className="mt-6 px-8 py-3">Get Started</GlowButton>
            </Link>
          </GlassCard>
        </section>
      </div>
    </PublicLayout>
  );
}
