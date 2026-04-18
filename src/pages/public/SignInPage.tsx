import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CommonButton,
  CommonCard,
  InputField,
} from "../../components/ui/primitives";
import { PublicLayout } from "../../layouts/PublicLayout";
import { useAuthStore } from "../../store/authStore";
import { Dumbbell } from "lucide-react";

export function SignInPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoSignIn = (role: "admin" | "user") => {
    login(role);
    navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
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

              <InputField
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e)}
              />

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
                onClick={() => {
                  login("user");
                  navigate("/user/dashboard");
                }}
              >
                Sign In
              </CommonButton>

              {/* DIVIDER */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900/50 text-slate-400">
                    Or try demo
                  </span>
                </div>
              </div>

              {/* DEMO BUTTONS */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDemoSignIn("user")}
                  className="px-4 py-2.5 rounded-lg bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/30 transition"
                >
                  👤 Demo User
                </button>
                <button
                  onClick={() => handleDemoSignIn("admin")}
                  className="px-4 py-2.5 rounded-lg bg-orange-500/20 border border-orange-400/50 text-orange-300 text-sm font-semibold hover:bg-orange-500/30 transition"
                >
                  👨‍💼 Demo Admin
                </button>
              </div>
            </div>
          </CommonCard>
        </div>
      </div>
    </PublicLayout>
  );
}
