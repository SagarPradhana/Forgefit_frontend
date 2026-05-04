import { Link } from "react-router-dom";
import { Dumbbell, Trophy, Users, Star } from "lucide-react";
import { PublicLayout } from "../../layouts/PublicLayout";
import { motion } from "framer-motion";
import { Counter } from "../../components/common/Counter";

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

import { useGymStore } from "../../store/gymStore";
import { BannerCarousel } from "../../components/common/BannerCarousel";

export function HomePage() {
  const { publicAppConfig, publicBanners, isLoadingPublicData } = useGymStore();

  const homeBanners = publicBanners["home"] || publicBanners["common"] || [];

  const brandName = publicAppConfig?.brand_name || "ForgeFit";
  return (
    <PublicLayout>
      <div className="relative isolate min-h-screen bg-[#0a0a0c]">
        {/* Hero Section - Scoped Full Screen Background */}
        <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
          {/* Background Carousel (Scoped to this section) */}
          <div className="absolute inset-0 z-0">
            <BannerCarousel banners={homeBanners} isLoading={isLoadingPublicData} />
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10 pointer-events-none" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-20 w-full px-4 sm:px-8 md:pl-[clamp(2rem,6vw,7rem)] md:pr-4 max-w-[900px]">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hero-badge-dark animate-badge-pulse inline-block mb-8"
            >
              ⚡ {brandName} Fitness Evolution
            </motion.div>

            <div className="flex flex-col mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.85] tracking-tighter uppercase">
                {["FORGE", "YOUR", "ULTIMATE"].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + (i * 0.1),
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="block text-white"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="block text-[#e8521a] drop-shadow-[0_0_80px_rgba(232,82,26,0.5)]"
                >
                  LEGACY.
                </motion.span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-lg md:text-xl text-white/75 max-w-[480px] mb-12 leading-[1.75] font-medium"
            >
              Experience the pinnacle of fitness at {brandName}. We combine elite coaching, cutting-edge equipment, and a powerful community to help you break through your limits.
            </motion.p>

            <div className="flex flex-wrap gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Link to="/contact">
                  <button className="bg-[#e8521a] text-white font-bold uppercase tracking-[0.08em] rounded-full px-10 py-5 transition-all duration-250 hover:brightness-110 hover:scale-[1.03] shimmer-sweep group flex items-center gap-3 shadow-xl shadow-orange-950/20">
                    JOIN THE ELITE
                    <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Link to="/services">
                  <button className="bg-transparent border-[1.5px] border-white/40 text-white font-bold uppercase tracking-[0.08em] rounded-full px-10 py-5 transition-all hover:bg-white/10 hover:border-white backdrop-blur-sm">
                    EXPLORE PROGRAMS
                  </button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex items-center gap-8 border-t border-white/10 pt-10"
            >
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-8 w-full sm:w-auto">
                <div className="relative">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white"><Counter to={2.8} suffix="K+" duration={1500} /></p>
                  <p className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-[0.08em] mt-1 sm:mt-2 font-bold">Active Members</p>
                </div>
                <div className="hidden sm:block w-[1px] h-8 bg-white/15" />
                <div className="relative">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white"><Counter to={45} suffix="+" duration={1500} /></p>
                  <p className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-[0.08em] mt-1 sm:mt-2 font-bold">Elite Coaches</p>
                </div>
                <div className="hidden sm:block w-[1px] h-8 bg-white/15" />
                <div className="relative col-span-2 sm:col-auto">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white"><Counter to={98} suffix="%" duration={1500} /></p>
                  <p className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-[0.08em] mt-1 sm:mt-2 font-bold">Success Rate</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50 hidden sm:flex"
          >
            <div className="w-[1.5px] h-10 bg-gradient-to-b from-[#e8521a] to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white">SCROLL</span>
          </motion.div>
        </section>

        {/* Features Bento Section */}
        <section className="py-16 sm:py-24 bg-slate-950/50 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="hero-badge">Our Pillars</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-4">DESIGNED FOR PERFORMANCE</h2>
            </div>

            <div className="bento-grid">
              <div className="bento-item bento-item-1 glass-panel p-6 sm:p-8 flex flex-col justify-between group">
                <div>
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Trophy size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 uppercase">ELITE FACILITIES</h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Train in a space that inspires greatness at {brandName}. Our facility features premium equipment from top global brands, specialized recovery zones, and an atmosphere that screams high-performance.</p>
                </div>
                <div className="mt-8 hidden sm:block">
                  <img src="/assets/redesign/interior.png" className="rounded-xl w-full h-40 object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                </div>
              </div>

              <div className="bento-item bento-item-2 glass-panel p-6 sm:p-8 group">
                <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
                  <div className="flex-1">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4">
                      <Users size={24} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 uppercase">PRO COMMUNITY</h3>
                    <p className="text-slate-400 text-sm">Join the {brandName} community of athletes dedicated to mutual growth and relentless pursuit of excellence.</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    <div className="stat-card py-4">
                      <p className="text-xl sm:text-2xl font-black text-white">500+</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-tighter">Daily Active</p>
                    </div>
                    <div className="stat-card py-4">
                      <p className="text-xl sm:text-2xl font-black text-white">12+</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-tighter">Events/Mo</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bento-item bento-item-3 glass-panel p-6 sm:p-8 group hover:bg-orange-500/10 border-orange-500/20">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                  <Dumbbell size={24} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 uppercase">EXPERT COACHING</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Personalized training plans crafted by certified professionals to ensure your path is efficient and safe.</p>
              </div>

              <div className="bento-item bento-item-4 glass-panel p-6 sm:p-8 group hover:bg-indigo-500/10 border-indigo-500/20">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Star size={24} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 uppercase">PROVEN RESULTS</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Data-driven progress tracking to celebrate every milestone in your fitness journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Coaches Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 sm:mb-16 gap-6">
              <div className="max-w-2xl text-center md:text-left">
                <span className="hero-badge">Elite Team</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-4 uppercase">MEET THE ARCHITECTS OF TRANSFORMATION</h2>
              </div>
              <Link to="/about" className="hidden sm:block">
                <button className="text-orange-400 font-bold uppercase tracking-widest text-sm hover:text-orange-300 transition-colors flex items-center gap-2">
                  View All Coaches <span>→</span>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {isLoadingPublicData ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={`skeleton-${idx}`} className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-slate-900 animate-pulse">
                    <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
                      <div className="h-3 w-1/3 bg-slate-800 rounded mb-2"></div>
                      <div className="h-6 w-2/3 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                (publicBanners["trainers"]?.length > 0 ? publicBanners["trainers"] : trainers).slice(0, 3).map((trainer: any, idx: number) => (
                  <div key={trainer.id || idx} className="group relative overflow-hidden rounded-3xl aspect-[3/4]">
                    <img
                      src={trainer.file_path || (idx === 0 ? "/assets/redesign/trainer.png" : trainer.image)}
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                      <p className="text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1">{trainer.role || "Elite Coach"}</p>
                      {/* <h3 className="text-xl sm:text-2xl font-black text-white">{trainer.name || "Alex Forge"}</h3> */}
                      <div className="mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
                        <p className="text-slate-400 text-sm">Specializing in high-performance strength and metabolic conditioning.</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 relative px-4 overflow-hidden">
          <div className="mx-auto max-w-5xl">
            <div className="relative glass-panel p-8 sm:p-12 md:p-20 text-center overflow-hidden border-orange-500/30">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 sm:w-64 h-48 sm:h-64 bg-orange-500/20 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/20 blur-[100px] rounded-full" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 uppercase leading-tight">READY TO UNLEASH <br /><span className="text-cinematic">YOUR POWER?</span></h2>
                <p className="text-base sm:text-lg text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto">Stop waiting for the "perfect time". The perfect time is now. Join {brandName} and start writing your success story today.</p>
                <Link to="/contact">
                  <button className="btn-premium px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl w-full sm:w-auto">
                    JOIN THE ELITE NOW
                  </button>
                </Link>
                <p className="mt-6 text-slate-500 text-[10px] sm:text-sm font-medium uppercase tracking-widest">NO COMMITMENT • 7-DAY FREE PASS • PRO GEAR</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}