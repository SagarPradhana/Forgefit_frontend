import { motion } from "framer-motion";
import { facilities, services } from "../../data/mockData";
import { PublicLayout } from "../../layouts/PublicLayout";
import {
  Flame,
  HeartPulse,
  Dumbbell,
  ArrowRight,
} from "lucide-react";
const trainingPrograms = [
  { title: "Fat Loss", subtitle: "Lean, sustainable progress", icon: Flame },
  { title: "Muscle Gain", subtitle: "Strength built with smart coaching", icon: Dumbbell },
  { title: "Cardio Fitness", subtitle: "Endurance training for every level", icon: HeartPulse },
];

import { useGymStore } from "../../store/gymStore";
import { Link } from "react-router-dom";

export function ServicesPage() {
  const { publicAppConfig, publicFaqs, publicBanners, publicLocations } = useGymStore();
  const brandName = publicAppConfig?.brand_name || "ForgeFit";
  const mainLocation = publicLocations[0];
  const servicesBanner = publicBanners["inspirational"]?.[0]?.file_path || publicBanners["common"]?.[0]?.file_path || "/assets/redesign/interior.png";

  const displayFaqs = publicFaqs.length > 0 ? publicFaqs : [
    { question: "What are your operating hours?", answer: "We are open 24/7 for all premium and VIP members. Basic members have access from 5 AM to 11 PM." },
    { question: "Do you offer personal training?", answer: "Yes, we have a team of certified personal trainers ready to help you reach your goals." },
    { question: "Can I freeze my membership?", answer: "Members can freeze their accounts for up to 3 months per year for medical or travel reasons." },
  ];
  return (
    <PublicLayout>
      <div className="relative isolate min-h-screen overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="bg-mesh" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <section className="text-center mb-16 sm:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-badge"
            >
              Elite Fitness Services
            </motion.div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 sm:mb-8 uppercase leading-[0.9]">
              DOMINATE EVERY <br /><span className="text-cinematic">DIMENSION.</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-12 px-4 sm:px-0">
              {publicAppConfig?.description || `From high-octane HIIT to precision strength training, our services are engineered to produce elite-level results at ${brandName}.`}
            </p>
            <div className="flex flex-wrap justify-center gap-4 px-4 sm:px-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="btn-premium px-10 py-4 w-full sm:w-auto text-sm sm:text-base">BOOK A FREE EVALUATION</button>
              </Link>
            </div>
          </section>

          {/* Training Programs Grid */}
          <section className="mb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trainingPrograms.map((program, i) => (
                <div key={i} className="glass-panel p-10 group hover:bg-orange-500/5 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-8 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                    <program.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{program.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{program.subtitle}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Core Services Bento */}
          <section className="py-20 border-t border-white/5 mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">CORE PERFORMANCE SERVICES</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, i) => (
                <div key={i} className="glass-panel p-8 group flex items-start gap-6 hover:border-indigo-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interior Visual Section */}
          <section className="mb-32">
            <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden group">
              <img
                src={servicesBanner}
                alt="Gym Interior"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-12 max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase">PREMIUM ENVIRONMENT</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  {mainLocation
                    ? `Train at our ${mainLocation.address} facility with working hours from ${mainLocation.working_hours_from_time} to ${mainLocation.working_hours_to_time}.`
                    : "Access to 24/7 world-class facilities, specialized recovery zones, and a motivating community that pushes you to be your best every single day."}
                </p>
                <div className="flex flex-wrap gap-4">
                  {facilities.slice(0, 4).map((f, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-widest">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">FREQUENTLY ASKED</h2>
              </div>

              <div className="space-y-6">
                {displayFaqs.map((faq, i) => (
                  <div key={i} className="glass-panel p-8 hover:bg-white/[0.02] transition-all group">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                      {faq.question}
                      <span className="text-orange-400 group-hover:rotate-90 transition-transform">→</span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
