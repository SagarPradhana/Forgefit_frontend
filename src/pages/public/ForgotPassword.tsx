import { useState } from "react";
import { PublicLayout } from "../../layouts/PublicLayout";
import {
  CommonButton,
  CommonCard,
  InputField,
} from "../../components/ui/primitives";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <CommonCard className="p-8 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            {!submitted ? (
              <>
                {/* 🔙 BACK */}
                <Link
                  to="/signin"
                  className="flex items-center gap-2 text-sm text-slate-400 mb-4 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>

                {/* 📩 ICON */}
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                    <Mail />
                  </div>
                </div>

                {/* TITLE */}
                <h2 className="text-2xl font-bold text-center mb-2">
                  Forgot Password?
                </h2>

                <p className="text-slate-400 text-center mb-6">
                  Enter your email and we’ll send you a reset link.
                </p>

              {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <InputField
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e: any) => setEmail(e)}
                    />
                    {error && (
                      <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>
                    )}
                  </div>

                  <CommonButton
                    type="submit"
                    className="w-full h-11"
                  >
                    Send Reset Link
                  </CommonButton>
                </form>
              </>
            ) : (
              <>
                {/* ✅ SUCCESS STATE */}
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    ✓
                  </div>

                  <h2 className="text-xl font-semibold">Check Your Email</h2>

                  <p className="text-slate-400 text-sm">
                    We’ve sent a password reset link to <br />
                    <span className="text-white">{email}</span>
                  </p>

                  <Link to="/signin">
                    <CommonButton className="w-full mt-4">
                      Back to Sign In
                    </CommonButton>
                  </Link>
                </div>
              </>
            )}
          </CommonCard>
        </div>
      </div>
    </PublicLayout>
  );
}
