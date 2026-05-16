import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Loader2, Search, X, Calendar, User as UserIcon } from "lucide-react";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────────────────────────────────────────
   GLASS CARD
   ───────────────────────────────────────────────────────────────────────────── */
export function GlassCard({ className, children, style, ...props }: import("framer-motion").HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={clsx("rounded-2xl border p-4 md:p-6 backdrop-blur-xl transition-all duration-300 shadow-2xl overflow-hidden relative", className)}
      style={{
        background: "var(--theme-card-bg, rgba(255, 255, 255, 0.05))",
        borderColor: "var(--theme-border, rgba(255, 255, 255, 0.1))",
        boxShadow: "0 8px 32px 0 var(--theme-shadow, rgba(31, 38, 135, 0.15))",
        ...style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BUTTONS
   ───────────────────────────────────────────────────────────────────────────── */
export function GlowButton({ children, className, variant = "primary", ...props }: import("framer-motion").HTMLMotionProps<"button"> & { variant?: "primary" | "secondary"; }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px var(--theme-glow, rgba(99, 102, 241, 0.4))" }}
      whileTap={{ scale: 0.98 }}
      className={clsx("rounded-xl border px-5 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-300 disabled:pointer-events-none disabled:opacity-40 text-white", className)}
      style={{
        background: variant === "primary" ? "var(--theme-accent, linear-gradient(to right, #6366f1, #a855f7))" : "rgba(255,255,255,0.05)",
        borderColor: "var(--theme-border, rgba(255, 255, 255, 0.2))",
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function CommonButton({ children, className, variant = "primary", ...props }: import("framer-motion").HTMLMotionProps<"button"> & { variant?: "primary" | "secondary" | "ghost" | "danger"; }) {
  const styles = {
    primary: "text-white shadow-lg",
    secondary: "text-white shadow-md",
    ghost: "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
    danger: "bg-red-500 text-white shadow-red-500/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx("rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:pointer-events-none disabled:opacity-40", styles[variant], className)}
      style={{
        background: (variant === "primary" || variant === "secondary") ? "var(--theme-accent)" : undefined,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS BADGE
   ───────────────────────────────────────────────────────────────────────────── */
export function StatusBadge({ status }: { status: "Active" | "Expired" | "Pending" | "Paid" | "Resolved"; }) {
  const { t } = useTranslation();
  const styles = {
    Active: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    Expired: "bg-red-500/25 text-red-200 border-red-400/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
    Pending: "bg-amber-500/25 text-amber-200 border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    Paid: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    Resolved: "bg-emerald-500/25 text-emerald-200 border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  };
  return (
    <span className={clsx("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md", styles[status])}>
      {t(status.toLowerCase())}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODALS
   ───────────────────────────────────────────────────────────────────────────── */
export function Modal({
  isOpen,
  open,
  onClose,
  title,
  children,
  footer,
  size = "md"
}: {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const isModalOpen = open ?? isOpen;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={clsx("relative w-full rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden border backdrop-blur-3xl transition-all duration-500", sizes[size])}
        style={{
          background: "var(--theme-card-bg, #0f172a)",
          borderColor: "var(--theme-border, rgba(255,255,255,0.1))",
        }}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X className="w-5 h-5" /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">{children}</div>
        {footer && (
          <div className="px-8 py-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </motion.div>
    </div>,
    document.body,
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
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm" footer={
      <>
        <CommonButton variant="ghost" onClick={onCancel}>Cancel</CommonButton>
        <CommonButton variant="primary" onClick={onConfirm}>Confirm</CommonButton>
      </>
    }>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-tight leading-relaxed">{description}</p>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TABLE
   ───────────────────────────────────────────────────────────────────────────── */
export function Table({ columns, data, onRowClick, emptyMessage }: { columns: { key: string; label: string; render?: (row: any) => ReactNode }[]; data: any[]; onRowClick?: (row: any) => void; emptyMessage?: string; }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 transition-all duration-500" style={{ borderColor: "var(--theme-border)" }}>
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center">
                  <Search className="w-10 h-10 text-slate-700 mb-4" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{emptyMessage || "No registry entries found"}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => onRowClick?.(row)}
                className={clsx("hover:bg-white/5 transition-all duration-300 group", onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-5 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FORM INPUTS
   ───────────────────────────────────────────────────────────────────────────── */
export function InputField({ label, type = "text", value, onChange, placeholder, error, className, isNumeric = false, isPhone = false }: { label?: string; type?: string; value: string; onChange: (value: string) => void; placeholder?: string; error?: string; className?: string; isNumeric?: boolean; isPhone?: boolean; }) {
  return (
    <div className={className}>
      {label && <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</label>}
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => {
            let val = e.target.value;
            if (isNumeric || isPhone) val = val.replace(/[^\d]/g, "");
            onChange(val);
          }}
          placeholder={placeholder}
          className={clsx(
            "w-full px-4 py-3 bg-black/40 border rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none transition-all duration-300",
            error ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "border-white/10 focus:border-indigo-500/50"
          )}
          style={{ borderColor: error ? undefined : "var(--theme-border)" }}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 uppercase mt-1.5 tracking-tight">{error}</p>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, className }: { value: string; onChange: (value: string) => void; placeholder?: string; className?: string; }) {
  return (
    <div className={clsx("relative group", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search registry..."}
        className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
        style={{ borderColor: "var(--theme-border, rgba(255,255,255,0.1))" }}
      />
    </div>
  );
}

export function Dropdown({ value, onChange, options, placeholder, className }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder?: string; className?: string; }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all"
        style={{ borderColor: "var(--theme-border, rgba(255,255,255,0.1))" }}
      >
        <span className="truncate pr-2">{options.find(o => o.value === value)?.label || placeholder || "Select..."}</span>
        <ChevronDown className={clsx("w-4 h-4 text-slate-500 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto custom-scrollbar"
              style={{ background: "var(--theme-card-bg, #0f172a)", borderColor: "var(--theme-border)" }}
            >
              {options.map((option) => (
                <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); }} className={clsx("w-full px-4 py-3 text-left text-xs font-bold transition-colors", value === option.value ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white")}>{option.label}</button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TABS
   ───────────────────────────────────────────────────────────────────────────── */
export function Tabs({ tabs, activeTab, onChange }: { tabs: { id: string; label: string }[]; activeTab: string; onChange: (id: string) => void; }) {
  return (
    <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-white/5 w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300",
              isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-lg shadow-lg"
                style={{ background: "var(--theme-accent, #6366f1)" }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SKELETONS
   ───────────────────────────────────────────────────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("relative overflow-hidden rounded-xl bg-white/[0.08] animate-pulse", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}

export function SkeletonRows({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={clsx("space-y-3", className)}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOADERS & SPINNERS
   ───────────────────────────────────────────────────────────────────────────── */
export function InlineSpinner({ className, size = 16 }: { className?: string; size?: number; }) {
  return <Loader2 size={size} className={clsx("animate-spin", className)} />;
}

export function ButtonLoader({ label, loadingLabel, loading, className, spinnerClassName }: { label: ReactNode; loadingLabel?: ReactNode; loading?: boolean; className?: string; spinnerClassName?: string; }) {
  return (
    <span className={clsx("inline-flex items-center justify-center gap-2", className)}>
      {loading && <InlineSpinner size={16} className={spinnerClassName} />}
      <span>{loading ? loadingLabel ?? label : label}</span>
    </span>
  );
}

export function LoadingOverlay({ show, label = "Synchronizing...", className, compact = false }: { show: boolean; label?: string; className?: string; compact?: boolean; }) {
  if (!show) return null;
  return (
    <div className={clsx("absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] border border-white/10 bg-slate-950/70 backdrop-blur-sm", className)}>
      <div className="flex flex-col items-center gap-3 text-center text-white">
        <div className="relative">
          <div className={clsx("rounded-full border border-indigo-400/20 border-t-indigo-400 animate-spin", compact ? "h-8 w-8 border-2" : "h-12 w-12 border-[3px]")} />
          {!compact && <div className="absolute inset-1.5 rounded-full border border-orange-400/20 border-b-orange-400 animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />}
        </div>
        <p className={clsx("font-black uppercase tracking-[0.24em] text-white/70", compact ? "text-[9px]" : "text-[10px]")}>{label}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGINATION
   ───────────────────────────────────────────────────────────────────────────── */
export function Pagination({ currentPage, totalPages, hasPrev, hasNext, onPrev, onNext }: { currentPage: number; totalPages: number; hasPrev: boolean; hasNext: boolean; onPrev: () => void; onNext: () => void; }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-3 mt-6 pt-4 border-t border-white/5">
      <button disabled={!hasPrev} onClick={onPrev} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">← Prev</button>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">{currentPage} / {totalPages}</span>
      <button disabled={!hasNext} onClick={onNext} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">Next →</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MISC
   ───────────────────────────────────────────────────────────────────────────── */
export function SectionTitle({ title, subtitle, className }: { title: string; subtitle?: string; className?: string; }) {
  return (
    <div className={clsx("mb-6", className)}>
      <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
      {subtitle && <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-12 text-center transition-all duration-500" style={{ background: "var(--theme-card-bg, rgba(255,255,255,0.05))", borderColor: "var(--theme-border, rgba(255,255,255,0.2))" }}>
      <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
      <p className="text-lg font-black text-white uppercase tracking-tight mb-2">{title}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{hint}</p>
    </div>
  );
}

export function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let totalMiliseconds = 1000;
    let incrementTime = (totalMiliseconds / end);
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString()}</span>;
}

// External Components (assumed to exist in same directory)
export { LoadingSpinner } from "./LoadingSpinner";
export { NoDataFound } from "./NoDataFound";
export { NotFound404 } from "./NotFound404";
