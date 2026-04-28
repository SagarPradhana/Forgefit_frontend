import { motion } from "framer-motion";
import {
  GlassCard,
  GlowButton,
  SectionTitle,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Phone, Mail, MapPin, Clock, Sparkles } from "lucide-react";
import { AnimatedSection } from "../../components/common/AnimatedSection";

export function ContactPage() {
  return (
    <PublicLayout>
      <div className="space-y-12 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_35%)]" />
          <div className="relative z-10 max-w-3xl text-center mx-auto">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm uppercase tracking-[0.3em] text-orange-300"
            >
              Get in touch
            </motion.p>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            >
              Contact ForgeFit
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-7 text-slate-300"
            >
              Have a question about membership, training programs, or our
              studio? Our team is ready to support your fitness journey.
            </motion.p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="space-y-6">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-5 sm:p-6 group hover:border-orange-500/30 transition-colors">
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
                  <motion.div 
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    className="rounded-3xl border border-white/10 bg-orange-500/10 px-4 py-3 text-orange-300 transition-colors group-hover:bg-orange-500/20"
                  >
                    <Sparkles size={22} />
                  </motion.div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 group/item hover:border-orange-500/50 transition-all"
                  >
                    <div className="flex items-center gap-3 text-orange-300">
                      <Phone size={18} className="transition-transform group-hover/item:scale-110" />
                      <span className="text-sm font-semibold text-white">
                        Call us
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">+91 98765 43210</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Available 7AM - 10PM
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 group/item hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex items-center gap-3 text-indigo-300">
                      <Mail size={18} className="transition-transform group-hover/item:scale-110" />
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
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-5 sm:p-6 hover:border-indigo-500/30 transition-colors">
                <p className="text-base sm:text-lg font-semibold text-white">
                  Studio Location
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  Visit us for a tour, membership consultation, or to start your
                  first session.
                </p>
                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-3 group/loc">
                    <MapPin size={18} className="text-green-400 group-hover/loc:scale-110 transition-transform" />
                    Ahmedabad, Gujarat, India
                  </div>
                  <div className="flex items-center gap-3 group/loc">
                    <Clock size={18} className="text-slate-400 group-hover/loc:rotate-12 transition-transform" />
                    Mon - Fri: 6:00 AM – 10:00 PM
                  </div>
                  <div className="flex items-center gap-3 group/loc">
                    <Clock size={18} className="text-slate-400 group-hover/loc:rotate-12 transition-transform" />
                    Sat - Sun: 7:00 AM – 8:00 PM
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-5 sm:p-6 md:p-8 border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-base sm:text-xl font-semibold text-white mb-6 relative z-10">
                Send Us a Message
              </p>
              <div className="grid gap-5 relative z-10">
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                    <input
                      className="w-full rounded-3xl bg-white/10 border border-white/10 px-5 py-4 text-sm text-slate-100 outline-none transition-all focus:border-orange-400/50 focus:bg-white/15 focus:ring-4 focus:ring-orange-400/10 placeholder:text-slate-500"
                      placeholder="Full Name"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <input
                      className="w-full rounded-3xl bg-white/10 border border-white/10 px-5 py-4 text-sm text-slate-100 outline-none transition-all focus:border-orange-400/50 focus:bg-white/15 focus:ring-4 focus:ring-orange-400/10 placeholder:text-slate-500"
                      placeholder="Email Address"
                    />
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                  <textarea
                    className="min-h-[170px] w-full rounded-[1.5rem] bg-white/10 border border-white/10 p-5 text-sm text-slate-100 outline-none transition-all focus:border-orange-400/50 focus:bg-white/15 focus:ring-4 focus:ring-orange-400/10 placeholder:text-slate-500"
                    placeholder="Your Message"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2"
                >
                  <p className="text-xs text-slate-400">
                    We will get back to you as soon as possible.
                  </p>
                  <GlowButton 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-10 py-4 transition-all hover:shadow-glow pulse-glow-hover"
                  >
                    Send Message
                  </GlowButton>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        <AnimatedSection>
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
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 text-center hover:border-orange-500/30 transition-colors">
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="text-center">
            <GlassCard className="mx-auto max-w-2xl p-8 sm:p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-xs uppercase tracking-[0.3em] text-orange-300 relative z-10">
                Ready to take the next step?
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white relative z-10">
                We’re here whenever you’re ready.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 relative z-10">
                Reach out now and book your first session, even if you just want
                to learn more about what ForgeFit offers.
              </p>
              <GlowButton className="mt-6 px-10 py-4 relative z-10 transition-transform hover:scale-105 active:scale-95 pulse-glow-hover">Get Started</GlowButton>
            </GlassCard>
          </section>
        </AnimatedSection>
      </div>
    </PublicLayout>
  );
}
