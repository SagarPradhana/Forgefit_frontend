import { motion } from "framer-motion";
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  MapPin,
  CalendarFold,
  Info
} from "lucide-react";
import {
  GlassCard,
  CommonButton,
} from "../components/ui/primitives";
import { toast } from "../store/toastStore";

export function ProductCard({ product }: any) {
  const isSupplement = product.category?.toLowerCase().includes("supplement");

  const handleBook = () => {
    toast.success(`Reserved ${product.name}! Please pick it up at the gym front desk within 24 hours.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <GlassCard className="h-full p-6 flex flex-col gap-5 overflow-hidden border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl">
        {/* 🔥 TOP BADGE */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">In Stock</span>
          </div>
        </div>

        {/* 🖼 VISUAL HERO */}
        <div className="relative h-44 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 flex items-center justify-center overflow-hidden group-hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_70%)]" />

          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="relative z-10"
          >
            {isSupplement ? (
              <Zap size={48} className="text-indigo-400/40 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]" />
            ) : (
              <ShoppingBag size={48} className="text-orange-400/40 drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]" />
            )}
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/80 to-transparent">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={10} className="text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-tighter">Locally available at Gym</span>
            </div>
          </div>
        </div>

        {/* 🏷 IDENTIFIER */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border transition-colors ${isSupplement ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "bg-orange-500/10 text-orange-300 border-orange-500/20"
              }`}>
              {product.category}
            </span>
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Verified Product</span>
          </div>

          <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight group-hover:text-indigo-300 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pickup Price</span>
              <p className="text-2xl font-black text-white italic tracking-tighter">
                ${product.price}
              </p>
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* 📅 BOOKING ZONE */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
          <p className="text-[9px] font-bold text-slate-500 italic text-center px-2 leading-relaxed">
            Note: Online payments are disabled. Please book it here and complete the transaction at our local gym counter.
          </p>
          <CommonButton
            onClick={handleBook}
            className="w-full h-12 flex items-center justify-center gap-2.5 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/10 active:scale-95"
          >
            <CalendarFold size={16} />
            Book for Pickup
          </CommonButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

