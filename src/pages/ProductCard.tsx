import { GlassCard, CommonButton } from "../components/ui/primitives";
import { ShoppingCart } from "lucide-react";

export function ProductCard({ product }: any) {
  return (
    <GlassCard className="p-5 flex flex-col gap-4 group">
      {/* 🖼 IMAGE PLACEHOLDER */}
      <div className="h-32 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
        Product Image
      </div>

      {/* 🏷 CATEGORY */}
      <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 w-fit">
        {product.category}
      </span>

      {/* 🧾 NAME */}
      <h3 className="font-semibold text-white">{product.name}</h3>

      {/* 💰 PRICE */}
      <p className="text-orange-400 font-bold text-lg">${product.price}</p>

      {/* 🛒 ACTION */}
      <CommonButton className="mt-auto flex items-center justify-center gap-2">
        <ShoppingCart size={16} />
        Add to Cart
      </CommonButton>
    </GlassCard>
  );
}
