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

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return (
      <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl ${className}`}>
        <img
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80"
          alt="Default banner"
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-500">No banners available</p>
        </div>
      </div>
    );
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl group ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={banners[currentIndex].id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <img
            src={banners[currentIndex].file_path}
            alt={`Banner ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-500/50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-500/50"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(i); }}
                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-orange-500" : "w-2 bg-white/30"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
