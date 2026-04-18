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
        className="space-y-14 px-4 sm:px-6 lg:px-8"
      >
        <section className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 xl:max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Sparkles className="h-4 w-4 text-orange-300" />
              Trusted training, recovery, and coaching for every fitness goal
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Everything you need to reach your strongest self.
            </h1>
            <p className="max-w-2xl text-sm sm:text-base leading-7 text-slate-300">
              ForgeFit combines expert coaching, premium equipment, and a welcoming gym experience so every member can train with confidence and stay motivated.
            </p>
            <div className="flex flex-wrap gap-3">
              <CommonButton type="button">Explore Memberships</CommonButton>
              <CommonButton type="button" variant="ghost" className="text-slate-100">
                Book a Free Session
              </CommonButton>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <GlassCard className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">500+</p>
                <p className="mt-1 text-xs text-slate-300">Active Members</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">50+</p>
                <p className="mt-1 text-xs text-slate-300">Expert Trainers</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">95%</p>
                <p className="mt-1 text-xs text-slate-300">Satisfaction Rate</p>
              </GlassCard>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
          >
            <img
              src={heroImage}
              alt="Gym interior and equipment"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent px-6 py-5 text-slate-100">
              <p className="text-sm font-semibold">Premium studio environment</p>
              <p className="text-xs text-slate-300">
                Modern equipment paired with motivating spaces that help you stay consistent.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="space-y-5">
          <SectionTitle title="Core Services" subtitle="Structured support across every training phase." />
          <div className="grid gap-4 xl:grid-cols-2">
            {services.map((service) => (
              <GlassCard key={service.title} className="group overflow-hidden p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{service.title}</p>
                    <p className="mt-3 text-sm text-slate-300">{service.description}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300 transition group-hover:bg-orange-400/20">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle title="Training Programs" subtitle="Choose the goal that fits your lifestyle." />
          <div className="grid gap-4 md:grid-cols-3">
            {trainingPrograms.map((program) => (
              <GlassCard key={program.title} className="p-6 text-center">
                <program.icon className="mx-auto mb-4 h-10 w-10 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">{program.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{program.subtitle}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle title="Workout Categories" subtitle="A variety of classes and sessions for every routine." />
          <div className="grid gap-3 md:grid-cols-4">
            {categories.map((category) => (
              <GlassCard key={category} className="p-4 text-center">
                <p className="text-sm font-semibold text-white">{category}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle title="Premium Facilities" subtitle="Comfort, access, and recovery under one roof." />
          <div className="grid gap-4 md:grid-cols-3">
            {facilities.map((facility) => (
              <GlassCard key={facility} className="p-5 text-center">
                <p className="text-sm text-slate-200">{facility}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle title="Membership Benefits" subtitle="Everything included to support your progress." />
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <GlassCard key={benefit.label} className="p-5 text-center">
                <benefit.icon className="mx-auto mb-3 h-8 w-8 text-indigo-400" />
                <p className="text-sm text-slate-200">{benefit.label}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <GlassCard className="rounded-[2rem] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Not sure where to start?</p>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              We’ll help you find the right program for your goals.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Whether you want fat loss, muscle gain, or more endurance, our
              team will guide you with a plan that fits your life.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CommonButton type="button">Book a Free Consultation</CommonButton>
              <CommonButton
                type="button"
                variant="ghost"
                className="text-slate-100"
              >
                View Pricing
              </CommonButton>
            </div>
          </GlassCard>
        </section>
      </motion.div>
    </PublicLayout>
  );
}
