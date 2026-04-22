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
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import { useNotificationStore } from "../store/notificationStore";
import { NotificationModal } from "../components/ui/NotificationModal";
import { useGymStore } from "../store/gymStore";

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
      accent: "from-blue-600 to-emerald-500",
      navGradient:
        "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(16,185,129,0.25))",
      textColor: "text-slate-900",
      bgColor: "bg-slate-50",
      cardBg: "bg-white/90",
      sidebarBg: "bg-white/80",
      borderColor: "border-slate-200/60",
      shadowColor: "shadow-slate-200/50",
      particleColor: "bg-slate-400/30",
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
        "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.12), transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1), transparent 50%)",
      accent: "from-purple-600 to-pink-500",
      navGradient:
        "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.25))",
      textColor: "text-slate-900",
      bgColor: "bg-slate-50",
      cardBg: "bg-white/90",
      sidebarBg: "bg-white/80",
      borderColor: "border-slate-200/60",
      shadowColor: "shadow-slate-200/50",
      particleColor: "bg-slate-400/30",
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
        "radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.12), transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.1), transparent 50%)",
      accent: "from-emerald-600 to-cyan-500",
      navGradient:
        "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(34,211,238,0.25))",
      textColor: "text-slate-900",
      bgColor: "bg-slate-50",
      cardBg: "bg-white/90",
      sidebarBg: "bg-white/80",
      borderColor: "border-slate-200/60",
      shadowColor: "shadow-slate-200/50",
      particleColor: "bg-slate-400/30",
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
        "radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.12), transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1), transparent 50%)",
      accent: "from-orange-600 to-blue-500",
      navGradient:
        "linear-gradient(135deg, rgba(249,115,22,0.3), rgba(59,130,246,0.25))",
      textColor: "text-slate-900",
      bgColor: "bg-slate-50",
      cardBg: "bg-white/90",
      sidebarBg: "bg-white/80",
      borderColor: "border-slate-200/60",
      shadowColor: "shadow-slate-200/50",
      particleColor: "bg-slate-400/30",
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
        "radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.12), transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.1), transparent 50%)",
      accent: "from-amber-600 to-sky-500",
      navGradient:
        "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(34,211,238,0.25))",
      textColor: "text-slate-900",
      bgColor: "bg-slate-50",
      cardBg: "bg-white/90",
      sidebarBg: "bg-white/80",
      borderColor: "border-slate-200/60",
      shadowColor: "shadow-slate-200/50",
      particleColor: "bg-slate-400/30",
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
  isMobile,
  onClose,
}: {
  colorTheme: keyof typeof themeStyles;
  systemTheme: "light" | "dark";
  isMobile: boolean;
  onClose?: () => void;
}) {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const currentTheme = themeStyles[colorTheme][systemTheme];
  const isLight = systemTheme === "light";

  const links =
    role === "admin"
      ? [
        { name: "dashboard", icon: LayoutDashboard, label: t("dashboard") },
        { name: "users", icon: Users, label: t("users") },
        { name: "attendance", icon: Bell, label: t("attendance") },
        { name: "subscriptions", icon: CreditCard, label: t("subscription") },
        { name: "payments", icon: CreditCard, label: t("payments") },
        { name: "products", icon: Box, label: t("products") },
        { name: "settings", icon: Settings, label: t("settings") },
        { name: "inquiries", icon: Bell, label: "Inquiries" },
      ]
      : [
        { name: "dashboard", icon: LayoutDashboard, label: t("dashboard") },
        { name: "subscription", icon: CreditCard, label: t("subscription") },
        { name: "attendance", icon: Users, label: t("attendance") },
        { name: "payments", icon: CreditCard, label: t("payments") },
        { name: "products", icon: Box, label: t("products") },
      ];

  return (
    <motion.aside
      animate={{
        width: collapsed ? 80 : 240,
      }}
      initial={false}
      className={`relative flex h-full flex-col rounded-2xl ${currentTheme.borderColor} ${currentTheme.sidebarBg} backdrop-blur-3xl p-4 shadow-2xl overflow-x-hidden select-none transition-colors duration-300`}
    >
      {/* 🔥 LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`mb-8 flex ${collapsed ? "flex-col items-center gap-6" : "items-center justify-between gap-3"} transition-all duration-300`}
      >
        <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-2"}`}>
          <div
            className={`h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br ${currentTheme.accent} shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Dumbbell size={20} className="text-white" />
            </motion.div>
          </div>
          {!collapsed && (
            <motion.span
              key="brand-name"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`font-black text-lg tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}
            >
              ForgeFit
            </motion.span>
          )}
        </div>

        {/* COLLAPSE/CLOSE BUTTON */}
        <button
          className={`${isMobile ? "inline-flex" : "hidden md:inline-flex"} h-9 w-9 items-center justify-center rounded-xl bg-slate-500/5 hover:bg-slate-500/10 ${isLight ? "text-slate-600 hover:text-indigo-600" : "text-slate-400 hover:text-white"} transition-all duration-200`}
          onClick={() => {
            if (isMobile && onClose) {
              onClose();
            } else {
              setCollapsed(!collapsed);
            }
          }}
        >
          {isMobile ? (
            <X className="h-6 w-6" />
          ) : (
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          )}
        </button>
      </motion.div>

      {/* NAV */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-1 pr-1 custom-scrollbar">
        {links.map(({ name, icon: Icon, label }) => {
          const path = `/${role}/${name}`;
          const isActive = location.pathname === path;

          return (
            <NavLink
              key={name}
              to={path}
              onClick={() => {
                if (isMobile && onClose) onClose();
              }}
              className={`relative flex ${collapsed ? "justify-center" : "items-center gap-3 px-3"} py-2.5 rounded-xl transition-all duration-200 hover:scale-105 group overflow-hidden ${isActive ? "text-white" : isLight ? "text-slate-600 hover:text-indigo-600" : "text-slate-400 hover:text-white"}`}
            >
              {/* ACTIVE BG */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${currentTheme.accent} shadow-lg shadow-indigo-500/20`}
                />
              )}

              <Icon size={18} className="relative z-10 shrink-0" />

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative z-10 capitalize text-sm font-black tracking-tight whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}

              {/* TOOLTIP (Only for desktop collapsed) */}
              {collapsed && !isMobile && (
                <div className="fixed left-20 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[1000] border border-white/10 shadow-2xl translate-x-2 group-hover:translate-x-0">
                  {label}
                </div>
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
        className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10"
      >
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className={`group w-full flex ${collapsed ? "justify-center px-0" : "items-center gap-3 px-4"} py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] border border-transparent ${isLight
            ? "text-red-600 hover:bg-red-50 hover:border-red-100"
            : "text-red-400 hover:bg-red-500/10 hover:border-red-500/20 shadow-lg shadow-red-500/0 hover:shadow-red-500/5"} shadow-sm`}
        >
          <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-black uppercase tracking-widest"
            >
              {t("logout")}
            </motion.span>
          )}
        </button>
      </motion.div>
    </motion.aside>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, name: authName } = useAuthStore();
  const systemTheme = useSystemTheme();
  const { dashboardColorTheme: colorTheme, setDashboardColorTheme: setColorTheme } = useGymStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [notiModalOpen, setNotiModalOpen] = useState(false);
  const { notifications } = useNotificationStore();
  const unreadCount = notifications?.filter?.(n => !n?.read)?.length;

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window?.innerWidth < 1024);
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, []);

  // Close menus on clicks outside
  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeMenu = () => setProfileMenuOpen(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [profileMenuOpen]);

  const currentTheme = themeStyles?.[colorTheme]?.[systemTheme];
  const colorThemeKeys = Object?.keys?.(themeStyles) as Array<
    keyof typeof themeStyles
  >;

  const nextColorTheme = () => {
    const nextIndex =
      (colorThemeKeys.indexOf(colorTheme) + 1) % colorThemeKeys.length;
    setColorTheme(colorThemeKeys[nextIndex]);
  };

  return (
    <div
      className={`relative h-screen min-h-screen overflow-hidden overflow-x-hidden ${systemTheme} ${systemTheme === "light" ? "text-slate-900" : "text-white"}`}
    >
      <Helmet>
        <title>{`${role === 'admin' ? 'Admin' : 'Member'} Portal | ${authName || 'ForgeFit'}`}</title>
      </Helmet>
      {/* 🔥 ENHANCED ANIMATED BACKGROUND */}
      <AnimatedBackground colorTheme={colorTheme} systemTheme={systemTheme} />

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[90] bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="flex h-full gap-0 lg:gap-6 p-2 md:p-4 lg:p-6">
        <div
          className={`fixed inset-y-0 left-0 z-[100] w-[280px] transform transition-transform duration-300 lg:relative lg:w-auto lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="h-full p-4 lg:p-0">
            <Sidebar
              colorTheme={colorTheme}
              systemTheme={systemTheme}
              isMobile={isMobile}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>

        {/* 📊 MAIN CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-1 flex-col gap-4 min-w-0 overflow-hidden"
        >
          {/* 🔝 TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`relative z-[60] rounded-2xl lg:rounded-3xl ${currentTheme.borderColor} ${currentTheme.cardBg} p-2.5 lg:p-4 ${currentTheme.shadowColor} backdrop-blur-xl mx-0 mt-2 lg:mx-0 lg:mt-0`}
          >
            <div className="flex items-center justify-between gap-2 lg:gap-3">
              <div className="flex items-center gap-2 lg:gap-3">
                {/* HAMBURGER FOR MOBILE */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 lg:hidden shrink-0 transition-colors"
                >
                  <Menu size={20} />
                </button>

                <div
                  className={`flex items-center gap-1.5 lg:gap-3 rounded-2xl lg:rounded-3xl ${currentTheme.borderColor} ${systemTheme === "light" ? "bg-gray-100/70" : "bg-slate-950/70"} px-2 lg:px-3 py-1.5 lg:py-2 shadow-inner`}
                >
                  <div
                    className="relative cursor-pointer p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setNotiModalOpen(true)}
                  >
                    <Bell
                      size={isMobile ? 18 : 18}
                      className={
                        systemTheme === "light"
                          ? "text-orange-500"
                          : "text-orange-300"
                      }
                    />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-3.5 min-w-[14px] px-0.5 flex items-center justify-center bg-red-500 text-white text-[8px] font-black rounded-full animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={nextColorTheme}
                    className={`inline-flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full border transition-all hover:scale-105 ${systemTheme === "light"
                      ? "border-gray-300/50 bg-gray-200/30 text-gray-600 hover:bg-gray-300/50"
                      : "border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
                      }`}
                    title={`Switch theme`}
                  >
                    <Palette size={isMobile ? 16 : 18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-4 overflow-visible shrink-0 relative">
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>

                <div className="relative">
                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileMenuOpen(!profileMenuOpen);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative inline-flex items-center gap-2 lg:gap-3 rounded-2xl border ${currentTheme.borderColor} ${systemTheme === "light" ? "bg-white shadow-sm" : "bg-slate-900 border-white/5 shadow-2xl"} pl-2 pr-3 lg:pl-2 lg:pr-4 py-1.5 backdrop-blur-xl cursor-pointer transition-all duration-300 hover:border-indigo-500/50`}
                  >
                    {/* Premium Avatar Circle */}
                    <div className="relative h-8 w-8 lg:h-9 lg:w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                        <User size={isMobile ? 16 : 16} className="text-white" />
                      </div>
                      {/* Online Status Dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-lg" />
                    </div>

                    <div className="flex flex-col items-start leading-none gap-0.5 overflow-hidden">
                      <span
                        className={`text-[10px] lg:text-[11px] font-black uppercase tracking-tighter bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-500 truncate max-w-[60px] md:max-w-[120px]`}
                      >
                        {authName || role || "Account"}
                      </span>
                      <span className="text-[7px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] text-slate-500 group-hover:text-amber-400 transition-colors whitespace-nowrap">
                        {role === "admin" ? "Master Admin" : "Active Member"}
                      </span>
                    </div>

                    {/* Subtle Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-all duration-300 -z-10" />
                  </motion.div>

                  {/* 💎 USER POPUP MENU */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute right-0 mt-2 w-64 rounded-2xl border-2 ${currentTheme.borderColor} ${systemTheme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'} shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 z-[1000] ring-1 ring-white/10`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-3 border-b border-white/10 mb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-none">Accessing Account</p>
                          <p className={`text-[13px] font-black truncate uppercase tracking-tight ${systemTheme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
                            {authName || "User Account"}
                          </p>
                        </div>

                        <div className="space-y-1 relative">
                          <button
                            onClick={() => {
                              navigate(`/${role}/profile`);
                              setProfileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-indigo-500/10 transition-all group ${systemTheme === 'light' ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-300 hover:text-white'}`}
                          >
                            <User size={16} className={`${systemTheme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                            <span className="text-[11px] font-black uppercase tracking-widest">My Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              navigate(`/${role}/change-password`);
                              setProfileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-amber-500/10 transition-all group ${systemTheme === 'light' ? 'text-slate-600 hover:text-amber-600' : 'text-slate-300 hover:text-white'}`}
                          >
                            <Settings size={16} className={`${systemTheme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Change Password</span>
                          </button>
                        </div>

                        <div className="h-px bg-white/10 my-3" />

                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all group shadow-inner"
                        >
                          <LogOut size={16} />
                          <span className="text-[11px] font-black uppercase tracking-widest">Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 📦 CONTENT AREA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`flex-1 min-h-0 overflow-hidden rounded-2xl lg:rounded-3xl ${currentTheme.borderColor} ${systemTheme === "light" ? "bg-gradient-to-b from-gray-50/80 to-white/60" : "bg-gradient-to-b from-white/5 to-white/0"} backdrop-blur-xl shadow-inner`}
          >
            <div className="custom-scrollbar h-full min-h-0 overflow-y-auto p-4 lg:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <NotificationModal
        isOpen={notiModalOpen}
        onClose={() => setNotiModalOpen(false)}
      />
    </div>
  );
}

export default DashboardLayout;
