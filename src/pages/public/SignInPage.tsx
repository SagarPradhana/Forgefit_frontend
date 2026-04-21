import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CommonButton,
  CommonCard,
  InputField,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { useAuthStore } from "../../store/authStore";
import { Dumbbell, Loader2, Eye, EyeOff } from "lucide-react";
import { useMutation } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/url";

export function SignInPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const { mutate: performLogin, loading } = useMutation("post", {
    onSuccess: (response) => {
      const { access_token, refresh_token } = response.data;
      const decoded = decodeToken(access_token);
      const role = decoded?.role || "user";
      const name = decoded?.name || decoded?.preferred_username || decoded?.username || "authenticated user";
      
      login(role, name, access_token, refresh_token);
      navigate(`/${role}/dashboard`);
    },
  });

  const handleRealSignIn = async () => {
    if (!email || !password) return;

    // Detect login type
    let login_type: "email" | "phone" | "username" = "username";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (emailRegex.test(email)) {
      login_type = "email";
    } else if (phoneRegex.test(email)) {
      login_type = "phone";
    }

    await performLogin(API_ENDPOINTS.AUTH.LOGIN, {
      login_value: email,
      password: password,
      login_type: login_type,
    });
  };

  return (
    <PublicLayout>
      <div className="min-h-[80vh] grid md:grid-cols-2 items-center gap-10">
        {/* 🔥 LEFT SIDE (VISUAL SECTION) */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-orange-400 shadow-lg">
              <Dumbbell />
            </div>
            <h2 className="text-2xl font-bold">ForgeFit</h2>
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Transform Your Body <br />
            <span className="bg-gradient-to-r from-indigo-400 to-orange-400 bg-clip-text text-transparent">
              Build Your Strength
            </span>
          </h1>

          <p className="text-slate-300 max-w-md">
            Join thousands of members achieving their fitness goals with
            personalized training, smart tracking, and expert coaching.
          </p>

          {/* STATS */}
          <div className="flex gap-6 text-sm text-slate-400">
            <div>
              <p className="text-white font-semibold">500+</p>
              Members
            </div>
            <div>
              <p className="text-white font-semibold">50+</p>
              Trainers
            </div>
            <div>
              <p className="text-white font-semibold">1200+</p>
              Transformations
            </div>
          </div>
        </div>

        {/* 💎 RIGHT SIDE (FORM) */}
        <div className="w-full max-w-md mx-auto">
          <CommonCard className="p-8 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-2">Welcome Back 👋</h2>
            <p className="text-slate-400 mb-6">
              Sign in to continue your journey
            </p>

            {/* FORM */}
            <div className="space-y-4">
              <InputField
                placeholder="Email address"
                value={email}
                onChange={(e: any) => setEmail(e)}
              />

              <div className="relative">
                <InputField
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* FORGOT */}
              <div className="flex justify-end">
                <Link to="/forgot-password">
                  <button className="text-sm text-indigo-400 hover:underline">
                    Forgot password?
                  </button>
                </Link>
              </div>

              {/* BUTTON */}
              <CommonButton
                className="w-full h-11 text-base"
                disabled={loading}
                onClick={handleRealSignIn}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Sign In"
                )}
              </CommonButton>
            </div>
          </CommonCard>
        </div>
      </div>
    </PublicLayout>
  );
}
