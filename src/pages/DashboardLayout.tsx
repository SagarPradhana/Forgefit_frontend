import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState, useEffect } from "react";
import {
  Box,
  ChevronLeft,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  TrendingUp,
  User,
  Users,
  Menu,
  X,
  ClipboardList,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

import { useGymStore } from "../store/gymStore";
import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";



import { themeStyles, AnimatedBackground } from "../components/ui/AnimatedBackground";

export function Sidebar({
  colorTheme,
  isMobile,
  onClose,
}: {
  colorTheme: keyof typeof themeStyles;
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
  const currentTheme = themeStyles[colorTheme];


  const links =
    role === "admin"
      ? [
        { name: "dashboard", icon: LayoutDashboard, label: t("dashboard") },
        { name: "users", icon: Users, label: t("users") },
        { name: "attendance", icon: Calendar, label: t("attendance") },
        { name: "subscriptions", icon: CreditCard, label: t("subscription") },
        { name: "payments", icon: CreditCard, label: t("payments") },
        { name: "products", icon: Box, label: t("products") },
        { name: "plans", icon: ClipboardList, label: t("plans") || "Plans" },
        { name: "revenueops", icon: TrendingUp, label: "RevenueOps" },
        { name: "settings", icon: Settings, label: t("settings") },
        { name: "inquiries", icon: MessageSquare, label: t("inquiries") },
      ]
      : role === "trainer"
        ? [
          { name: "dashboard", icon: LayoutDashboard, label: t("dashboard") },
          { name: "users", icon: Users, label: t("users") },
          { name: "attendance", icon: Calendar, label: t("attendance") },
        ]
        : [
          { name: "dashboard", icon: LayoutDashboard, label: t("dashboard") },
          { name: "subscription", icon: CreditCard, label: t("subscription") },
          { name: "attendance", icon: Users, label: t("attendance") },
          { name: "payments", icon: CreditCard, label: t("payments") },
          { name: "products", icon: Box, label: t("products") },
        ];

  const { publicAppConfig } = useGymStore();

  return (
    <motion.aside
      animate={{
        width: collapsed ? 80 : 240,
      }}
      initial={false}
      className={`relative flex h-full flex-col rounded-2xl border ${currentTheme.borderColor} backdrop-blur-3xl p-4 overflow-x-hidden select-none transition-all duration-500`}
      style={{
        background: currentTheme.sidebarGradient,
        boxShadow: `0 25px 50px -12px ${currentTheme.glow || 'rgba(0,0,0,0.5)'}`
      }}
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
            className={`h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br ${currentTheme.accent} shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 relative overflow-hidden`}
          >
            {publicAppConfig?.logo_image_path ? (
              <img src={publicAppConfig.logo_image_path} alt={publicAppConfig.brand_name} className="h-full w-full object-cover" />
            ) : (
              <>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Dumbbell size={20} className="text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 text-yellow-300"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles size={12} fill="currentColor" />
                </motion.div>
              </>
            )}
          </div>
          {!collapsed && (
            <motion.span
              key="brand-name"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`font-black text-lg tracking-tight text-white`}
            >
              {publicAppConfig?.brand_name || "ForgeFit"}
            </motion.span>
          )}
        </div>

        {/* COLLAPSE/CLOSE BUTTON */}
        <button
          className={`${isMobile ? "inline-flex" : "hidden md:inline-flex"} h-9 w-9 items-center justify-center rounded-xl bg-slate-500/5 hover:bg-slate-500/10 text-slate-400 hover:text-white transition-all duration-200`}
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
              className={`relative flex ${collapsed ? "justify-center" : "items-center gap-3 px-3"} py-2.5 rounded-xl transition-all duration-200 hover:scale-105 group overflow-hidden ${isActive ? "text-white" : "text-slate-400 hover:text-white"}`}
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
          className={`group w-full flex ${collapsed ? "justify-center px-0" : "items-center gap-3 px-4"} py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] border border-transparent text-red-400 hover:bg-red-500/10 hover:border-red-500/20 shadow-lg shadow-red-500/0 hover:shadow-red-500/5 shadow-sm`}
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
  const { role, name: authName, id: userId, setUserData } = useAuthStore();
  const { dashboardColorTheme: colorTheme, setDashboardColorTheme: setColorTheme, publicAppConfig } = useGymStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      try {
        const res: any = await api.get(API_ENDPOINTS.USER.MY_DETAILS(userId));
        if (res && res.code === 200) setUserData(res);
      } catch (err) {
        console.error("Failed to sync user data", err);
      }
    };
    fetchUserData();
  }, [userId]);

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

  const currentTheme = themeStyles?.[colorTheme];

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
      className={`relative h-screen min-h-screen overflow-hidden overflow-x-hidden text-white`}
      style={{
        // Inject theme tokens as CSS custom properties so ALL descendants
        // (GlassCard, Table, inputs, etc.) pick them up without needing props.
        "--theme-card-bg": currentTheme.cardBgRaw,
        "--theme-border": currentTheme.borderRaw,
        "--theme-shadow": currentTheme.shadowRaw,
        "--theme-glow": currentTheme.glow,
        "--theme-accent": currentTheme.accentRaw,
      } as React.CSSProperties}
    >
      <Helmet>
        <title>{`${role === 'admin' ? 'Admin' : role === 'trainer' ? 'Trainer' : 'Member'} Portal | ${publicAppConfig?.brand_name || 'ForgeFit'}`}</title>
      </Helmet>
      {/* 🔥 ENHANCED ANIMATED BACKGROUND */}
      <AnimatedBackground colorTheme={colorTheme} />

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

      <div className="flex h-full gap-0 lg:gap-6 p-1.5 md:p-3 lg:p-6">
        <div
          className={`fixed inset-y-0 left-0 z-[100] w-[260px] md:w-[280px] transform transition-transform duration-300 lg:relative lg:w-auto lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="h-full p-2 md:p-4 lg:p-0">
            <Sidebar
              colorTheme={colorTheme}
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
            className={`relative z-[60] rounded-xl lg:rounded-3xl border p-1.5 md:p-2.5 lg:p-4 backdrop-blur-xl mx-0 mt-1 lg:mx-0 lg:mt-0`}
            style={{
              background: currentTheme.cardBgRaw,
              borderColor: currentTheme.borderRaw,
              boxShadow: `0 0 50px -12px ${currentTheme.shadowRaw}`,
            }}
          >
            <div className="flex items-center justify-between gap-2 lg:gap-3">
              <div className="flex items-center gap-2 lg:gap-3">
                {/* HAMBURGER FOR MOBILE */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 lg:hidden shrink-0 transition-colors"
                >
                  <Menu size={18} />
                </button>

                <div
                  className={`flex items-center gap-1.5 lg:gap-3 rounded-2xl lg:rounded-3xl ${currentTheme.borderColor} bg-slate-950/70 px-2 lg:px-3 py-1.5 lg:py-2`}
                  style={{ boxShadow: `inset 0 2px 10px 0 ${currentTheme.glow}11` }}
                >
                  <button
                    type="button"
                    onClick={nextColorTheme}
                    className={`inline-flex h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full border transition-all hover:scale-110 border-white/15 bg-white/5 text-slate-100 hover:bg-white/10`}
                    title={`Switch color palette`}
                  >
                    <Palette size={isMobile ? 14 : 18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-4 overflow-visible shrink-0 relative">
                <div className="flex shrink-0">
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
                    className={`group relative inline-flex items-center gap-1.5 md:gap-2 lg:gap-3 rounded-xl lg:rounded-2xl border ${currentTheme.borderColor} bg-slate-900/60 border-white/5 shadow-2xl pl-1.5 pr-2 md:pl-2 md:pr-3 lg:pl-2 lg:pr-4 py-1 backdrop-blur-2xl cursor-pointer transition-all duration-500 hover:border-indigo-500/50`}
                    style={{ boxShadow: profileMenuOpen ? `0 0 25px -5px ${currentTheme.glow}44` : '' }}
                  >
                    {/* Premium Avatar Circle */}
                    <div className="relative h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 rounded-lg lg:rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 p-[1px] md:p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                      <div className="flex h-full w-full items-center justify-center rounded-[7px] md:rounded-[10px] bg-slate-950">
                        <User size={isMobile ? 14 : 16} className="text-white" />
                      </div>
                      {/* Online Status Dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-lg" />
                    </div>

                    <div className="flex flex-col items-start leading-none gap-0.5 overflow-hidden">
                      <span
                        className={`text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-tighter bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-500 truncate max-w-[40px] xs:max-w-[80px] sm:max-w-[120px]`}
                      >
                        {authName || role || "Account"}
                      </span>
                      <span className="text-[6px] md:text-[7px] font-black uppercase tracking-tight md:tracking-[0.2em] text-slate-500 group-hover:text-amber-400 transition-colors whitespace-nowrap">
                        {role === "admin" ? "Master" : "Active"}
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
                        className={`absolute right-0 mt-2 w-64 rounded-2xl border-2 ${currentTheme.borderColor} bg-slate-950 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 z-[1000] ring-1 ring-white/10`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-3 border-b border-white/10 mb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-none">Accessing Account</p>
                          <p className={`text-[13px] font-black truncate uppercase tracking-tight text-indigo-400`}>
                            {authName || "User Account"}
                          </p>
                        </div>

                        <div className="space-y-1 relative">
                          <button
                            onClick={() => {
                              navigate(`/${role}/profile`);
                              setProfileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-indigo-500/10 transition-all group text-slate-300 hover:text-white`}
                          >
                            <User size={16} className={`text-indigo-400`} />
                            <span className="text-[11px] font-black uppercase tracking-widest">My Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              navigate(`/${role}/change-password`);
                              setProfileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-amber-500/10 transition-all group text-slate-300 hover:text-white`}
                          >
                            <Settings size={16} className={`text-amber-400`} />
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
            className={`flex-1 min-h-0 overflow-hidden rounded-2xl lg:rounded-3xl ${currentTheme.borderColor} bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl shadow-inner`}
          >
            <div className="custom-scrollbar h-full min-h-0 overflow-y-auto p-4 lg:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardLayout;
