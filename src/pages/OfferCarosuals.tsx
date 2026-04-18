import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const offers = [
  {
    title: "50% Off First Month",
    desc: "Kickstart your fitness journey",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
  },
  {
    title: "Free Personal Training",
    desc: "Get 3 expert sessions",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  },
  {
    title: "12 Week Transformation",
    desc: "Join our challenge program",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
  },
];

export function OffersCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 h-48 sm:h-64 md:h-80">
      <motion.img
        key={index}
        src={offers[index].image}
        className="w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
          {offers[index].title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {offers[index].desc}
        </p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {offers.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full cursor-pointer transition ${
              i === index ? "bg-orange-400" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
