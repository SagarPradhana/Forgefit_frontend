import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicBanner } from "../../services/publicAppService";

interface BannerCarouselProps {
  banners: PublicBanner[];
  className?: string;
}

export function BannerCarousel({ banners, className = "" }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (!banners || banners.length === 0) {
    return (
      <div className={`absolute inset-0 bg-slate-950 ${className}`}>
        <img
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=2000&q=80"
          alt="Default banner"
          className="h-full w-full object-cover opacity-20"
        />
      </div>
    );
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div 
      className={`absolute inset-0 z-0 group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Ken Burns Effect Image */}
          <motion.img
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 6, ease: "linear" }}
            src={banners[currentIndex].file_path}
            alt={`Banner ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Slide Counter (Top-Right) */}
      <div className="absolute top-24 right-8 z-30 font-mono text-[13px] tracking-widest text-white/50">
        <span className="text-white">{(currentIndex + 1).toString().padStart(2, '0')}</span> / {banners.length.toString().padStart(2, '0')}
      </div>

      {/* Arrow Navigation (Hover Only) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e8521a]/40 hover:border-[#e8521a] flex items-center justify-center z-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e8521a]/40 hover:border-[#e8521a] flex items-center justify-center z-30"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(i); }}
              className={`transition-all duration-350 ease-in-out ${
                i === currentIndex 
                  ? "w-8 h-2 bg-[#e8521a] rounded-[4px]" 
                  : "w-2 h-2 bg-white/30 rounded-full hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (Full Width at Bottom) */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-40">
          <motion.div
            key={`progress-${currentIndex}-${isPaused}`}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? "0%" : "100%" }}
            transition={{ duration: isPaused ? 0 : 5, ease: "linear" }}
            className="h-full bg-[#e8521a]"
          />
        </div>
      )}
    </div>
  );
}
