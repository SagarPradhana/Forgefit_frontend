import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState, useEffect } from "react";
import {
  Bell,
  Box,
  ChevronLeft,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  User,
  Users,
} from "lucide-react";
import { CommonButton } from "../components/ui/primitives";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

// Custom hook to detect system theme preference
function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check initial theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return systemTheme;
}

// Color themes with light and dark variants
const themeStyles = {
  theme1: {
    label: "Theme 1 - Blue & Emerald",
    light: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.12), transparent 50%)",
      accent: "from-blue-500 to-emerald-400",
      navGradient:
        "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(16,185,129,0.2))",
      textColor: "text-gray-900",
      bgColor: "bg-white",
      cardBg: "bg-white",
      sidebarBg: "bg-white",
      borderColor: "border-gray-200",
      shadowColor: "shadow-gray-200",
      particleColor: "bg-gray-400/40",
    },
    dark: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1), transparent 40%)",
      accent: "from-blue-500 to-emerald-400",
      navGradient:
        "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(16,185,129,0.2))",
      textColor: "text-white",
      bgColor: "bg-slate-950",
      cardBg: "bg-slate-900/80",
      sidebarBg: "bg-white/5",
      borderColor: "border-white/10",
      shadowColor: "shadow-xl",
      particleColor: "bg-white/20",
    },
  },
  theme2: {
    label: "Theme 2 - Purple & Pink",
    light: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.12), transparent 50%)",
      accent: "from-purple-500 to-pink-400",
      navGradient:
        "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.2))",
      textColor: "text-gray-900",
      bgColor: "bg-white",
      cardBg: "bg-white",
      sidebarBg: "bg-white",
      borderColor: "border-gray-200",
      shadowColor: "shadow-gray-200",
      particleColor: "bg-gray-400/40",
    },
    dark: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.13), transparent 40%)",
      accent: "from-purple-500 to-pink-400",
      navGradient:
        "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.2))",
      textColor: "text-white",
      bgColor: "bg-slate-950",
      cardBg: "bg-slate-900/80",
      sidebarBg: "bg-white/5",
      borderColor: "border-white/10",
      shadowColor: "shadow-xl",
      particleColor: "bg-white/20",
    },
  },
  theme3: {
    label: "Theme 3 - Green & Cyan",
    light: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.12), transparent 50%)",
      accent: "from-emerald-500 to-cyan-400",
      navGradient:
        "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(34,211,238,0.2))",
      textColor: "text-gray-900",
      bgColor: "bg-white",
      cardBg: "bg-white",
      sidebarBg: "bg-white",
      borderColor: "border-gray-200",
      shadowColor: "shadow-gray-200",
      particleColor: "bg-gray-400/40",
    },
    dark: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.12), transparent 40%)",
      accent: "from-emerald-500 to-cyan-400",
      navGradient:
        "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(34,211,238,0.2))",
      textColor: "text-white",
      bgColor: "bg-slate-950",
      cardBg: "bg-slate-900/80",
      sidebarBg: "bg-white/5",
      borderColor: "border-white/10",
      shadowColor: "shadow-xl",
      particleColor: "bg-white/20",
    },
  },
  theme4: {
    label: "Theme 4 - Orange & Blue",
    light: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.12), transparent 50%)",
      accent: "from-orange-500 to-blue-400",
      navGradient:
        "linear-gradient(135deg, rgba(249,115,22,0.25), rgba(59,130,246,0.2))",
      textColor: "text-gray-900",
      bgColor: "bg-white",
      cardBg: "bg-white",
      sidebarBg: "bg-white",
      borderColor: "border-gray-200",
      shadowColor: "shadow-gray-200",
      particleColor: "bg-gray-400/40",
    },
    dark: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.13), transparent 40%)",
      accent: "from-orange-500 to-blue-400",
      navGradient:
        "linear-gradient(135deg, rgba(249,115,22,0.25), rgba(59,130,246,0.2))",
      textColor: "text-white",
      bgColor: "bg-slate-950",
      cardBg: "bg-slate-900/80",
      sidebarBg: "bg-white/5",
      borderColor: "border-white/10",
      shadowColor: "shadow-xl",
      particleColor: "bg-white/20",
    },
  },
  theme5: {
    label: "Theme 5 - Amber & Sky",
    light: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.12), transparent 50%)",
      accent: "from-amber-500 to-sky-400",
      navGradient:
        "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(34,211,238,0.2))",
      textColor: "text-gray-900",
      bgColor: "bg-white",
      cardBg: "bg-white",
      sidebarBg: "bg-white",
      borderColor: "border-gray-200",
      shadowColor: "shadow-gray-200",
      particleColor: "bg-gray-400/40",
    },
    dark: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.13), transparent 40%)",
      accent: "from-amber-500 to-sky-400",
      navGradient:
        "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(34,211,238,0.2))",
      textColor: "text-white",
      bgColor: "bg-slate-950",
      cardBg: "bg-slate-900/80",
      sidebarBg: "bg-white/5",
      borderColor: "border-white/10",
      shadowColor: "shadow-xl",
      particleColor: "bg-white/20",
    },
  },
};

