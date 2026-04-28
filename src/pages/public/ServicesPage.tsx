import { motion } from "framer-motion";
import { facilities, services } from "../../data/mockData";
import {
  GlassCard,
  SectionTitle,
  CommonButton,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import {
  Flame,
  HeartPulse,
  Dumbbell,
  Apple,
  Timer,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import heroImage from "../../assets/hero.png";
import { AnimatedSection } from "../../components/common/AnimatedSection";
import { Counter } from "../../components/common/Counter";

const trainingPrograms = [
  { title: "Fat Loss", subtitle: "Lean, sustainable progress", icon: Flame },
  { title: "Muscle Gain", subtitle: "Strength built with smart coaching", icon: Dumbbell },
  { title: "Cardio Fitness", subtitle: "Endurance training for every level", icon: HeartPulse },
];

const categories = ["Strength Training", "HIIT", "Yoga & Mobility", "CrossFit"];

const benefits = [
  { icon: Apple, label: "Personalized Diet Plans" },
  { icon: Timer, label: "24/7 Access" },
  { icon: Dumbbell, label: "Modern Equipment" },
];

export function ServicesPage() {
  return (
    <PublicLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-14 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <section className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 xl:max-w-xl">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
            >
              <Sparkles className="h-4 w-4 text-orange-300" />
              Trusted training, recovery, and coaching for every fitness goal
            </motion.div>
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            >
              Everything you need to reach your strongest self.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl text-sm sm:text-base leading-7 text-slate-300"
            >
              ForgeFit combines expert coaching, premium equipment, and a welcoming gym experience so every member can train with confidence and stay motivated.
            </motion.p>
            <div className="flex flex-wrap gap-3">
              <CommonButton type="button" className="pulse-glow-hover">Explore Memberships</CommonButton>
              <CommonButton type="button" variant="ghost" className="text-slate-100 hover:bg-white/10">
                Book a Free Session
              </CommonButton>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <GlassCard className="p-4 text-center group hover:border-orange-500/50 transition-colors">
                <p className="text-2xl font-bold text-orange-400">
                  <Counter from={0} to={500} suffix="+" />
                </p>
                <p className="mt-1 text-xs text-slate-300">Active Members</p>
              </GlassCard>
              <GlassCard className="p-4 text-center group hover:border-orange-500/50 transition-colors">
                <p className="text-2xl font-bold text-orange-400">
                  <Counter from={0} to={50} suffix="+" />
                </p>
                <p className="mt-1 text-xs text-slate-300">Expert Trainers</p>
              </GlassCard>
              <GlassCard className="p-4 text-center group hover:border-orange-500/50 transition-colors">
                <p className="text-2xl font-bold text-orange-400">
                  <Counter from={0} to={95} suffix="%" />
                </p>
                <p className="mt-1 text-xs text-slate-300">Satisfaction Rate</p>
              </GlassCard>
            </div>
          </div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
          >
            <img
              src={heroImage}
              alt="Gym interior and equipment"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent px-6 py-5 text-slate-100">
              <p className="text-sm font-semibold">Premium studio environment</p>
              <p className="text-xs text-slate-300">
                Modern equipment paired with motivating spaces that help you stay consistent.
              </p>
            </div>
          </motion.div>
        </section>

        <AnimatedSection>
          <section className="space-y-5">
            <SectionTitle title="Core Services" subtitle="Structured support across every training phase." />
            <div className="grid gap-4 xl:grid-cols-2">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ x: index % 2 === 0 ? -60 : 60, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <GlassCard className="group overflow-hidden p-6 hover:bg-white/5 transition-all duration-300 relative">
                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:-translate-y-1 transition-transform">{service.title}</p>
                        <p className="mt-3 text-sm text-slate-300">{service.description}</p>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300 transition-all duration-300 group-hover:bg-orange-400/20 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="space-y-5">
            <SectionTitle title="Training Programs" subtitle="Choose the goal that fits your lifestyle." />
            <div className="grid gap-4 md:grid-cols-3">
              {trainingPrograms.map((program, i) => (
                <motion.div
                  key={program.title}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 text-center hover:border-orange-500/50 transition-colors group">
                    <program.icon className="mx-auto mb-4 h-10 w-10 text-orange-400 transition-transform group-hover:scale-110" />
                    <h3 className="text-lg font-semibold text-white">{program.title}</h3>
                    <p className="mt-3 text-sm text-slate-300">{program.subtitle}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="space-y-5">
            <SectionTitle title="Workout Categories" subtitle="A variety of classes and sessions for every routine." />
            <div className="grid gap-3 md:grid-cols-4">
              {categories.map((category, i) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="p-4 text-center hover:bg-orange-500/10 transition-colors">
                    <p className="text-sm font-semibold text-white">{category}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="space-y-5">
            <SectionTitle title="Premium Facilities" subtitle="Comfort, access, and recovery under one roof." />
            <div className="grid gap-4 md:grid-cols-3">
              {facilities.map((facility, i) => (
                <motion.div
                  key={facility}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="p-5 text-center hover:border-indigo-500/50 transition-colors">
                    <p className="text-sm text-slate-200">{facility}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="space-y-5">
            <SectionTitle title="Membership Benefits" subtitle="Everything included to support your progress." />
            <div className="grid gap-4 md:grid-cols-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.label}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-5 text-center hover:border-orange-500/50 transition-colors group">
                    <benefit.icon className="mx-auto mb-3 h-8 w-8 text-indigo-400 transition-transform group-hover:scale-110" />
                    <p className="text-sm text-slate-200">{benefit.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section>
            <GlassCard className="rounded-[2rem] p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300 relative z-10">Not sure where to start?</p>
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl relative z-10">
                We’ll help you find the right program for your goals.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 relative z-10">
                Whether you want fat loss, muscle gain, or more endurance, our
                team will guide you with a plan that fits your life.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 relative z-10">
                <CommonButton type="button" className="pulse-glow-hover">Book a Free Consultation</CommonButton>
                <CommonButton
                  type="button"
                  variant="ghost"
                  className="text-slate-100 hover:bg-white/10"
                >
                  View Pricing
                </CommonButton>
              </div>
            </GlassCard>
          </section>
        </AnimatedSection>
      </motion.div>
    </PublicLayout>
  );
}
