import { Link } from "react-router-dom";
import { Dumbbell, Flame, Trophy, Users, Star } from "lucide-react";
import { PublicLayout } from "../../layouts/PublicLayout";
import { GlowButton, GlassCard } from "../../components/ui/primitives";
import { useTheme } from "../../components/ui/ThemeProvider";
import { OffersCarousel } from "../OfferCarosuals";

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
      <div className="space-y-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center py-8 sm:py-10">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
              Your strongest start
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Transform Your Body
                <span className="block bg-gradient-to-r from-indigo-400 to-orange-400 bg-clip-text text-transparent">
                  Build Strength
                </span>
              </h1>
              <p className="max-w-2xl text-sm sm:text-base leading-7 text-slate-300">
                Train with expert coaches, track your performance, and unlock
                results faster with ForgeFit’s complete fitness experience.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to="/contact">
                  <GlowButton className="w-full">Join Now</GlowButton>
                </Link>
                <Link to="/services">
                  <GlowButton variant="secondary" className="w-full">
                    Explore
                  </GlowButton>
                </Link>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Trusted by
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-400">
                  2,840+
                </p>
                <p className="text-sm text-slate-300">active members</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "42", label: "Trainers" },
                { value: "11", label: "Years" },
                { value: "95%", label: "Success Rate" },
              ].map((item) => (
                <GlassCard key={item.label} className="p-5 text-center">
                  <p className="text-2xl font-bold text-orange-400">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80"
              alt="Gym workout"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-black/50 p-5 backdrop-blur-sm">
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
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                Why choose ForgeFit
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                Built to help you stay consistent.
              </h2>
            </div>
            <Link
              to="/pricing"
              className="text-sm font-semibold text-indigo-300 hover:text-white transition"
            >
              View Memberships →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.title}
                  className="p-6 hover:-translate-y-1 transition"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {feature.detail}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </section>

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
              className="text-sm font-semibold text-indigo-300 hover:text-white transition"
            >
              Learn about our trainers →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((trainer) => (
              <GlassCard key={trainer.name} className="overflow-hidden p-0">
                <div className="relative h-64">
                  <img
                    src={`${trainer.image}?auto=format&fit=crop&w=900&q=80`}
                    alt={trainer.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-lg font-semibold">{trainer.name}</p>
                    <p className="text-sm text-slate-300">{trainer.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

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
              className="text-sm font-semibold text-indigo-300 hover:text-white transition"
            >
              Read success stories →
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
            {testimonials.map((item) => (
              <GlassCard key={item.name} className="p-6">
                <div className="flex gap-2 text-orange-400 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-7 text-slate-300">
                  “{item.quote}”
                </p>
                <p className="mt-4 text-sm font-semibold text-white">
                  {item.name}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 text-center shadow-2xl">
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
            <GlowButton className="mt-8 px-8 py-3">Join ForgeFit</GlowButton>
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
}
