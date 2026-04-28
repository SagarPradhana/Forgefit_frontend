import { Link } from "react-router-dom";
import { Dumbbell, Flame, Trophy, Users, Star } from "lucide-react";
import { PublicLayout } from "../../layouts/PublicLayout";
import { GlowButton, GlassCard } from "../../components/ui/primitives";
import { useTheme } from "../../components/ui/ThemeProvider";
import { motion } from "framer-motion";
import { AnimatedSection } from "../../components/common/AnimatedSection";
import { Counter } from "../../components/common/Counter";

const features = [
  {
    icon: Dumbbell,
    title: "Expert Coaching",
    detail: "Personalized training plans for every goal.",
  },
  {
    icon: Flame,
    title: "Proven Results",
    detail: "Track your progress and celebrate every win.",
  },
  {
    icon: Trophy,
    title: "Elite Facilities",
    detail: "Top-tier equipment and recovery spaces.",
  },
  {
    icon: Users,
    title: "Community Support",
    detail: "A welcoming environment that keeps you motivated.",
  },
];

const trainers = [
  {
    name: "Maya",
    role: "Strength Coach",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  },
  {
    name: "Noah",
    role: "Performance Trainer",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  },
  {
    name: "Ava",
    role: "Recovery Specialist",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b",
  },
];

const testimonials = [
  {
    quote: "The coaches make every session feel exciting and effective.",
    name: "Arianna",
  },
  {
    quote: "I saw real progress in strength and endurance in weeks.",
    name: "Daniel",
  },
  { quote: "Best gym environment I've ever trained in.", name: "Mei" },
];

export function HomePage() {
  const { currentTheme } = useTheme();

  return (
    <PublicLayout>
      <div className="relative isolate space-y-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background Blobs */}
        <div className="bg-blob bg-indigo-500/10 top-0 -left-20" />
        <div className="bg-blob bg-orange-500/10 bottom-0 -right-20" />
        <div className="bg-blob bg-purple-500/10 top-1/2 left-1/2 -translate-x-1/2" />

        <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center py-8 sm:py-10">
          <div className="space-y-6">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300"
            >
              Your strongest start
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight overflow-hidden">
                {"Transform Your Body".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="inline-block mr-3"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                  className="block relative bg-gradient-to-r from-indigo-400 to-orange-400 bg-clip-text text-transparent overflow-hidden"
                >
                  Build Strength
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                </motion.span>
              </h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="max-w-2xl text-sm sm:text-base leading-7 text-slate-300"
              >
                Train with expert coaches, track your performance, and unlock
                results faster with ForgeFit’s complete fitness experience.
              </motion.p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-3 sm:grid-cols-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.0, type: "spring", bounce: 0.4 }}
                >
                  <Link to="/contact">
                    <GlowButton className="w-full transition-transform hover:scale-105 active:scale-95 pulse-glow-hover">Join Now</GlowButton>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, type: "spring", bounce: 0.4 }}
                >
                  <Link to="/services">
                    <GlowButton variant="secondary" className="w-full transition-all hover:scale-105 hover:bg-white/10 active:scale-95">
                      Explore
                    </GlowButton>
                  </Link>
                </motion.div>
              </div>
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-center"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Trusted by
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-400">
                  <Counter from={0} to={2840} suffix="+" />
                </p>
                <p className="text-sm text-slate-300">active members</p>
              </motion.div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: 42, label: "Trainers" },
                { value: 11, label: "Years" },
                { value: 95, label: "Success Rate", suffix: "%" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <GlassCard className="p-5 text-center group hover:-translate-y-1.5 transition-all duration-300 hover:border-l-[3px] hover:border-l-orange-500 hover:shadow-glow">
                    <p className="text-2xl font-bold text-orange-400">
                      <Counter from={0} to={item.value} suffix={item.suffix} />
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl"
          >
            <motion.div
              animate={{ translateY: [-6, 0, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80"
                alt="Gym workout"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-black/50 p-5 backdrop-blur-sm"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                Featured program
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">
                12 Week Transformation
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                A results-driven plan with coaching, nutrition, and
                accountability.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between overflow-hidden">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                {"Why choose ForgeFit".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, duration: 0.1 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </p>
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-2 text-3xl font-bold text-white"
              >
                Built to help you stay consistent.
              </motion.h2>
            </div>
            <Link
              to="/pricing"
              className="text-sm font-semibold text-indigo-300 hover:text-white transition group"
            >
              View Memberships
              <motion.span
                className="inline-block ml-1"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ y: 60, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <GlassCard
                    className="p-6 hover:-translate-y-2 transition-all duration-300 group hover:border-t-[3px] hover:border-t-orange-500 hover:bg-white/5 hover:shadow-glow"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 mb-4"
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {feature.detail}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <AnimatedSection>
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                  Meet our team
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Train with trusted coaches.
                </h2>
              </div>
              <Link
                to="/about"
                className="text-sm font-semibold text-indigo-300 hover:text-white transition group"
              >
                Learn about our trainers
                <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trainers.map((trainer) => (
                <GlassCard key={trainer.name} className="overflow-hidden p-0 group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`${trainer.image}?auto=format&fit=crop&w=900&q=80`}
                      alt={trainer.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <p className="text-lg font-semibold">{trainer.name}</p>
                      <p className="text-sm text-slate-300">{trainer.role}</p>
                    </div>
                    <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                  Transformations
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  See the change members are making.
                </h2>
              </div>
              <Link
                to="/testimonials"
                className="text-sm font-semibold text-indigo-300 hover:text-white transition group"
              >
                Read success stories
                <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c",
                "https://images.unsplash.com/photo-1526401281623-5c45e2b8c430",
                "https://images.unsplash.com/photo-1549187774-b4e9a35c5f22",
              ].map((src, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70"
                >
                  <img
                    src={`${src}?auto=format&fit=crop&w=900&q=80`}
                    alt="Transformation"
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                      Before / After
                    </p>
                    <p className="mt-3 text-lg font-semibold">See the progress</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                  Testimonials
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  What members are saying.
                </h2>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {testimonials.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg group">
                    <div className="flex gap-2 text-orange-400 mb-4">
                      {[...Array(5)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (i * 0.1) + (index * 0.1) }}
                        >
                          <Star size={16} fill="currentColor" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm leading-7 text-slate-300 italic">
                      “{item.quote}”
                    </p>
                    <p className="mt-4 text-sm font-semibold text-white">
                      {item.name}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
              Ready to begin?
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
              Start Your Fitness Journey Today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Join ForgeFit and get access to expert coaching, premium training,
              and a community that helps you stay consistent.
            </p>
            <Link to="/contact">
              <GlowButton className="mt-8 px-8 py-3 transition-transform hover:scale-105 active:scale-95 pulse-glow-hover">Join ForgeFit</GlowButton>
            </Link>
          </section>
        </AnimatedSection>
      </div>
    </PublicLayout>
  );
}