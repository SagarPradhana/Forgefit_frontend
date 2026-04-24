import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950 p-6 font-sans">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]" />

          {/* Animated Background Orbs */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-orange-500/10 blur-[120px] animate-pulse delay-700" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-8 md:p-12 text-center backdrop-blur-2xl shadow-2xl shadow-black/50"
          >
            <div className="mx-auto mb-8 h-24 w-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-inner">
              <AlertTriangle size={48} className="text-red-500 animate-bounce" />
            </div>

            <h1 className="mb-4 text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
              System Breach <br />
              <span className="text-red-500 underline decoration-white/10 underline-offset-8">Detected</span>
            </h1>

            <p className="mb-10 text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              We encountered an unexpected diagnostic error. The core module has been suspended to protect your data.
            </p>

            {/* Error Message Trace (Optional/Dev) */}
            <div className="mb-10 rounded-2xl bg-black/40 border border-white/5 p-4 text-left overflow-hidden">
              <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">Error Signature:</p>
              <p className="text-xs font-mono text-red-400/80 truncate font-black tracking-tight">
                {this.state.error?.message || "Unknown Runtime Exception"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-red-500 px-8 py-4 font-black uppercase tracking-widest text-white shadow-xl shadow-red-500/20 transition-all hover:bg-red-400 active:scale-95"
              >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                Initialize Recovery
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-white/5 px-8 py-4 font-black uppercase tracking-widest text-slate-300 border border-white/10 transition-all hover:bg-white/10 hover:text-white"
              >
                <Home size={18} />
                Abort
              </button>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-white/10" />
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">ForgeFit Recovery Protocol v2.4.0</p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