// Enhanced Background Component
function AnimatedBackground({
  colorTheme,
  systemTheme,
}: {
  colorTheme: keyof typeof themeStyles;
  systemTheme: "light" | "dark";
}) {
  const currentTheme = themeStyles[colorTheme][systemTheme];
  const isLight = systemTheme === "light";

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: currentTheme.background }}
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: isLight
            ? [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.25), transparent 60%)",
                "radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.2), transparent 60%)",
                "radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.25), transparent 60%)",
                "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.2), transparent 60%)",
              ]
            : [
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2), transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.3), transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2), transparent 50%)",
              ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${currentTheme.particleColor}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Geometric patterns */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M 10 0 L 0 0 0 10`}
                fill="none"
                stroke={isLight ? "rgba(0,0,0,0.1)" : "white"}
                strokeWidth="0.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Base overlay */}
      <div className={`absolute inset-0 -z-20 ${currentTheme.bgColor}`} />
    </div>
  );
}

export function Sidebar({
  colorTheme,
  systemTheme,
}: {
  colorTheme: keyof typeof themeStyles;
  systemTheme: "light" | "dark";
}) {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const currentTheme = themeStyles[colorTheme][systemTheme];
  const isLight = systemTheme === "light";

  const links =
    role === "admin"
      ? [
          { name: "dashboard", icon: LayoutDashboard, label: t("dashboard") },
          { name: "users", icon: Users, label: t("users") },
          { name: "subscriptions", icon: CreditCard, label: t("subscription") },
          { name: "offers", icon: Box, label: t("offers") },
          { name: "payments", icon: CreditCard, label: t("payments") },
          { name: "features", icon: Settings, label: t("features") },
          { name: "settings", icon: Settings, label: t("settings") },
          { name: "notifications", icon: Bell, label: t("notifications") },
        ]
      : [
          { name: "dashboard", icon: LayoutDashboard, label: t("dashboard") },
          { name: "profile", icon: User, label: t("profile") },
          { name: "subscription", icon: CreditCard, label: t("subscription") },
          { name: "attendance", icon: Users, label: t("attendance") },
          { name: "payments", icon: CreditCard, label: t("payments") },
          { name: "products", icon: Box, label: t("products") },
          { name: "settings", icon: Settings, label: t("settings") },
        ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 240 }}
      className={`relative flex h-full min-h-0 flex-col rounded-2xl ${currentTheme.borderColor} ${currentTheme.sidebarBg} backdrop-blur-xl p-4 shadow-2xl overflow-hidden`}
    >
      {/* 🔥 LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <div
            className={`h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${currentTheme.accent} shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Dumbbell size={18} />
            </motion.div>
          </div>
          {!collapsed && (
            <span
              className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}
            >
              ForgeFit
            </span>
          )}
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          className={`hidden md:inline-flex ${isLight ? "text-gray-600 hover:text-gray-800" : "text-gray-400 hover:text-white"} transition-colors`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={`transition ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </motion.div>

      {/* NAV */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1">
        {links.map(({ name, icon: Icon, label }) => {
          const path = `/${role}/${name}`;
          const isActive = location.pathname === path;

          return (
            <NavLink
              key={name}
              to={path}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${isLight ? "text-gray-700 hover:text-gray-900" : "text-gray-300 hover:text-white"}`}
            >
              {/* ACTIVE BG */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-lg shadow-lg"
                  style={{
                    backgroundImage: currentTheme.navGradient,
                    boxShadow: `0 0 20px ${currentTheme.accent.split(" ")[0].replace("from-", "").replace("-500", "")}`,
                  }}
                />
              )}

              <Icon size={18} className="relative z-10" />

              {!collapsed && (
                <span className="relative z-10 capitalize text-sm">
                  {label}
                </span>
              )}

              {/* TOOLTIP */}
              {collapsed && (
                <span
                  className={`absolute left-14 ${isLight ? "bg-gray-800 text-white" : "bg-black text-white"} text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity`}
                >
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* LOGOUT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-4"
      >
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${isLight ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-red-400 hover:text-red-300 hover:bg-red-950/20"}`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">{t("logout")}</span>}
        </button>
      </motion.div>
    </motion.aside>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuthStore();
  const systemTheme = useSystemTheme();
  const [colorTheme, setColorTheme] =
    useState<keyof typeof themeStyles>("theme1");
  const currentTheme = themeStyles[colorTheme][systemTheme];
  const colorThemeKeys = Object.keys(themeStyles) as Array<
    keyof typeof themeStyles
  >;

  const nextColorTheme = () => {
    const nextIndex =
      (colorThemeKeys.indexOf(colorTheme) + 1) % colorThemeKeys.length;
    setColorTheme(colorThemeKeys[nextIndex]);
  };

  return (
    <div
      className={`relative h-screen min-h-screen overflow-hidden ${systemTheme === "light" ? "text-gray-900" : "text-white"}`}
    >
      {/* 🔥 ENHANCED ANIMATED BACKGROUND */}
      <AnimatedBackground colorTheme={colorTheme} systemTheme={systemTheme} />

      <div className="grid h-full lg:grid-cols-[auto_1fr] gap-6 p-4 md:p-6">
        {/* 🧭 SIDEBAR */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-full min-w-0 flex-col gap-6"
        >
          <Sidebar colorTheme={colorTheme} systemTheme={systemTheme} />
        </motion.div>

        {/* 📊 MAIN CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-full min-h-0 flex-col gap-5"
        >
          {/* 🔝 TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-3xl ${currentTheme.borderColor} ${currentTheme.cardBg} p-4 ${currentTheme.shadowColor} backdrop-blur-xl hover:opacity-90 transition-opacity duration-300`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className={`flex items-center gap-3 rounded-3xl ${currentTheme.borderColor} ${systemTheme === "light" ? "bg-gray-100/70" : "bg-slate-950/70"} px-3 py-2 shadow-inner`}
              >
                <Bell
                  className={
                    systemTheme === "light"
                      ? "text-orange-500"
                      : "text-orange-300"
                  }
                />
                <button
                  type="button"
                  onClick={nextColorTheme}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    systemTheme === "light"
                      ? "border-gray-300/50 bg-gray-200/30 text-gray-600 hover:bg-gray-300/50"
                      : "border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
                  }`}
                  title={`Switch theme (current: ${themeStyles[colorTheme].label})`}
                >
                  <Palette size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`text-xs uppercase tracking-[0.25em] ${systemTheme === "light" ? "text-gray-500" : "text-slate-400"}`}
                >
                  {themeStyles[colorTheme].label}
                </div>
                <LanguageSwitcher />
                <div
                  className={`inline-flex items-center gap-2 rounded-full ${currentTheme.borderColor} ${systemTheme === "light" ? "bg-gray-100/70" : "bg-slate-950/70"} px-3 py-2 shadow-inner`}
                >
                  <User
                    className={
                      systemTheme === "light"
                        ? "text-gray-700"
                        : "text-slate-100"
                    }
                  />
                  <span
                    className={`text-sm capitalize ${systemTheme === "light" ? "text-gray-700" : "text-slate-100"}`}
                  >
                    {role}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 📦 CONTENT AREA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`flex-1 min-h-0 overflow-hidden rounded-3xl ${currentTheme.borderColor} ${systemTheme === "light" ? "bg-gradient-to-b from-gray-50/80 to-white/60" : "bg-gradient-to-b from-white/5 to-white/0"} backdrop-blur-xl shadow-inner hover:shadow-2xl transition-shadow duration-300`}
          >
            <div className="custom-scrollbar h-full min-h-0 overflow-y-auto p-4 md:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardLayout;
