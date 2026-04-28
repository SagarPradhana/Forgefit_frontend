import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CommonButton,
  CommonCard,
  InputField,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { useAuthStore } from "../../store/authStore";
import { Dumbbell, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import { useMutation } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/url";

export function SignInPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: performLogin, loading } = useMutation("post", {
    onSuccess: (response) => {
      const { access_token, refresh_token } = response;
      if (!access_token || !refresh_token) return;

      login(access_token, refresh_token);

      const base64Url = access_token.split(".")[1];
      const decoded = JSON.parse(atob(base64Url.replace(/-/g, "+").replace(/_/g, "/")));
      const role = decoded?.role || "user";

      navigate(`/${role}/dashboard`);
    },
  });

  const handleRealSignIn = async () => {
    if (!email || !password) return;

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
      <div className="min-h-[80vh] grid md:grid-cols-2 items-center gap-10 overflow-hidden">
        {/* 🔥 LEFT SIDE (VISUAL SECTION) */}
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:flex flex-col justify-center space-y-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-orange-400 shadow-lg shadow-indigo-500/20"
            >
              <Dumbbell className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight">ForgeFit</h2>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold leading-tight"
          >
            Transform Your Body <br />
            <span className="bg-gradient-to-r from-indigo-400 via-white to-orange-400 bg-clip-text text-transparent">
              Build Your Strength
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-slate-300 max-w-md"
          >
            Join thousands of members achieving their fitness goals with
            personalized training, smart tracking, and expert coaching.
          </motion.p>

          {/* STATS */}
          <div className="flex gap-8 text-sm text-slate-400 pt-4">
            {[
              { label: "Members", value: "500+" },
              { label: "Trainers", value: "50+" },
              { label: "Transformations", value: "1200+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 💎 RIGHT SIDE (FORM) */}
        <motion.div 
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <CommonCard className="p-6 md:p-10 backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Sparkles className="text-orange-400 h-12 w-12" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back 👋</h2>
              <p className="text-slate-400 mb-8">
                Sign in to continue your journey
              </p>
            </motion.div>

            {/* FORM */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <InputField
                  placeholder="Email address"
                  value={email}
                  onChange={(e: any) => setEmail(e)}
                  className="bg-white/5 focus:bg-white/10 transition-all border-white/10 focus:border-indigo-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <InputField
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e)}
                  className="pr-12 bg-white/5 focus:bg-white/10 transition-all border-white/10 focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>

              {/* FORGOT */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end"
              >
                <Link to="/forgot-password">
                  <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                    Forgot password?
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <CommonButton
                  className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] pulse-glow-hover"
                  disabled={loading}
                  onClick={handleRealSignIn}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Sign In"
                  )}
                </CommonButton>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-slate-500 text-sm pt-2"
              >
                Don't have an account? <Link to="/contact" className="text-orange-400 hover:underline font-medium">Join us</Link>
              </motion.p>
            </div>
          </CommonCard>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
