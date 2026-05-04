import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PublicLayout } from "../../layouts/PublicLayout";
import { useGymStore } from "../../store/gymStore";
import { Check, Crown, ShieldCheck, Users } from "lucide-react";
import { Counter } from "../../components/common/Counter";

export function PricingPage() {
  const { publicSubscriptionPlans } = useGymStore();

  const plans = publicSubscriptionPlans.length > 0
    ? publicSubscriptionPlans.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      duration: `${p.duration_in_months} Month${p.duration_in_months > 1 ? 's' : ''}`,
      features: p.description.split(',').map(f => f.trim()), // Assuming features are comma-separated in description
    }))
    : useGymStore((s) => s.plans);

  const allFeatures = Array.from(
    new Set(plans.flatMap((plan) => plan.features)),
  );

  return (
    <PublicLayout>
      <div className="relative isolate min-h-screen overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="bg-mesh" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-badge"
            >
              Elite Access Plans
            </motion.div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-[0.9]">
              INVEST IN <br /><span className="text-cinematic">YOUR EVOLUTION</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
              Transparent pricing designed for every stage of your journey. No hidden fees, just pure performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, index) => {
              const isPopular = index === 1;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative group"
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-glow">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className={`glass-panel p-8 h-full flex flex-col relative overflow-hidden transition-all duration-500 ${isPopular ? 'border-orange-500/40 ring-1 ring-orange-500/20 shadow-glow' : ''}`}>
                    {isPopular && <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />}

                    <div className="mb-8">
                      <p className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-4">{plan.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">₹<Counter from={0} to={plan.price} /></span>
                        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">/ {plan.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10 flex-grow">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-1 w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-orange-400" />
                          </div>
                          <span className="text-sm text-slate-300 leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link to="/signin">
                      <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${isPopular ? 'btn-premium' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                        Select Plan
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Comparison Table */}
          <section className="py-20 border-t border-white/5">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">FEATURE COMPARISON</h2>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/5">Features</th>
                      {plans.map(plan => (
                        <th key={plan.id} className="px-8 py-6 text-xs font-black text-white uppercase tracking-widest border-b border-white/5 text-center">{plan.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allFeatures.map((feature, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5 text-sm font-bold text-slate-300">{feature}</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="px-8 py-5 text-center">
                            {plan.features.includes(feature) ? (
                              <div className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                                <Check size={14} />
                              </div>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQ or Trust Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stat-card">
              <ShieldCheck className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">SECURE BILLING</h3>
              <p className="text-slate-400 text-sm">Enterprise-grade encryption for all your transactions and data.</p>
            </div>
            <div className="stat-card">
              <Crown className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">ELITE PERKS</h3>
              <p className="text-slate-400 text-sm">Members get exclusive access to events and premium recovery gear.</p>
            </div>
            <div className="stat-card">
              <Users className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">NO CONTRACTS</h3>
              <p className="text-slate-400 text-sm">Flexible memberships that adapt to your evolving lifestyle.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
