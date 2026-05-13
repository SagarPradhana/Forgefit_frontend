import { motion } from "framer-motion";

export const themeStyles = {
  theme1: {
    label: "Midnight Nebula",
    background: "radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.45) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(6, 78, 59, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(67, 56, 202, 0.15) 0%, transparent 70%)",
    accent: "from-indigo-500 to-blue-400",
    textColor: "text-white",
    bgColor: "bg-[#030712]",
    cardBg: "bg-slate-900/40",
    sidebarGradient: "linear-gradient(165deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 100%)",
    borderColor: "border-indigo-500/20",
    shadowColor: "shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)]",
    particleColor: "bg-indigo-400/40",
    glow: "rgba(99, 102, 241, 0.5)",
  },
  theme2: {
    label: "Royal Amethyst",
    background: "radial-gradient(circle at 0% 0%, rgba(88, 28, 135, 0.45) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(131, 24, 67, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 10% , rgba(168, 85, 247, 0.1), transparent 60%)",
    accent: "from-purple-500 to-fuchsia-400",
    textColor: "text-white",
    bgColor: "bg-[#0a0510]",
    cardBg: "bg-purple-950/20",
    sidebarGradient: "linear-gradient(165deg, rgba(46, 16, 101, 0.95) 0%, rgba(15, 7, 21, 1) 100%)",
    borderColor: "border-purple-500/20",
    shadowColor: "shadow-[0_0_50px_-12px_rgba(168,85,247,0.2)]",
    particleColor: "bg-purple-400/40",
    glow: "rgba(168, 85, 247, 0.5)",
  },
  theme3: {
    label: "Emerald Aurora",
    background: "radial-gradient(circle at 0% 0%, rgba(6, 78, 59, 0.45) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(21, 94, 117, 0.35) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1), transparent 60%)",
    accent: "from-emerald-500 to-teal-400",
    textColor: "text-white",
    bgColor: "bg-[#020e0b]",
    cardBg: "bg-emerald-950/20",
    sidebarGradient: "linear-gradient(165deg, rgba(6, 78, 59, 0.95) 0%, rgba(2, 44, 34, 1) 100%)",
    borderColor: "border-emerald-500/20",
    shadowColor: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]",
    particleColor: "bg-emerald-400/40",
    glow: "rgba(16, 185, 129, 0.5)",
  },
  theme4: {
    label: "Solar Flare",
    background: "radial-gradient(circle at 0% 0%, rgba(154, 52, 18, 0.45) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(30, 58, 138, 0.35) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(249, 115, 22, 0.1), transparent 60%)",
    accent: "from-orange-500 to-amber-400",
    textColor: "text-white",
    bgColor: "bg-[#0c0500]",
    cardBg: "bg-orange-950/20",
    sidebarGradient: "linear-gradient(165deg, rgba(124, 45, 18, 0.95) 0%, rgba(28, 10, 0, 1) 100%)",
    borderColor: "border-orange-500/20",
    shadowColor: "shadow-[0_0_50px_-12px_rgba(249,115,22,0.2)]",
    particleColor: "bg-orange-400/40",
    glow: "rgba(249, 115, 22, 0.5)",
  },
  theme5: {
    label: "Golden Horizon",
    background: "radial-gradient(circle at 0% 0%, rgba(120, 53, 15, 0.45) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(8, 51, 68, 0.35) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(245, 158, 11, 0.1), transparent 70%)",
    accent: "from-amber-500 to-yellow-400",
    textColor: "text-white",
    bgColor: "bg-[#0f0a00]",
    cardBg: "bg-amber-950/20",
    sidebarGradient: "linear-gradient(165deg, rgba(120, 53, 15, 0.95) 0%, rgba(26, 15, 0, 1) 100%)",
    borderColor: "border-amber-500/20",
    shadowColor: "shadow-[0_0_50px_-12px_rgba(245,158,11,0.2)]",
    particleColor: "bg-amber-400/40",
    glow: "rgba(245, 158, 11, 0.5)",
  },
};

export function AnimatedBackground({
  colorTheme,
}: {
  colorTheme: keyof typeof themeStyles;
}) {
  const currentTheme = themeStyles[colorTheme];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#02040a]">
      {/* Dynamic Mesh Base */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          backgroundImage: currentTheme.background,
        }}
      />

      {/* Animated Mesh Blobs */}
      <div className="absolute inset-0 filter blur-[120px] opacity-40 mix-blend-screen">
        <motion.div
          animate={{
            x: [0, 150, -50, 0],
            y: [0, 80, 120, 0],
            scale: [1, 1.4, 0.8, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full"
          style={{ background: `radial-gradient(circle, ${currentTheme.glow}33 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{
            x: [0, -120, 100, 0],
            y: [0, -100, -60, 0],
            scale: [1, 1.2, 1.5, 1],
            rotate: [0, -60, 60, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[900px] h-[900px] rounded-full"
          style={{ background: `radial-gradient(circle, ${currentTheme.glow}22 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-[100%] rotate-45"
          style={{ background: `radial-gradient(circle, ${currentTheme.glow}11 0%, transparent 70%)` }}
        />
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-[2px] h-[2px] rounded-full ${currentTheme.particleColor}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Premium Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Theme-Specific Base Overlay */}
      <div className={`absolute inset-0 -z-20 ${currentTheme.bgColor} transition-colors duration-1000`} />
    </div>
  );
}
