import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { createPortal } from "react-dom";

export function GlassCard({
  className,
  children,
  style,
  ...props
}: import("framer-motion").HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={clsx(
        "rounded-xl md:rounded-2xl border p-3 md:p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 transform",
        className,
      )}
      style={{
        background: "var(--theme-card-bg, rgba(255,255,255,0.07))",
        borderColor: "var(--theme-border, rgba(255,255,255,0.12))",
        boxShadow: "0 0 50px -12px var(--theme-shadow, rgba(99,102,241,0.15))",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GlowButton({
  children,
  className,
  variant = "secondary",
  ...props
}: import("framer-motion").HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary";
}) {
  const variants = {
    primary: "border-indigo-500/30 bg-indigo-600 shadow-indigo-500/20",
    secondary: "border-orange-500/30 bg-orange-600 shadow-orange-500/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "rounded-xl border px-5 py-2 text-sm font-semibold text-white shadow-glow transition disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
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
        "rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-60",
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
  status: "Active" | "Expired" | "Pending" | "Paid" | "Resolved";
}) {
  const { t } = useTranslation();
  const styles = {
    Active: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30",
    Expired: "bg-red-500/25 text-red-200 border-red-400/30",
    Pending: "bg-amber-500/25 text-amber-200 border-amber-400/30",
    Paid: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30",
    Resolved: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30",
  };
  return (
    <span
      className={clsx("rounded-full border px-3 py-1 text-xs", styles[status])}
    >
      {t(status.toLowerCase())}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-lg",
  hideTitle = false,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  hideTitle?: boolean;
  className?: string;
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={clsx(
          "w-full rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] relative overflow-hidden",
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {!hideTitle && (
          <div className="flex items-center justify-between border-b dark:border-white/10 dark:bg-white/5 [.light_&]:border-slate-200 [.light_&]:bg-slate-50 px-4 md:px-6 py-4">
            <h3 className="text-lg md:text-xl font-bold dark:text-white [.light_&]:text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={clsx(
          "max-h-[85vh] overflow-y-auto px-4 md:px-6 py-5 dark:text-slate-200 [.light_&]:text-slate-700 custom-scrollbar scroll-smooth",
          hideTitle && "pt-0"
        )}>
          {hideTitle && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 rounded-full bg-black/20 p-2 text-white/50 backdrop-blur-md transition hover:bg-black/40 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 md:gap-3 border-t border-white/10 bg-white/5 px-4 md:px-6 py-4">
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
      <GlassCard className="w-full max-w-md dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900 dark:to-indigo-950/90 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)] [.light_&]:border-amber-500/30 [.light_&]:bg-white">
        <h3 className="mb-2 text-lg font-semibold dark:text-white [.light_&]:text-slate-900">{title}</h3>
        <p className="mb-5 text-sm dark:text-slate-300 [.light_&]:text-slate-600">{description}</p>
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
      <h2 className="text-xl md:text-2xl font-semibold dark:text-white [.light_&]:text-slate-900 leading-tight">{title}</h2>
      {subtitle ? <p className="text-xs md:text-sm dark:text-slate-300 [.light_&]:text-slate-600 mt-0.5">{subtitle}</p> : null}
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
    <div
      className="overflow-x-auto rounded-xl border custom-scrollbar"
      style={{ borderColor: "var(--theme-border, rgba(255,255,255,0.10))" }}
    >
      <table className="min-w-full text-xs md:text-sm border-separate border-spacing-0">
        <thead
          className="text-slate-200 text-left"
          style={{ background: "var(--theme-card-bg, rgba(255,255,255,0.08))" }}
        >
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 md:px-4 py-2 md:py-3 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="text-slate-100 hover:bg-white/[0.03] transition-colors"
              style={{ borderTopColor: "var(--theme-border, rgba(255,255,255,0.08))" }}
            >
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-3 md:px-4 py-2 md:py-3 align-middle">
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
    <div className={clsx("relative overflow-hidden rounded-xl bg-white/[0.08] animate-pulse", className)}>
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}

export function SkeletonRows({ n = 5, className }: { n?: number; className?: string }) {
  return (
    <div className={clsx("space-y-3", className)}>
      {[...Array(n)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export function InlineSpinner({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return <Loader2 size={size} className={clsx("animate-spin", className)} />;
}

export function ButtonLoader({
  label,
  loadingLabel,
  loading,
  className,
  spinnerClassName,
}: {
  label: ReactNode;
  loadingLabel?: ReactNode;
  loading?: boolean;
  className?: string;
  spinnerClassName?: string;
}) {
  return (
    <span className={clsx("inline-flex items-center justify-center gap-2", className)}>
      {loading ? <InlineSpinner size={16} className={spinnerClassName} /> : null}
      <span>{loading ? loadingLabel ?? label : label}</span>
    </span>
  );
}

export function LoadingOverlay({
  show,
  label = "Loading...",
  className,
  compact = false,
}: {
  show: boolean;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  if (!show) return null;

  return (
    <div
      className={clsx(
        "absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] border border-white/10 bg-slate-950/70 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center text-white">
        <div className="relative">
          <div className={clsx(
            "rounded-full border border-indigo-400/20 border-t-indigo-400 animate-spin",
            compact ? "h-8 w-8 border-2" : "h-12 w-12 border-[3px]",
          )} />
          {!compact ? (
            <div className="absolute inset-1.5 rounded-full border border-orange-400/20 border-b-orange-400 animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
          ) : null}
        </div>
        <p className={clsx("font-black uppercase tracking-[0.24em] text-white/70", compact ? "text-[9px]" : "text-[10px]")}>
          {label}
        </p>
      </div>
    </div>
  );
}

export function CommonCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={clsx(
        "rounded-2xl border p-5 shadow-xl backdrop-blur-xl transition-all duration-300",
        className,
      )}
      style={{
        background: "var(--theme-card-bg, rgba(255,255,255,0.07))",
        borderColor: "var(--theme-border, rgba(255,255,255,0.12))",
        boxShadow: "0 0 40px -10px var(--theme-shadow, rgba(99,102,241,0.12))",
        ...style,
      }}
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
        "group flex items-center gap-2 rounded-xl border backdrop-blur transition-all duration-300",
        className,
      )}
      style={{
        background: "var(--theme-card-bg, rgba(255,255,255,0.05))",
        borderColor: "var(--theme-border, rgba(255,255,255,0.12))",
      }}
    >
      <Search
        size={16}
        className="text-slate-400 transition group-focus-within:text-indigo-300"
      />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-transparent text-sm outline-none text-white placeholder:text-slate-500"
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
        className="w-full appearance-none rounded-xl border px-3 py-2 pr-9 text-sm text-slate-100 outline-none transition-all duration-300"
        style={{
          background: "var(--theme-card-bg, rgba(255,255,255,0.05))",
          borderColor: "var(--theme-border, rgba(255,255,255,0.12))",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900 text-white">
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
  isPhone = false,
  isNumeric = false,
  style,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  type?: string;
  isPhone?: boolean;
  isNumeric?: boolean;
  style?: React.CSSProperties;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPhone && !isNumeric) return;

    // Allow: Backspace, Tab, Enter, Escape, Delete
    if (["Backspace", "Tab", "Enter", "Escape", "Delete"].includes(e.key)) {
      return;
    }
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) {
      return;
    }
    // Allow: home, end, left, right, up, down
    if (["Home", "End", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      return;
    }
    // Prevent if not a number
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!isPhone && !isNumeric) return;
    const pasteData = e.clipboardData.getData("text");
    if (/[^\d]/.test(pasteData)) {
      e.preventDefault();
      const sanitized = pasteData.replace(/[^\d]/g, "");
      onChange?.(sanitized);
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => {
        let val = e.target.value;
        if (isPhone || isNumeric) {
          val = val.replace(/[^\d]/g, "");
        }
        onChange?.(val);
      }}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      className={clsx(
        "w-full rounded-xl border px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
        className,
      )}
      style={{
        background: "var(--theme-card-bg, rgba(255,255,255,0.05))",
        borderColor: "var(--theme-border, rgba(255,255,255,0.12))",
        ...style,
      }}
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
    <div
      className="rounded-xl border border-dashed p-6 text-center"
      style={{
        background: "var(--theme-card-bg, rgba(255,255,255,0.05))",
        borderColor: "var(--theme-border, rgba(255,255,255,0.18))",
      }}
    >
      <p className="text-lg text-white">{title}</p>
      <p className="text-sm text-slate-300">{hint}</p>
    </div>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-3 mt-6 pt-4 border-t border-white/5">
      <button
        disabled={!hasPrev}
        onClick={onPrev}
        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
        {currentPage} / {totalPages}
      </span>
      <button
        disabled={!hasNext}
        onClick={onNext}
        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}

// Re-export new components
export { LoadingSpinner } from "./LoadingSpinner";
export { NoDataFound } from "./NoDataFound";
export { NotFound404 } from "./NotFound404";
