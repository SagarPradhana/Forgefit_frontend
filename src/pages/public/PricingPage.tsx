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
import { AnimatedSection } from "../../components/common/AnimatedSection";
import { Counter } from "../../components/common/Counter";

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
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300 shadow-sm"
              >
                Premium Memberships
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              >
                Pricing plans built to fit your goals and lifestyle.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-xl text-sm sm:text-base leading-7 text-slate-300"
              >
                Choose the right membership for your routine, whether you're
                just getting started or training like an athlete. Every plan
                includes access to our full gym, modern equipment, and
                supportive coaching.
              </motion.p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Gym Access", value: "24/7" },
                  { label: "Trainers", value: "Expert-led" },
                  { label: "Support", value: "Easy signup" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-center"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl"
            >
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
            </motion.div>
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
                  initial={{ y: 80, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.7 }}
                  whileHover={{ y: -10, scale: isPopular ? 1.05 : 1.02 }}
                  className="relative"
                >
                  {isPopular && (
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-orange-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-xl"
                    >
                      <Crown size={14} /> Most Popular
                    </motion.div>
                  )}
                  <GlassCard
                    className={`h-full overflow-hidden p-6 transition-all duration-500 ${
                      isPopular
                        ? "border-orange-400/40 shadow-[0_24px_80px_rgba(249,115,22,0.25)] scale-[1.03]"
                        : "hover:border-indigo-400/30"
                    }`}
                  >
                    {isPopular && (
                       <motion.div 
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-orange-500/10 pointer-events-none"
                       />
                    )}
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">
                          {plan.name}
                        </p>
                        <ShieldCheck className="h-5 w-5 text-slate-400" />
                      </div>

                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-white">$</span>
                          <span className="text-5xl font-bold text-white">
                            <Counter from={0} to={plan.price} />
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          per {plan.duration.toLowerCase()}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (index * 0.15) + (i * 0.05) }}
                            className="flex items-center gap-3 text-sm text-slate-300"
                          >
                            <Check className="h-4 w-4 text-emerald-400" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <Link to="/signin" className="mt-6 block relative z-10">
                      <GlowButton className="w-full py-3 overflow-hidden group">
                        <span className="relative z-10">Choose Plan</span>
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                        />
                      </GlowButton>
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <AnimatedSection>
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
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 text-center hover:border-orange-500/30 transition-colors">
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-3 text-sm text-slate-300">
                      {item.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section>
            <SectionTitle
              title="Plan Comparison"
              subtitle="See what each membership includes at a glance."
            />
            <GlassCard className="overflow-x-auto p-4 sm:p-6 hover:shadow-indigo-500/10 transition-shadow">
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
                    <motion.tr
                      key={feature}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.02 }}
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
                            <motion.span 
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              className="inline-flex items-center justify-center rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-300"
                            >
                              ✓
                            </motion.span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="text-center">
            <GlassCard className="mx-auto max-w-2xl p-8 sm:p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-xs uppercase tracking-[0.3em] text-orange-300 relative z-10">
                Ready to commit?
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white relative z-10">
                Choose the plan that fits your goals and start stronger today.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 relative z-10">
                Get access to the gym, premium coaching, and a supportive
                community with a membership built for your progress.
              </p>
              <Link to="/signin" className="relative z-10">
                <GlowButton className="mt-6 px-8 py-3 transition-transform hover:scale-105 active:scale-95 pulse-glow-hover">Get Started</GlowButton>
              </Link>
            </GlassCard>
          </section>
        </AnimatedSection>
      </div>
    </PublicLayout>
  );
}
