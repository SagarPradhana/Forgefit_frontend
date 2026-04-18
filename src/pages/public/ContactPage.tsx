import {
  GlassCard,
  GlowButton,
  SectionTitle,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Phone, Mail, MapPin, Clock, Sparkles } from "lucide-react";

export function ContactPage() {
  return (
    <PublicLayout>
      <div className="space-y-12 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_35%)]" />
          <div className="relative z-10 max-w-3xl text-center mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
              Get in touch
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Contact ForgeFit
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-7 text-slate-300">
              Have a question about membership, training programs, or our
              studio? Our team is ready to support your fitness journey.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="space-y-6">
            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Reach out directly
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Our support team is available for questions about pricing,
                    programs, and memberships.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-orange-500/10 px-4 py-3 text-orange-300">
                  <Sparkles size={22} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-orange-300">
                    <Phone size={18} />
                    <span className="text-sm font-semibold text-white">
                      Call us
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">+91 98765 43210</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Available 7AM - 10PM
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-indigo-300">
                    <Mail size={18} />
                    <span className="text-sm font-semibold text-white">
                      Email
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    support@forgefit.com
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 sm:p-6">
              <p className="text-base sm:text-lg font-semibold text-white">
                Studio Location
              </p>
              <p className="mt-3 text-sm text-slate-300">
                Visit us for a tour, membership consultation, or to start your
                first session.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-green-400" />
                  Ahmedabad, Gujarat, India
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-slate-400" />
                  Mon - Fri: 6:00 AM – 10:00 PM
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-slate-400" />
                  Sat - Sun: 7:00 AM – 8:00 PM
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-5 sm:p-6 md:p-8 border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
            <p className="text-base sm:text-xl font-semibold text-white mb-4">
              Send Us a Message
            </p>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="rounded-3xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                  placeholder="Full Name"
                />
                <input
                  className="rounded-3xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                  placeholder="Email Address"
                />
              </div>

              <textarea
                className="min-h-[170px] rounded-3xl bg-white/10 border border-white/10 p-4 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                placeholder="Your Message"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                  We will get back to you as soon as possible.
                </p>
                <GlowButton className="w-full sm:w-auto px-6 py-3">
                  Send Message
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Fast Response",
              description: "We reply to all enquiries within one business day.",
            },
            {
              title: "Friendly Support",
              description:
                "Our team is here to help you pick the right membership.",
            },
            {
              title: "Easy Booking",
              description:
                "Schedule a visit, call, or online consultation instantly.",
            },
          ].map((item) => (
            <GlassCard key={item.title} className="p-6 text-center">
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-3 text-sm text-slate-300">{item.description}</p>
            </GlassCard>
          ))}
        </section>

        <section className="text-center">
          <GlassCard className="mx-auto max-w-2xl p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-300">
              Ready to take the next step?
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
              We’re here whenever you’re ready.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Reach out now and book your first session, even if you just want
              to learn more about what ForgeFit offers.
            </p>
            <GlowButton className="mt-6 px-8 py-3">Get Started</GlowButton>
          </GlassCard>
        </section>
      </div>
    </PublicLayout>
  );
}
