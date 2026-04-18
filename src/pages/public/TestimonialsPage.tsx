import { motion } from "framer-motion";
import { testimonials } from "../../data/mockData";
import { GlassCard, SectionTitle } from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Star, PlayCircle } from "lucide-react";

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
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
              Member Success
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Real People. Real Transformations.
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base leading-7 text-slate-300">
              Hear from members who changed their habits, improved their
              fitness, and found a stronger version of themselves at ForgeFit.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "4.9/5", label: "Average Rating" },
                { value: "500+", label: "Happy Members" },
                { value: "95%", label: "Success Rate" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-center"
                >
                  <p className="text-xl font-semibold text-orange-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </p>
                </div>
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
            {testimonials.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.03 }}>
                <GlassCard className="h-full p-6 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="sm:w-5 sm:h-5"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base leading-7 text-slate-200">
                      “{item.quote}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">Gym Member</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/10 text-orange-300 grid place-items-center text-xl font-bold">
                      {item.name.charAt(0)}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            title="Transformation Stories"
            subtitle="Before and after journeys powered by consistency."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {caseStudies.map((story) => (
              <GlassCard key={story.title} className="overflow-hidden p-0">
                <div className="relative h-56 bg-[linear-gradient(180deg,rgba(15,23,42,0.25),rgba(15,23,42,0.85))]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558611848-73f7eb4001c4?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-80" />
                  <div className="absolute inset-0 bg-slate-950/60" />
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
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            title="Watch Our Members"
            subtitle="See the experience in action with real video stories."
          />
          <GlassCard className="relative overflow-hidden p-0">
            <div className="relative h-64 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.9))]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526401485004-1590fbb9d7a6?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-80" />
              <div className="absolute inset-0 bg-slate-950/70" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center text-white px-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-orange-300 shadow-lg">
                  <PlayCircle className="h-10 w-10" />
                </div>
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

        <section>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { value: "4.9/5", label: "Average Rating" },
              { value: "500+", label: "Happy Members" },
              { value: "1200+", label: "Transformations" },
              { value: "95%", label: "Success Rate" },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-6 text-center">
                <p className="text-3xl font-bold text-orange-400">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="text-center">
          <GlassCard className="mx-auto max-w-2xl p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-300">
              Your story starts here
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
              Be the next member to transform with ForgeFit.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Join today and take the first step toward stronger habits, better
              health, and lasting fitness.
            </p>
            <button className="mt-6 rounded-full bg-gradient-to-r from-indigo-500 to-orange-400 px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.25)] transition hover:scale-105">
              Join Now
            </button>
          </GlassCard>
        </section>
      </motion.div>
    </PublicLayout>
  );
}
