import { motion } from "framer-motion";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Star, PlayCircle } from "lucide-react";
import { Counter } from "../../components/common/Counter";

import { useGymStore } from "../../store/gymStore";
import { Link } from "react-router-dom";
import { NoDataFound } from "../../components/ui/NoDataFound";

export function TestimonialsPage() {
  const { publicAppConfig, publicTestimonials, publicBanners, isLoadingPublicData } = useGymStore();
  const brandName = publicAppConfig?.brand_name || "ForgeFit";

  const displayTestimonials = publicTestimonials.length > 0
    ? publicTestimonials.map((t) => ({
      quote: t.note?.trim(),
      id: t.id,
    }))
    .filter((item) => item.quote)
    : [];

  const videoBanners = publicBanners["testimonials"] || [];
  const inspirationalBanners = publicBanners["inspirational"] || [];
  const latestVideo = videoBanners[0];
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
              Member Success Stories
            </motion.div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 sm:mb-8 uppercase leading-[0.9]">
              REAL RESULTS. <br /><span className="text-cinematic">NO EXCUSES.</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-12 px-4 sm:px-0">
              Our community is built on the sweat and success of hundreds who decided to change their story. Join the movement.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                { value: 4.9, label: "Avg Rating", suffix: "/5" },
                { value: 500, label: "Athletes", suffix: "+" },
                { value: 1200, label: "Transformations", suffix: "+" },
                { value: 95, label: "Success Rate", suffix: "%" },
              ].map((stat, i) => (
                <div key={i} className="stat-card py-4 sm:py-6">
                  <p className="text-2xl sm:text-4xl font-extrabold text-white"><Counter to={stat.value} suffix={stat.suffix} /></p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Video / Hero Visual */}
          <section className="mb-32">
            <div className="glass-panel p-4 relative overflow-hidden group aspect-video md:aspect-[21/9] rounded-2xl">
              {isLoadingPublicData ? (
                <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center rounded-2xl">
                  <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                </div>
              ) : latestVideo?.file_path?.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                <video
                  src={latestVideo.file_path}
                  controls
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center">
                  <div className="text-center px-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      className="mx-auto mb-6 w-20 h-20 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-glow"
                    >
                      <PlayCircle size={48} />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">NO TESTIMONIAL VIDEO</h3>
                    <p className="text-slate-300 text-sm mt-2">Upload a testimonials video banner to show it here.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Testimonials Grid */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">COMMUNITY VOICE</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoadingPublicData ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="glass-panel p-8 h-full flex flex-col bg-slate-900 animate-pulse rounded-2xl">
                    <div className="h-4 w-24 bg-slate-800 rounded mb-6"></div>
                    <div className="flex-grow space-y-3 mb-8">
                      <div className="h-4 w-full bg-slate-800 rounded"></div>
                      <div className="h-4 w-full bg-slate-800 rounded"></div>
                      <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
                    </div>
                    <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                      <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-800 rounded"></div>
                        <div className="h-2 w-16 bg-slate-800 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : displayTestimonials.length > 0 ? (
                displayTestimonials.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="glass-panel p-8 h-full flex flex-col group hover:bg-orange-500/5 transition-all">
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-orange-400" fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-slate-300 text-base leading-relaxed italic mb-8 flex-grow">
                        "{item.quote}"
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="md:col-span-3">
                  <NoDataFound title="No Testimonials" subtitle="Create testimonials from the admin public pages to show them here." />
                </div>
              )}
            </div>
          </section>

          {/* Before / After */}
          <section className="py-24 border-t border-white/5">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">BEFORE / AFTER</h2>
            </div>

            {inspirationalBanners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {inspirationalBanners.map((banner, i) => (
                  <div key={banner.id || i} className="group relative overflow-hidden rounded-3xl h-[320px] md:h-[420px]">
                    <img
                      src={banner.file_path}
                      alt={`Before After ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <p className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Transformation Story</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataFound title="No Before/After Gallery" subtitle="Upload inspirational banners to show the before/after section." />
            )}
          </section>

          {/* Final CTA */}
          <section className="py-20">
            <div className="glass-panel p-12 md:p-20 text-center border-orange-500/30">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase">WRITE YOUR <span className="text-cinematic">OWN CHAPTER</span></h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Your journey to greatness starts with a single decision. Join the elite community at {brandName}.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signin">
                  <button className="btn-premium px-12 py-5 text-xl">START NOW</button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
