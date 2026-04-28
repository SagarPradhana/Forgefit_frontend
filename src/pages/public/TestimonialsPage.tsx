import { motion } from "framer-motion";
import { testimonials } from "../../data/mockData";
import { GlassCard, SectionTitle } from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Star, PlayCircle } from "lucide-react";
import { AnimatedSection } from "../../components/common/AnimatedSection";
import { Counter } from "../../components/common/Counter";

const caseStudies = [
  {
    title: "Arianna",
    subtitle: "Lean muscle transformation",
    description:
      "6 weeks of consistent training and tailored nutrition helped Arianna gain strength and confidence.",
  },
  {
    title: "Daniel",
    subtitle: "Performance upgrade",
    description:
      "Upgraded his routine with guided coaching and hit new personal bests every month.",
  },
  {
    title: "Mei",
    subtitle: "Sustainable fat loss",
    description:
      "Smart training and recovery helped Mei stay motivated and achieve lasting results.",
  },
];

export function TestimonialsPage() {
  return (
    <PublicLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-14 px-4 sm:px-6 lg:px-8"
      >
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_40%)]" />
          <div className="relative z-10 space-y-5">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm uppercase tracking-[0.3em] text-orange-300"
            >
              Member Success
            </motion.p>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            >
              Real People. Real Transformations.
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto max-w-2xl text-sm sm:text-base leading-7 text-slate-300"
            >
              Hear from members who changed their habits, improved their
              fitness, and found a stronger version of themselves at ForgeFit.
            </motion.p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: 4.9, label: "Average Rating", suffix: "/5" },
                { value: 500, label: "Happy Members", suffix: "+" },
                { value: 95, label: "Success Rate", suffix: "%" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-center"
                >
                  <p className="text-xl font-semibold text-orange-400">
                    <Counter from={0} to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle
            title="What Our Members Say"
            subtitle="Real feedback from people who love the ForgeFit experience."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div 
                key={item.name}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="h-full p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow group">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (index * 0.1) + (i * 0.1) }}
                        >
                          <Star
                            size={16}
                            className="sm:w-5 sm:h-5"
                            fill="currentColor"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm sm:text-base leading-7 text-slate-200 italic">
                      “{item.quote}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-white transition-colors group-hover:text-orange-300">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">Gym Member</p>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-orange-300 grid place-items-center text-xl font-bold transition-all duration-300 group-hover:border-orange-500/50"
                    >
                      {item.name.charAt(0)}
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <AnimatedSection>
          <section>
            <SectionTitle
              title="Transformation Stories"
              subtitle="Before and after journeys powered by consistency."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {caseStudies.map((story, i) => (
                <motion.div
                  key={story.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="overflow-hidden p-0 group">
                    <div className="relative h-56 overflow-hidden">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558611848-73f7eb4001c4?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" 
                      />
                      <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/40 transition-colors duration-500" />
                      <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
                        <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                          {story.subtitle}
                        </p>
                        <h3 className="mt-3 text-xl font-semibold">
                          {story.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-200">
                          {story.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section>
            <SectionTitle
              title="Watch Our Members"
              subtitle="See the experience in action with real video stories."
            />
            <GlassCard className="relative overflow-hidden p-0 group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526401485004-1590fbb9d7a6?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" 
                />
                <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/50 transition-colors" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center text-white px-6">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-orange-300 shadow-lg"
                  >
                    <PlayCircle className="h-10 w-10" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-semibold">
                      Member Story Spotlight
                    </p>
                    <p className="mt-2 text-sm text-slate-300 max-w-xl">
                      Tune in to a short testimonial and feel the difference
                      ForgeFit members experience every day.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { value: 4.9, label: "Average Rating", suffix: "/5" },
                { value: 500, label: "Happy Members", suffix: "+" },
                { value: 1200, label: "Transformations", suffix: "+" },
                { value: 95, label: "Success Rate", suffix: "%" },
              ].map((stat, i) => (
                <GlassCard key={stat.label} className="p-6 text-center hover:border-orange-500/50 transition-colors">
                  <p className="text-3xl font-bold text-orange-400">
                    <Counter from={0} to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="text-center">
            <GlassCard className="mx-auto max-w-2xl p-8 sm:p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-xs uppercase tracking-[0.3em] text-orange-300 relative z-10">
                Your story starts here
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white relative z-10">
                Be the next member to transform with ForgeFit.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 relative z-10">
                Join today and take the first step toward stronger habits, better
                health, and lasting fitness.
              </p>
              <button className="mt-6 relative z-10 rounded-full bg-gradient-to-r from-indigo-500 to-orange-400 px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.25)] transition-all hover:scale-105 hover:shadow-glow active:scale-95 pulse-glow-hover">
                Join Now
              </button>
            </GlassCard>
          </section>
        </AnimatedSection>
      </motion.div>
    </PublicLayout>
  );
}
