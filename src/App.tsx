import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useGymStore } from "./store/gymStore";
import DashboardLayout from "./pages/DashboardLayout";
import { NotFound404, LoadingSpinner } from "./components/ui/primitives";
import { ToastContainer } from "./components/ui/ToastContainer";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell } from "lucide-react";

const HomePage = lazy(() =>
  import("./pages/public/HomePage").then((m) => ({ default: m.HomePage })),
);
const AboutPage = lazy(() =>
  import("./pages/public/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ServicesPage = lazy(() =>
  import("./pages/public/ServicesPage").then((m) => ({
    default: m.ServicesPage,
  })),
);
const PricingPage = lazy(() =>
  import("./pages/public/PricingPage").then((m) => ({
    default: m.PricingPage,
  })),
);
const TestimonialsPage = lazy(() =>
  import("./pages/public/TestimonialsPage").then((m) => ({
    default: m.TestimonialsPage,
  })),
);
const ContactPage = lazy(() =>
  import("./pages/public/ContactPage").then((m) => ({
    default: m.ContactPage,
  })),
);
const SignInPage = lazy(() =>
  import("./pages/public/SignInPage").then((m) => ({ default: m.SignInPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("./pages/public/ForgotPassword").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const AdminPortalPages = lazy(() =>
  import("./pages/admin/AdminPortalPages").then((m) => ({
    default: m.AdminPortalPages,
  })),
);
const UserPortalPages = lazy(() =>
  import("./pages/user/UserPortalPages").then((m) => ({
    default: m.UserPortalPages,
  })),
);

/** Returns true if the stored JWT token exists and has not expired. */
function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    // exp is in seconds; Date.now() is in ms
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/**
 * Wraps public pages. If the user already has a valid session they are
 * redirected straight to their dashboard — same experience as a native app.
 */
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, token } = useAuthStore();
  if (isAuthenticated && isTokenValid(token)) {
    const dest = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    return <Navigate to={dest} replace />;
  }
  return <>{children}</>;
}

function ProtectedRole({
  expectedRole,
  children,
}: {
  expectedRole: "admin" | "user";
  children: React.ReactNode;
}) {
  const { role, isAuthenticated, token } = useAuthStore();
  if (!isAuthenticated || !isTokenValid(token) || role !== expectedRole)
    return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function RoleRoute({ role }: { role: "admin" | "user" }) {
  const { page = "dashboard" } = useParams();
  return (
    <ProtectedRole expectedRole={role}>
      <DashboardLayout>
        {role === "admin" ? (
          <AdminPortalPages page={page} />
        ) : (
          <UserPortalPages page={page} />
        )}
      </DashboardLayout>
    </ProtectedRole>
  );
}

const LoadingScreen = ({ brandName }: { brandName: string }) => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950"
  >
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center gap-6"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 shadow-glow">
          <Dumbbell size={32} className="text-white" />
        </span>
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          {brandName}
        </h1>
      </div>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="h-full bg-orange-500"
        />
      </div>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { updateAppConfig, setDashboardColorTheme, fetchPublicData, publicAppConfig } = useGymStore();

  const brandName = publicAppConfig?.brand_name || "ForgeFit";

  useEffect(() => {
    fetchPublicData();
  }, []);

  // Update app config and theme based on public data
  useEffect(() => {
    if (publicAppConfig) {
      if (publicAppConfig.theme_name === "dark") {
        setDashboardColorTheme("theme1");
      } else if (publicAppConfig.theme_name === "light") {
        setDashboardColorTheme("theme5");
      }

      updateAppConfig({
        name: publicAppConfig.brand_name,
        logo: publicAppConfig.logo_image_path,
        description: publicAppConfig.description,
        contactEmail: publicAppConfig.email,
        contactPhone: publicAppConfig.phone,
        timezone: publicAppConfig.timezone,
        currency: publicAppConfig.currency,
        language: publicAppConfig.language,
      });
    }
  }, [publicAppConfig]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" brandName={brandName} />}
      </AnimatePresence>
      <div className="cursor-glow" />
      <ToastContainer />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<AuthRedirect><HomePage /></AuthRedirect>} />
          <Route path="/about" element={<AuthRedirect><AboutPage /></AuthRedirect>} />
          <Route path="/services" element={<AuthRedirect><ServicesPage /></AuthRedirect>} />
          <Route path="/pricing" element={<AuthRedirect><PricingPage /></AuthRedirect>} />
          <Route path="/testimonials" element={<AuthRedirect><TestimonialsPage /></AuthRedirect>} />
          <Route path="/contact" element={<AuthRedirect><ContactPage /></AuthRedirect>} />
          <Route path="/signin" element={<AuthRedirect><SignInPage /></AuthRedirect>} />
          <Route path="/forgot-password" element={<AuthRedirect><ForgotPasswordPage /></AuthRedirect>} />
          <Route path="/auth" element={<Navigate to="/signin" replace />} />
          <Route path="/admin/:page" element={<RoleRoute role="admin" />} />
          <Route path="/user/:page" element={<RoleRoute role="user" />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Suspense>
    </div>
  );
}
