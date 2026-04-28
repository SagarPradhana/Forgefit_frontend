import { motion } from "framer-motion";
import { facilities, services } from "../../data/mockData";
import {
  GlassCard,
  SectionTitle,
  CommonButton,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import {
  Users,
  Trophy,
  Flame,
  Dumbbell,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { AnimatedSection } from "../../components/common/AnimatedSection";
import { Counter } from "../../components/common/Counter";

const heroImage =
  "https://images.unsplash.com/photo-1554284126-aa88f22d8b3e?auto=format&fit=crop&w=1200&q=80";

const trustItems = [
  {
    icon: Users,
    title: "Expert Coaches",
    description: "Certified trainers design every workout around your goals.",
  },
  {
    icon: Trophy,
    title: "Proven Results",
    description:
      "Track records of stronger bodies, safer progress, and happier members.",
  },
  {
    icon: Flame,
    title: "Performance-Led",
    description:
      "Training, recovery, and nutrition all built for real, sustainable gains.",
  },
  {
    icon: Dumbbell,
    title: "Premium Facility",
    description:
      "Modern equipment, clean spaces, and a motivating gym experience.",
  },
];

const approachCards = [
  {
    title: "Personalized Programs",
    text: "Every plan is tailored to your experience, needs, and lifestyle.",
  },
  {
    title: "Supportive Community",
    text: "From first-timers to athletes, our community cheers every milestone.",
  },
  {
    title: "Progress Tracking",
    text: "Monitor strength, mobility, and recovery with simple, powerful tools.",
  },
];

export function AboutPage() {
  return (
    <PublicLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-14 sm:space-y-20 overflow-hidden"
      >
        <section className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr] items-center px-4">
          <div className="space-y-6 xl:max-w-xl">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
            >
              <Sparkles className="mr-2 h-4 w-4 text-orange-300" />
              Trusted by over 500 members and counting
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            >
              A fitness experience built for real people who want real progress.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl text-sm sm:text-base leading-7 text-slate-300"
            >
              ForgeFit blends expert coaching, modern equipment, and a
              supportive community to help you achieve a stronger body, sharper
              mind, and healthier lifestyle. We design every detail so you can
              focus on staying consistent and feeling great.
            </motion.p>
            <div className="flex flex-wrap gap-3">
              <CommonButton type="button" className="pulse-glow-hover">Get Started</CommonButton>
              <CommonButton
                type="button"
                variant="ghost"
                className="text-slate-100 hover:bg-white/10"
              >
                View Memberships
              </CommonButton>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { value: 500, label: "Active Members", suffix: "+" },
                { value: 98, label: "Member Satisfaction", suffix: "%" },
                { value: 5, label: "Years of Growth", suffix: "+" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <GlassCard className="p-4 text-center hover:border-orange-500/50 transition-colors">
                    <p className="text-xl font-bold text-orange-400">
                      <Counter from={0} to={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-slate-300">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
          >
            <motion.img
              src={heroImage}
              alt="Gym training experience"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-6 py-5 text-slate-100">
              <p className="text-sm font-semibold">ForgeFit Studio</p>
              <p className="text-xs text-slate-300">
                Exceptional coaching and inspiring workouts in every session.
              </p>
            </div>
          </motion.div>
        </section>

        <AnimatedSection>
          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch px-4">
            <div className="space-y-5 h-full">
              <SectionTitle
                title="Our Mission"
                subtitle="Empower every member to move better, feel better, and perform better."
              />
              <GlassCard className="space-y-4 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm leading-7 text-slate-300 relative z-10">
                  At ForgeFit, we believe fitness is more than a workout—it is a
                  way to build confidence, resilience, and daily energy. We create
                  training programs rooted in science, recovery, and personal
                  accountability so every member feels supported from day one.
                </p>
                <div className="grid gap-3 sm:grid-cols-3 relative z-10">
                  {approachCards.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 hover:border-orange-500/30 transition-colors"
                    >
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-slate-300">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="space-y-5 h-full">
              <SectionTitle title="Why Members Trust Us" />
              <div className="grid gap-4 h-full">
                {trustItems.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard
                      className="flex items-start gap-4 p-5 hover:border-indigo-500/30 transition-all group"
                    >
                      <div className="mt-1 rounded-2xl bg-orange-400/10 p-3 text-orange-300 group-hover:bg-orange-400/20 transition-colors">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="px-4">
            <SectionTitle
              title="What We Offer"
              subtitle="Complete support across every part of your fitness journey."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-5 h-full hover:border-orange-500/30 transition-colors group">
                    <h3 className="mb-3 text-base font-semibold text-white transition-colors group-hover:text-orange-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-300">{service.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="px-4">
            <SectionTitle
              title="Our Facilities"
              subtitle="A premium training environment built for clean, effective workouts."
            />
            <GlassCard className="hover:border-indigo-500/30 transition-colors">
              <div className="flex flex-wrap gap-3">
                {facilities.map((facility, i) => (
                  <motion.span
                    key={facility}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 hover:bg-white/10 transition-colors cursor-default"
                  >
                    {facility}
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="px-4">
            <SectionTitle
              title="Meet Our Trainers"
              subtitle="Skilled coaches who guide you through every workout."
            />
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { name: "Maya", title: "Strength Coach" },
                { name: "Noah", title: "Performance Trainer" },
                { name: "Ava", title: "Recovery Specialist" },
              ].map((trainer, i) => (
                <motion.div
                  key={trainer.name}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="text-center p-6 group hover:border-orange-500/30 transition-all">
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:scale-105 group-hover:border-orange-500/50 transition-all duration-300" />
                    <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-orange-300">
                      {trainer.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">{trainer.title}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="px-4">
            <GlassCard className="flex flex-col gap-6 rounded-[2rem] p-8 text-center sm:p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-400/15 text-orange-300 relative z-10"
              >
                <HeartHandshake className="h-8 w-8" />
              </motion.div>
              <div className="space-y-3 relative z-10">
                <h2 className="text-3xl font-bold text-white">
                  Ready to make progress with confidence?
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300">
                  Start with a welcoming training environment, expert guidance,
                  and a plan that is built to fit your life.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 relative z-10">
                <CommonButton type="button" className="pulse-glow-hover">Join ForgeFit</CommonButton>
                <CommonButton
                  type="button"
                  variant="ghost"
                  className="text-slate-100 hover:bg-white/10"
                >
                  Book a Tour
                </CommonButton>
              </div>
            </GlassCard>
          </section>
        </AnimatedSection>
      </motion.div>
    </PublicLayout>
  );
}
