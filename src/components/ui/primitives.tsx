import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { createPortal } from "react-dom";

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function GlowButton({
  children,
  className,
  ...props
}: import("framer-motion").HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "rounded-xl border border-orange-300/30 bg-accent px-5 py-2 text-sm font-semibold text-white shadow-glow transition",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function CommonButton({
  children,
  className,
  variant = "primary",
  ...props
}: import("framer-motion").HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles = {
    primary:
      "border-indigo-300/30 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-[0_0_28px_rgba(99,102,241,0.45)] hover:from-indigo-400 hover:to-indigo-300",
    secondary:
      "border-orange-300/30 bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-[0_0_24px_rgba(249,115,22,0.4)] hover:from-orange-400 hover:to-amber-300",
    ghost: "border-white/20 bg-white/5 text-slate-100 hover:bg-white/12",
    danger: "border-red-300/30 bg-red-500/20 text-red-100 hover:bg-red-500/30",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        "rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function StatusBadge({
  status,
}: {
  status: "Active" | "Expired" | "Pending" | "Paid";
}) {
  const styles = {
    Active: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30",
    Expired: "bg-red-500/25 text-red-200 border-red-400/30",
    Pending: "bg-amber-500/25 text-amber-200 border-amber-400/30",
    Paid: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30",
  };
  return (
    <span
      className={clsx("rounded-full border px-3 py-1 text-xs", styles[status])}
    >
      {status}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/80 p-4 pb-10 pt-10 md:pt-20 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 text-slate-200 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 border-t border-white/10 bg-white/5 px-6 py-4">
            {footer}
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}

export function ConfirmationModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md border-amber-300/25 bg-slate-900/70">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mb-5 text-sm text-slate-300">{description}</p>
        <div className="flex justify-end gap-2">
          <CommonButton variant="ghost" onClick={onCancel}>
            Cancel
          </CommonButton>
          <CommonButton variant="secondary" onClick={onConfirm}>
            Confirm
          </CommonButton>
        </div>
      </GlassCard>
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={clsx("mb-4", className)}>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-white/10 text-left text-slate-200">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-white/10 text-slate-100">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("animate-pulse rounded-lg bg-white/10", className)} />
  );
}

export function CommonCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={clsx(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-xl backdrop-blur-xl transition-all duration-300",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur transition-all duration-300 focus-within:border-indigo-300/50 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.25)]",
        className,
      )}
    >
      <Search
        size={16}
        className="text-slate-400 transition group-focus-within:text-indigo-300"
      />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        placeholder={placeholder}
      />
    </div>
  );
}

export function CommonDropdown({
  options,
  value,
  onChange,
  className,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={clsx("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 pr-9 text-sm text-slate-100 outline-none transition-all duration-300 focus:border-indigo-300/50 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

export function InputField({
  placeholder,
  value,
  onChange,
  className,
  type = "text",
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={clsx(
        "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-indigo-300/50 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
        className,
      )}
    />
  );
}

export function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(value / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
        return;
      }
      setCount(current);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
      <p className="text-lg text-white">{title}</p>
      <p className="text-sm text-slate-300">{hint}</p>
    </div>
  );
}

// Re-export new components
export { LoadingSpinner } from "./LoadingSpinner";
export { NoDataFound } from "./NoDataFound";
export { NotFound404 } from "./NotFound404";
