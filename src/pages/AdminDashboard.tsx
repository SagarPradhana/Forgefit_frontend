import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, CreditCard, UserPlus, RefreshCw, IndianRupee,
  ShoppingBag, Mail, Bell, Activity,
  ChevronRight, TrendingUp, Clock, Camera,
} from "lucide-react";
import { GlassCard, SectionTitle, SkeletonRows } from "../components/ui/primitives";
import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";
import { DateRangeFilter, type DateRange } from "../components/ui/DateRangeFilter";
import { QRScannerModal } from "../components/admin/users/QRScannerModal";
import { useGymStore } from "../store/gymStore";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    from: start.toISOString().split("T")[0],
    to: now.toISOString().split("T")[0],
  };
};
const toUnix = (d: string | Date, end = false) => {
  if (!d) return undefined;
  const dt = new Date(d);
  end ? dt.setHours(23, 59, 59, 999) : dt.setHours(0, 0, 0, 0);
  return Math.floor(dt.getTime() / 1000);
};
const fmtDate = (ts: number) =>
  ts ? new Date(ts * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const createFmt = (currency: string) => (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(n ?? 0);

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ v }: { v: string }) {
  const val = String(v ?? "").toLowerCase();
  const cls =
    ["paid", "success", "completed", "active"].includes(val)
      ? "bg-emerald-500/20 text-emerald-400"
      : ["failed", "pending", "inactive"].includes(val)
        ? "bg-red-500/20 text-red-400"
        : "bg-indigo-500/20 text-indigo-300";
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cls}`}>{v || "—"}</span>;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, delay, prefix = "", subLabel, subValue, onClick, onSubClick }: {
  label: string; value: any; icon: any; color: string; delay: number; prefix?: string; subLabel?: string; subValue?: any;
  onClick?: () => void; onSubClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl hover:border-white/20 transition-all group flex flex-col justify-between ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 ${color}`} />
      <div>
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} bg-opacity-20 mb-3 group-hover:scale-110 transition-transform`}>
          <Icon size={18} className="text-white" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-tight">{label}</p>
        <p className="text-xl font-black text-white tracking-tighter">{prefix}{value ?? "—"}</p>
      </div>
      {subLabel && (
        <div
          className={`mt-3 pt-3 border-t border-white/5 flex items-center justify-between ${onSubClick ? "cursor-pointer hover:bg-white/5 -mx-5 px-5" : ""}`}
          onClick={(e) => {
            if (onSubClick) {
              e.stopPropagation();
              onSubClick();
            }
          }}
        >
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{subLabel}</p>
          <p className="text-xs font-black text-red-400">{subValue ?? "—"}</p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, onRedirect }: { title: string; sub?: string; onRedirect?: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between w-full">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{sub}</p>
        <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
          {title}
        </h3>
      </div>
      {onRedirect && (
        <button
          onClick={onRedirect}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-indigo-400 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400"
          title={`Go to ${title}`}
        >
          View All
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}


// ─── Custom Tooltip for Bar Chart ─────────────────────────────────────────────
function RevTooltip({ active, payload, label, currency = "INR" }: any) {
  const fmt = createFmt(currency);
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-3 text-xs">
      <p className="font-black text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const monthRange = getMonthRange();

  // Global date range (for most sections) — default: This Month with proper dates
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const fromUnix = toUnix(monthRange.from, false);
    const toUnixVal = toUnix(monthRange.to, true);
    return { label: "This Month", from_date: fromUnix, to_date: toUnixVal };
  });

  // Monthly revenue months param
  const [revenueMonths, setRevenueMonths] = useState(6);

  // Inquiry tab
  const [inqTab, setInqTab] = useState<"subscriptions" | "product_orders" | "contact_inquiries">("subscriptions");

  // Derived months for revenue chart from global dateRange
  const derivedRevenueMonths = useMemo(() => {
    if (!dateRange.from_date || !dateRange.to_date) return revenueMonths;
    const d1 = new Date(dateRange.from_date * 1000);
    const d2 = new Date(dateRange.to_date * 1000);
    const m = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()) + 1;
    return Math.max(1, m);
  }, [dateRange, revenueMonths]);

  // Sync dateRange when revenue months buttons are clicked
  const handleRevenueMonthsChange = useCallback((n: number) => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - (n - 1), 1);
    setDateRange({
      from_date: toUnix(from, false),
      to_date: toUnix(now, true),
      label: `Last ${n} Months`
    });
    setRevenueMonths(n);
  }, []);

  const [scannerOpen, setScannerOpen] = useState(false);

  // ── Data states ──
  const [stats, setStats] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);

  const [loading, setLoading] = useState({
    stats: false, inquiries: false, payments: false,
    subscriptions: false, products: false, attendance: false, revenue: false,
  });

  const setLoad = (key: string, val: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: val }));

  const { appConfig } = useGymStore();
  const currency = appConfig?.currency || "INR";
  const fmt = createFmt(currency);

  // ── Date params helper — uses unix timestamps from DateRange directly ──
  const dateParams = useCallback((range: DateRange) => {
    const p = new URLSearchParams();
    if (range.from_date) p.set("from_date", String(range.from_date));
    if (range.to_date) p.set("to_date", String(range.to_date));
    return p;
  }, []);

  // ── Fetchers ──
  const fetchStats = useCallback(async () => {
    setLoad("stats", true);
    try {
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_STATS}?${dateParams(dateRange)}`);
      if (res && res.code === 200) {
        setStats({
          total_users: res.total_users,
          total_trainers: res.total_trainers,
          total_admins: res.total_admins,
          total_members: res.total_members,
          total_active_subscriptions: res.total_active_subscriptions,
          total_expired_subscriptions: res.total_expired_subscriptions,
          total_no_subscriptions: res.total_no_subscriptions,
          new_registrations: res.new_registrations,
          upcoming_renewals: res.upcoming_renewals,
          total_revenue: res.total_revenue,
        });
      }
    } catch (e) { console.error(e); } finally { setLoad("stats", false); }
  }, [dateRange, dateParams]);

  const fetchInquiries = useCallback(async () => {
    setLoad("inquiries", true);
    try {
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_INQUIRIES}?${dateParams(dateRange)}`);
      if (res?.data) setInquiries(res.data);
    } catch (e) { console.error(e); } finally { setLoad("inquiries", false); }
  }, [dateRange, dateParams]);

  const fetchPayments = useCallback(async () => {
    setLoad("payments", true);
    try {
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_PAYMENTS}?${dateParams(dateRange)}`);
      if (res?.data) setPayments(res.data);
    } catch (e) { console.error(e); } finally { setLoad("payments", false); }
  }, [dateRange, dateParams]);

  const fetchSubscriptions = useCallback(async () => {
    setLoad("subscriptions", true);
    try {
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_SUBSCRIPTIONS}?${dateParams(dateRange)}`);
      if (res?.data) setSubscriptions(res.data);
    } catch (e) { console.error(e); } finally { setLoad("subscriptions", false); }
  }, [dateRange, dateParams]);

  const fetchProducts = useCallback(async () => {
    setLoad("products", true);
    try {
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_PRODUCTS}?${dateParams(dateRange)}`);
      if (res?.data) setProducts(res.data);
    } catch (e) { console.error(e); } finally { setLoad("products", false); }
  }, [dateRange, dateParams]);

  const fetchAttendance = useCallback(async () => {
    setLoad("attendance", true);
    try {
      const p = new URLSearchParams();
      if (dateRange.from_date) p.set("from_date", String(dateRange.from_date));
      if (dateRange.to_date) p.set("to_date", String(dateRange.to_date));
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_ATTENDANCE}?${p}`);
      if (res?.data) setAttendance(res.data);
    } catch (e) { console.error(e); } finally { setLoad("attendance", false); }
  }, [dateRange]);

  const fetchMonthlyRevenue = useCallback(async () => {
    setLoad("revenue", true);
    try {
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_MONTHLY_REVENUE}?months=${derivedRevenueMonths}`);
      if (res?.data) setMonthlyRevenue(res.data);
    } catch (e) { console.error(e); } finally { setLoad("revenue", false); }
  }, [derivedRevenueMonths]);

  // ── Effects ──
  // Single effect - fetches on mount with initial dateRange values

  const refreshAll = useCallback(async () => {
    setLoad("stats", true);
    setLoad("inquiries", true);
    setLoad("payments", true);
    setLoad("subscriptions", true);
    setLoad("products", true);
    setLoad("attendance", true);
    setLoad("revenue", true);

    try {
      await Promise.all([
        fetchStats(),
        fetchInquiries(),
        fetchPayments(),
        fetchSubscriptions(),
        fetchProducts(),
        fetchAttendance(),
        fetchMonthlyRevenue()
      ]);
    } catch (e) {
      console.error("Dashboard refresh error:", e);
    } finally {
      // Loaders are handled inside individual fetchers, but set them false here as backup
      setLoad("stats", false);
      setLoad("inquiries", false);
      setLoad("payments", false);
      setLoad("subscriptions", false);
      setLoad("products", false);
      setLoad("attendance", false);
      setLoad("revenue", false);
    }
  }, [fetchStats, fetchInquiries, fetchPayments, fetchSubscriptions, fetchProducts, fetchAttendance, fetchMonthlyRevenue]);

  useEffect(() => {
    fetchStats();
    fetchInquiries();
    fetchPayments();
    fetchSubscriptions();
    fetchProducts();
    fetchAttendance();
  }, [dateRange]);

  // Revenue chart is INDEPENDENT of the global date filter — only depends on revenueMonths
  useEffect(() => {
    fetchMonthlyRevenue();
  }, [fetchMonthlyRevenue]);

  const isAnyLoading = Object.values(loading).some(Boolean);

  // ── Inquiry tab data ──
  const inqData: any[] = inquiries?.[inqTab] ?? [];
  const inqTabs = [
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "product_orders", label: "Product Orders", icon: ShoppingBag },
    { id: "contact_inquiries", label: "Contact", icon: Mail },
  ] as const;

  return (
    <div className="space-y-6">
      {/* ── Top Header + Global Date Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle title={t("dashboard")} subtitle="Real-time gym intelligence — members, revenue & activity" />
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScannerOpen(true)}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            title={t("scanIdCard")}
          >
            <Camera size={16} />
            {t("scan")}
          </motion.button>
          <DateRangeFilter
            defaultPreset="monthly"
            onChange={(r) => setDateRange(r)}
          />
          <button onClick={refreshAll}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all" title={t("refreshAll")}>
            <RefreshCw size={14} className={isAnyLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── [ROW 1] 5 Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="col-span-2 relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl hover:border-indigo-500/30 transition-all group flex flex-col justify-center gap-4"
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20 bg-indigo-500" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 group-hover:scale-110 transition-transform shrink-0">
              <CreditCard size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-tight">{t("subscriptionOverview")}</p>
              <p className="text-xl font-black text-white tracking-tighter">{t("planStatusTitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 relative z-10">
            <button onClick={() => navigate('/admin/users?plan_status=active')} className="py-2 px-1 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-transparent transition-all flex flex-col items-center group/btn">
              <span className="text-lg font-black text-emerald-400 group-hover/btn:scale-110 transition-transform">{stats?.total_active_subscriptions ?? 0}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{t("active")}</span>
            </button>
            <button onClick={() => navigate('/admin/users?plan_status=expired')} className="py-2 px-1 rounded-xl bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all flex flex-col items-center group/btn">
              <span className="text-lg font-black text-red-400 group-hover/btn:scale-110 transition-transform">{stats?.total_expired_subscriptions ?? 0}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{t("expired")}</span>
            </button>
            <button onClick={() => navigate('/admin/users?plan_status=not_subscribed')} className="py-2 px-1 rounded-xl bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/30 border border-transparent transition-all flex flex-col items-center group/btn">
              <span className="text-lg font-black text-amber-400 group-hover/btn:scale-110 transition-transform">{stats?.total_no_subscriptions ?? 0}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{t("not_subscribed")}</span>
            </button>
          </div>
        </motion.div>
        <StatCard
          label={t("totalUsers")}
          value={stats?.total_users}
          icon={Users}
          color="bg-indigo-500"
          delay={0.1}
          onClick={() => navigate('/admin/users')}
        />
        <StatCard label={t("newRegistrations")} value={stats?.new_registrations} icon={UserPlus} color="bg-sky-500" delay={0.15} />
        <StatCard label={t("upcomingRenewals")} value={stats?.upcoming_renewals} icon={Clock} color="bg-amber-500" delay={0.2} />
        <StatCard label={t("totalRevenue")} value={stats?.total_revenue != null ? fmt(stats.total_revenue) : "—"} icon={IndianRupee} color="bg-emerald-500" delay={0.25} />
      </div>

      {/* ── [ROW 2] Recent Inquiries ── */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <SectionHeader title={t("recentInquiries")} sub={t("latestRequests")} onRedirect={() => navigate('/admin/inquiries')} />
          {/* Tab pills */}
          <div className="flex flex-wrap gap-1.5">
            {inqTabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setInqTab(id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${inqTab === id
                  ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}>
                <Icon size={11} />{t(id)}
              </button>
            ))}
          </div>
        </div>
        {loading.inquiries ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : inqData.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-500">
            <Bell size={32} className="opacity-20" /><p className="text-sm font-bold">{t("noRecords")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {inqData.slice(0, 6).map((item: any, i: number) => (
              <motion.div
                key={item.id ?? i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all"
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${inqTab === "subscriptions"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : inqTab === "product_orders"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                >
                  {(item.user_name ?? "?")?.[0]?.toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {item.user_name ?? "—"}
                    </p>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${item.status
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                        }`}
                    >
                      {item.status ? t("resolved") : t("pending")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate mt-1">
                    {item.description ?? "—"}
                  </p>

                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={10} className="text-slate-500" />
                    <span className="text-[10px] text-slate-500">
                      {fmtDate(item.inquiry_date)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* ── [ROW 3] Payments | Subscriptions | Products (3-col) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Payments */}
        <GlassCard>
          <SectionHeader title={t("recentPayments")} sub={t("thisMonth")} onRedirect={() => navigate('/admin/payments')} />
          {loading.payments ? <SkeletonRows /> : payments.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-8">{t("noPayments")}</p>
          ) : (
            <div className="space-y-2">
              {payments.slice(0, 5).map((p: any, i: number) => (
                <motion.div key={p.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.name ?? "—"}</p>
                    <p className="text-[10px] text-slate-500">{p.payment_method} · {fmtDate(p.payment_date)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-black text-emerald-400">{fmt(p.amount)}</span>
                    <Badge v={p.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Recent Subscription History */}
        <GlassCard>
          <SectionHeader title={t("subscriptionHistory")} sub={t("thisMonth")} onRedirect={() => navigate('/admin/subscriptions')} />
          {loading.subscriptions ? <SkeletonRows /> : subscriptions.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-8">{t("noRecords")}</p>
          ) : (
            <div className="space-y-2">
              {subscriptions.slice(0, 5).map((s: any, i: number) => (
                <motion.div key={s.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{s.user_name ?? "—"}</p>
                    <p className="text-[10px] text-slate-500 truncate">{s.plan_name} · {s.duration_in_months}mo</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-black text-violet-400">{fmt(s.amount)}</span>
                    <Badge v={s.status === true ? "active" : s.status === false ? "inactive" : String(s.status)} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Recent Product Purchases */}
        <GlassCard>
          <SectionHeader title={t("productPurchases")} sub={t("thisMonth")} onRedirect={() => navigate('/admin/products')} />
          {loading.products ? <SkeletonRows /> : products.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-8">{t("noRecords")}</p>
          ) : (
            <div className="space-y-2">
              {products.slice(0, 5).map((p: any, i: number) => (
                <motion.div key={p.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.user_name ?? "—"}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.product_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-black text-amber-400">{fmt(p.amount)}</span>
                    <Badge v={p.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── [ROW 4] Attendance Count ── */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <SectionHeader title={t("attendanceOverview")} sub={t("activityPeriod")} onRedirect={() => navigate('/admin/attendance')} />
        </div>
        {loading.attendance ? (
          <div className="grid grid-cols-3 gap-4"><div className="h-20 rounded-xl bg-white/5 animate-pulse" /><div className="h-20 rounded-xl bg-white/5 animate-pulse" /><div className="h-20 rounded-xl bg-white/5 animate-pulse" /></div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t("totalCheckins"), value: attendance?.total_count ?? 0, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { label: t("presentNow"), value: attendance?.present_now ?? 0, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: t("checkedOut"), value: attendance?.checked_out ?? 0, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`rounded-2xl ${bg} border border-white/5 p-5 flex flex-col items-center gap-2 text-center`}>
                <Icon size={22} className={color} />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* ── [ROW 5] Monthly Revenue Bar Chart ── */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <SectionHeader title={t("monthlyRevenue")} sub={t("revenueBreakdown")} onRedirect={() => navigate('/admin/revenueops')} />
          <div className="flex items-center gap-2">
            {[3, 6, 12].map((m) => (
              <button key={m} onClick={() => handleRevenueMonthsChange(m)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${derivedRevenueMonths === m ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 text-slate-400 hover:text-white border border-white/10"}`}>
                {m}M
              </button>
            ))}
          </div>
        </div>
        {loading.revenue ? (
          <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
        ) : monthlyRevenue.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-slate-500">
            <TrendingUp size={40} className="opacity-20" /><p className="text-sm font-bold">{t("noRevenueData")}</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month_label" stroke="#475569" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<RevTooltip currency={currency} />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 12 }} />
                <Bar dataKey="subscription_revenue" name={t("subscriptions")} fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="product_revenue" name={t("products")} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="renewal_revenue" name={t("renewals")} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>

      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
