import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Home,
  Info,
  Briefcase,
  CreditCard,
  MessageSquare,
  Phone,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { CommonButton } from "../components/ui/primitives";
import { ThemeProvider } from "../components/ui/ThemeProvider";
import { Footer } from "../components/common/Footer";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import "../styles/public_redesign.css";

// ?? ANIMATED NAV COMPONENT
function AnimatedNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t("home"), icon: Home },
    { path: "/about", label: t("about"), icon: Info },
    { path: "/services", label: t("services"), icon: Briefcase },
    { path: "/pricing", label: t("pricing"), icon: CreditCard },
    { path: "/testimonials", label: t("testimonials"), icon: MessageSquare },
    { path: "/contact", label: t("contact"), icon: Phone },
  ];

  return (
    <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-1 relative">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;

        return (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className="relative px-4 h-10 flex items-center gap-2 text-sm z-10 nav-link-underline"
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/30 to-orange-400/30 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.45)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <span
              className={`flex items-center gap-2 transition-colors ${isActive ? "text-white" : "text-slate-300 hover:text-white"
                }`}
            >
              <Icon size={16} />
              {label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
}

// ?? MOBILE MENU COMPONENT
function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t("home"), icon: Home },
    { path: "/about", label: t("about"), icon: Info },
    { path: "/services", label: t("services"), icon: Briefcase },
    { path: "/pricing", label: t("pricing"), icon: CreditCard },
    { path: "/testimonials", label: t("testimonials"), icon: MessageSquare },
    { path: "/contact", label: t("contact"), icon: Phone },
  ];

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-64 bg-slate-950/95 backdrop-blur-xl border-l border-white/10 z-40 lg:hidden overflow-y-auto"
      >
        <div className="flex flex-col p-6 space-y-2 pt-20">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                end={path === "/"}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                  ? "bg-gradient-to-r from-indigo-500/30 to-orange-400/30 border border-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5"
                  }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            );
          })}
          <Link to="/signin" onClick={onClose}>
            <CommonButton className="w-full h-10 flex items-center justify-center mt-4">
              {t("login")}
            </CommonButton>
          </Link>
        </div>
      </motion.div>
    </>
  );
}

import { useGymStore } from "../store/gymStore";

function FloatingWhatsAppButton() {
  const { publicAppConfig } = useGymStore();
  const whatsappNumber = (publicAppConfig?.whatsapp || "").replace(/[^\d]/g, "");

  if (!whatsappNumber) return null;

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      drag
      dragMomentum={false}
      dragElastic={0.08}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[70] flex h-16 w-16 cursor-grab items-center justify-center rounded-full border border-white/15 bg-[#25D366] text-white shadow-[0_16px_40px_rgba(37,211,102,0.35)] active:cursor-grabbing"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const { publicAppConfig, isLoadingPublicData } = useGymStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-hero-gradient text-white public-redesign">
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-300 ${isScrolled ? "bg-slate-950/80 backdrop-blur-md py-2" : "bg-slate-950/60 backdrop-blur-xl py-4"
            }`}
        >
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 sm:px-6">
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <motion.span
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-indigo-500/50 via-violet-500/35 to-orange-400/45 shadow-[0_0_25px_rgba(99,102,241,0.45)] group-hover:shadow-glow transition-all overflow-hidden"
              >
                {isLoadingPublicData ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : publicAppConfig?.logo_image_path ? (
                  <img src={publicAppConfig.logo_image_path} alt={publicAppConfig.brand_name} className="h-full w-full object-cover" />
                ) : (
                  <Dumbbell size={18} />
                )}
              </motion.span>
              <span className="text-sm sm:text-lg font-semibold tracking-tight">
                {isLoadingPublicData ? "" : (publicAppConfig?.brand_name || (
                  <>
                    Forge
                    <span className="bg-gradient-to-r from-indigo-300 via-white to-orange-300 bg-clip-text text-transparent">
                      Fit
                    </span>
                  </>
                ))}
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-3">
              <AnimatedNav />
              <LanguageSwitcher />
              <Link to="/signin">
                <CommonButton className="h-10 px-5 flex items-center pulse-glow-hover transition-all">
                  {t("login")}
                </CommonButton>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.header>

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className={`flex-grow mx-auto w-full max-w-[1600px] ${location.pathname === "/" ? "" : "px-4 sm:px-6 py-6 sm:py-10 pt-24 lg:pt-32"}`}>
          {children}
        </main>

        <FloatingWhatsAppButton />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

