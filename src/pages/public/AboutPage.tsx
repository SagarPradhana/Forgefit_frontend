import { motion } from "framer-motion";
import { PublicLayout } from "../../layouts/PublicLayout";
import {
  Users,
  Trophy,
  Flame,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { Counter } from "../../components/common/Counter";

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

import { useGymStore } from "../../store/gymStore";
import { Link } from "react-router-dom";

export function AboutPage() {
  const { publicAppConfig, publicBanners, isLoadingPublicData } = useGymStore();
  const brandName = publicAppConfig?.brand_name || "ForgeFit";

  return (
    <PublicLayout>
      <div className="relative isolate min-h-screen overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="bg-mesh" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission & Story Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center mb-16 sm:mb-24">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hero-badge"
              >
                The {brandName} Story
              </motion.div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 sm:mb-8 uppercase leading-[0.9]">
                ENGINEERED FOR <br /><span className="text-cinematic">GREATNESS.</span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 px-4 sm:px-0">
                {publicAppConfig?.description || `${brandName} isn't just a gym; it's a performance laboratory. Founded on the principles of science-based training and elite-level recovery, we provide the tools and atmosphere for those who refuse to settle for average.`}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-0">
                <div className="stat-card py-4 sm:py-6">
                  <p className="text-2xl sm:text-4xl font-extrabold text-white"><Counter to={10} suffix="+" /></p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Years Experience</p>
                </div>
                <div className="stat-card py-4 sm:py-6">
                  <p className="text-2xl sm:text-4xl font-extrabold text-white"><Counter to={500} suffix="+" /></p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Athletes</p>
                </div>
              </div>
            </div>

            <div className="relative px-4 sm:px-0 mt-12 lg:mt-0">
              <div className="image-glow-wrap aspect-[4/3] sm:aspect-square">
                <img
                  src="/assets/redesign/interior.png"
                  alt="Gym Interior"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-6 sm:-bottom-8 right-0 sm:-right-8 glass-panel p-4 sm:p-6 max-w-[200px] sm:max-w-[280px] shadow-2xl z-10">
                <Sparkles className="text-orange-400 mb-2" size={20} />
                <p className="text-white font-bold text-xs sm:text-sm">State-of-the-Art Recovery</p>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-1">Access to infrared saunas and expert physio support.</p>
              </div>
            </div>
          </section>

          {/* Pillars Section */}
          <section className="py-20 border-t border-white/5">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">OUR CORE PILLARS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustItems.map((item, i) => (
                <div key={i} className="glass-panel p-8 group hover:bg-orange-500/5 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-3 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Meet the Trainers Section */}
          <section className="py-24 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[0.9]">ELITE <span className="text-cinematic">COACHING</span> TEAM</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoadingPublicData ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-slate-900 animate-pulse">
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <div className="h-3 w-1/3 bg-slate-800 rounded mb-2"></div>
                      <div className="h-8 w-2/3 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                (publicBanners["trainers"]?.length > 0 ? publicBanners["trainers"] : [
                  { name: "Maya", role: "Strength Coach" },
                  { name: "Noah", role: "Performance Trainer" },
                  { name: "Ava", role: "Recovery Specialist" },
                ]).slice(0, 3).map((trainer: any, i: number) => (
                  <div key={i} className="group relative overflow-hidden rounded-3xl aspect-[3/4]">
                    <img
                      src={trainer.file_path || (i === 0 ? "/assets/redesign/trainer.png" : `https://images.unsplash.com/photo-${i === 1 ? '1517836357463-d25dfeac3438' : '1518609878373-06d740f60d8b'}?auto=format&fit=crop&w=900&q=80`)}
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                      <p className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{trainer.role || "Elite Coach"}</p>
                      {/* <h3 className="text-2xl font-black text-white">{trainer.name}</h3> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 relative">
            <div className="glass-panel p-12 md:p-20 text-center border-orange-500/30">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase">START YOUR <span className="text-cinematic">JOURNEY</span></h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Join a community where results aren't just promised, they're engineered. Your first session is on us.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <button className="btn-premium px-12 py-5 text-xl">JOIN THE LEGACY</button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
