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
        className="space-y-14 sm:space-y-20"
      >
        <section className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr] items-center px-4">
          <div className="space-y-6 xl:max-w-xl">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Sparkles className="mr-2 h-4 w-4 text-orange-300" />
              Trusted by over 500 members and counting
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              A fitness experience built for real people who want real progress.
            </h1>
            <p className="max-w-2xl text-sm sm:text-base leading-7 text-slate-300">
              ForgeFit blends expert coaching, modern equipment, and a
              supportive community to help you achieve a stronger body, sharper
              mind, and healthier lifestyle. We design every detail so you can
              focus on staying consistent and feeling great.
            </p>
            <div className="flex flex-wrap gap-3">
              <CommonButton type="button">Get Started</CommonButton>
              <CommonButton
                type="button"
                variant="ghost"
                className="text-slate-100"
              >
                View Memberships
              </CommonButton>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { value: "500+", label: "Active Members" },
                { value: "98%", label: "Member Satisfaction" },
                { value: "5+", label: "Years of Growth" },
              ].map((stat) => (
                <GlassCard key={stat.label} className="p-4 text-center">
                  <p className="text-xl font-bold text-orange-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
          >
            <img
              src={heroImage}
              alt="Gym training experience"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-6 py-5 text-slate-100">
              <p className="text-sm font-semibold">ForgeFit Studio</p>
              <p className="text-xs text-slate-300">
                Exceptional coaching and inspiring workouts in every session.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch px-4">
          <div className="space-y-5 h-full">
            <SectionTitle
              title="Our Mission"
              subtitle="Empower every member to move better, feel better, and perform better."
            />
            <GlassCard className="space-y-4 h-full">
              <p className="text-sm leading-7 text-slate-300">
                At ForgeFit, we believe fitness is more than a workout—it is a
                way to build confidence, resilience, and daily energy. We create
                training programs rooted in science, recovery, and personal
                accountability so every member feels supported from day one.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {approachCards.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <h3 className="text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-5 h-full">
            <SectionTitle title="Why Members Trust Us" />
            <div className="grid gap-4 h-full">
              {trustItems.map((item) => (
                <GlassCard
                  key={item.title}
                  className="flex items-start gap-4 p-5"
                >
                  <div className="mt-1 rounded-2xl bg-orange-400/10 p-3 text-orange-300">
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
              ))}
            </div>
          </div>
        </section>

        <section className="px-4">
          <SectionTitle
            title="What We Offer"
            subtitle="Complete support across every part of your fitness journey."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <GlassCard key={service.title} className="p-5">
                <h3 className="mb-3 text-base font-semibold text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-300">{service.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="px-4">
          <SectionTitle
            title="Our Facilities"
            subtitle="A premium training environment built for clean, effective workouts."
          />
          <GlassCard>
            <div className="flex flex-wrap gap-3">
              {facilities.map((facility) => (
                <span
                  key={facility}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"
                >
                  {facility}
                </span>
              ))}
            </div>
          </GlassCard>
        </section>

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
            ].map((trainer) => (
              <GlassCard key={trainer.name} className="text-center p-6">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-white/10" />
                <h3 className="text-lg font-semibold text-white">
                  {trainer.name}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{trainer.title}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="px-4">
          <GlassCard className="flex flex-col gap-6 rounded-[2rem] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-400/15 text-orange-300">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">
                Ready to make progress with confidence?
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300">
                Start with a welcoming training environment, expert guidance,
                and a plan that is built to fit your life.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <CommonButton type="button">Join ForgeFit</CommonButton>
              <CommonButton
                type="button"
                variant="ghost"
                className="text-slate-100"
              >
                Book a Tour
              </CommonButton>
            </div>
          </GlassCard>
        </section>
      </motion.div>
    </PublicLayout>
  );
}
