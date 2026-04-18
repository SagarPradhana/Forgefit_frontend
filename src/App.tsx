import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import DashboardLayout from "./pages/DashboardLayout";
import { NotFound404, LoadingSpinner } from "./components/ui/primitives";

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

function ProtectedRole({
  expectedRole,
  children,
}: {
  expectedRole: "admin" | "user";
  children: React.ReactNode;
}) {
  const { role, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || role !== expectedRole)
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

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth" element={<Navigate to="/signin" replace />} />
        <Route path="/admin/:page" element={<RoleRoute role="admin" />} />
        <Route path="/user/:page" element={<RoleRoute role="user" />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
}
