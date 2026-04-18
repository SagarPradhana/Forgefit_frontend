import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
import { CommonButton } from "./primitives";

export function NotFound404() {
  return (
    <div className="min-h-screen bg-hero-gradient text-white flex items-center justify-center">
      <div className="max-w-md text-center px-6">
        {/* ICON */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-r from-red-500/20 to-orange-400/20 mx-auto">
          <AlertCircle size={48} className="text-red-400" />
        </div>

        {/* ERROR CODE */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-3">
          404
        </h1>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>

        {/* DESCRIPTION */}
        <p className="text-slate-300 mb-8">
          Oops! It looks like you've wandered off the fitness path. The page
          you're looking for doesn't exist. Let's get you back on track!
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="flex-1">
            <CommonButton className="w-full flex items-center justify-center gap-2">
              <Home size={18} />
              Go Home
            </CommonButton>
          </Link>
          <Link to="/contact" className="flex-1">
            <CommonButton variant="secondary" className="w-full">
              Contact Support
            </CommonButton>
          </Link>
        </div>

        {/* DECORATION */}
        <div className="mt-12 text-slate-500">
          <p className="text-sm">🏋️ Looks like this page skipped leg day!</p>
        </div>
      </div>
    </div>
  );
}
