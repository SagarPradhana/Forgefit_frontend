import { motion } from "framer-motion";
import { testimonials } from "../../data/mockData";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Star, PlayCircle } from "lucide-react";
import { Counter } from "../../components/common/Counter";

const caseStudies = [
  {
    title: "Arianna",
    subtitle: "Lean muscle transformation",
    description:
      "6 weeks of consistent training and tailored nutrition helped Arianna gain strength and confidence.",
  },
  {
    title: "Daniel",
    subtitle: "Performance upgrade",
    description:
      "Upgraded his routine with guided coaching and hit new personal bests every month.",
  },
  {
    title: "Mei",
    subtitle: "Sustainable fat loss",
    description:
      "Smart training and recovery helped Mei stay motivated and achieve lasting results.",
  },
];

import { useGymStore } from "../../store/gymStore";
import { Link } from "react-router-dom";

export function TestimonialsPage() {
  const { publicAppConfig, publicTestimonials, publicBanners } = useGymStore();
  const brandName = publicAppConfig?.brand_name || "ForgeFit";

  const displayTestimonials = publicTestimonials.length > 0
    ? publicTestimonials.map(t => ({ quote: t.note || (t as any).content || (t as any).message || "", name: t.name }))
    : testimonials;

  const videoBanners = publicBanners["testimonials"] || [];
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
            <div className="glass-panel p-4 relative overflow-hidden group aspect-video md:aspect-[21/9]">
              {latestVideo?.file_path?.endsWith('.mp4') ? (
                <video
                  src={latestVideo.file_path}
                  controls
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <img
                    src="/assets/redesign/testimonials.png"
                    alt="Transformation Spotlight"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      className="w-20 h-20 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/40 flex items-center justify-center text-orange-400 cursor-pointer shadow-glow"
                    >
                      <PlayCircle size={48} />
                    </motion.div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">MEMBER SPOTLIGHT</h3>
                      <p className="text-slate-300 text-sm">Experience the {brandName} transformation in 60 seconds.</p>
                    </div>
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
              {displayTestimonials.map((item, index) => (
                <motion.div
                  key={index}
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
                    <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-black text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm uppercase tracking-tight">{item.name}</p>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Athlete Member</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Transformation Stories */}
          <section className="py-24 border-t border-white/5">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">THE BLUEPRINT</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudies.map((story, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl aspect-[3/4]">
                  <img
                    src={`https://images.unsplash.com/photo-${i === 0 ? '1558611848-73f7eb4001c4' : i === 1 ? '1554284126-aa88f22d8b3e' : '1550345332-09e3ac987658'}?auto=format&fit=crop&w=900&q=80`}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                    <p className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{story.subtitle}</p>
                    <h3 className="text-2xl font-black text-white mb-2">{story.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">{story.description}</p>
                  </div>
                </div>
              ))}
            </div>
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
