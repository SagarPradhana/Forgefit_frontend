import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, CreditCard, UserPlus, RefreshCw, DollarSign, Calendar,
  ShoppingBag, Mail, Bell, CheckCircle, XCircle, Activity,
  ChevronRight, TrendingUp, Clock, Camera,
} from "lucide-react";
import { GlassCard, SectionTitle } from "../components/ui/primitives";
import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";
import { DateRangeFilter, type DateRange } from "../components/ui/DateRangeFilter";
import { QRScannerModal } from "../components/admin/users/QRScannerModal";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    from: start.toISOString().split("T")[0],
    to: now.toISOString().split("T")[0],
  };
};
const today = () => new Date().toISOString().split("T")[0];
const toUnix = (d: string, end = false) => {
  if (!d) return undefined;
  const dt = new Date(d);
  end ? dt.setHours(23, 59, 59, 999) : dt.setHours(0, 0, 0, 0);
  return Math.floor(dt.getTime() / 1000);
};
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);
const fmtDate = (ts: number) =>
  ts ? new Date(ts * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

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
function StatCard({ label, value, icon: Icon, color, delay, prefix = "", subLabel, subValue }: {
  label: string; value: any; icon: any; color: string; delay: number; prefix?: string; subLabel?: string; subValue?: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl hover:border-white/20 transition-all group flex flex-col justify-between"
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
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
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

// ─── Skeleton rows ────────────────────────────────────────────────────────────
function SkeletonRows({ n = 5 }: { n?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(n)].map((_, i) => (
        <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

// ─── Custom Tooltip for Bar Chart ─────────────────────────────────────────────
function RevTooltip({ active, payload, label }: any) {
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
  const navigate = useNavigate();
  const monthRange = getMonthRange();

  // Global date range (for most sections) — default: This Month with proper dates
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const fromUnix = toUnix(new Date(monthRange.from), false);
    const toUnixVal = toUnix(new Date(monthRange.to), true);
    return { label: "This Month", from_date: fromUnix, to_date: toUnixVal };
  });

  // Attendance date range (default today)
  const [attRange, setAttRange] = useState<DateRange>(() => {
    const todayStr = today();
    return { 
      label: "Today", 
      from_date: toUnix(new Date(todayStr), false),
      to_date: toUnix(new Date(todayStr), true)
    };
  });

  // Monthly revenue months param
  const [revenueMonths, setRevenueMonths] = useState(6);

  // Inquiry tab
  const [inqTab, setInqTab] = useState<"subscriptions" | "product_orders" | "contact_inquiries">("subscriptions");

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

  // ── Date params helper — uses unix timestamps from DateRange directly ──
  const dateParams = useCallback((range: DateRange) => {
    const p = new URLSearchParams();
    if (range.from_date) p.set("from_date", String(range.from_date));
    if (range.to_date)   p.set("to_date",   String(range.to_date));
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
      if (attRange.from_date) p.set("from_date", String(attRange.from_date));
      if (attRange.to_date)   p.set("to_date",   String(attRange.to_date));
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_ATTENDANCE}?${p}`);
      if (res?.data) setAttendance(res.data);
    } catch (e) { console.error(e); } finally { setLoad("attendance", false); }
  }, [attRange]);

  const fetchMonthlyRevenue = useCallback(async () => {
    setLoad("revenue", true);
    try {
      const res: any = await api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_MONTHLY_REVENUE}?months=${revenueMonths}`);
      if (res?.data) setMonthlyRevenue(res.data);
    } catch (e) { console.error(e); } finally { setLoad("revenue", false); }
  }, [revenueMonths]);

  // ── Effects ──
  // Single effect - fetches on mount with initial dateRange values
  useEffect(() => {
    const from = dateRange.from_date;
    const to = dateRange.to_date;
    
    // Build params with dates
    const p = new URLSearchParams();
    if (from) p.set("from_date", String(from));
    if (to) p.set("to_date", String(to));
    const paramsStr = p.toString();

    // All APIs use dateParams internally which handles the dates
    const fetchData = async () => {
      setLoad("stats", true);
      setLoad("inquiries", true);
      setLoad("payments", true);
      setLoad("subscriptions", true);
      setLoad("products", true);
      setLoad("attendance", true);
      setLoad("revenue", true);
      
      try {
        const [statsRes, inqRes, payRes, subRes, prodRes, attRes, revRes] = await Promise.all([
          api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_STATS}?${paramsStr}`),
          api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_INQUIRIES}?${paramsStr}`),
          api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_PAYMENTS}?${paramsStr}`),
          api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_SUBSCRIPTIONS}?${paramsStr}`),
          api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_RECENT_PRODUCTS}?${paramsStr}`),
          api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_ATTENDANCE}?from_date=${attRange.from_date}&to_date=${attRange.to_date}`),
          api.get(`${API_ENDPOINTS.ADMIN.DASHBOARD_MONTHLY_REVENUE}?months=${revenueMonths}`)
        ]);
        
        if (statsRes?.code === 200) setStats({ total_users: statsRes.total_users, total_trainers: statsRes.total_trainers, total_admins: statsRes.total_admins, total_members: statsRes.total_members, total_active_subscriptions: statsRes.total_active_subscriptions, total_expired_subscriptions: statsRes.total_expired_subscriptions, new_registrations: statsRes.new_registrations, upcoming_renewals: statsRes.upcoming_renewals, total_revenue: statsRes.total_revenue });
        if (inqRes?.data) setInquiries(inqRes.data);
        if (payRes?.data) setPayments(payRes.data);
        if (subRes?.data) setSubscriptions(subRes.data);
        if (prodRes?.data) setProducts(prodRes.data);
        if (attRes?.data) setAttendance(attRes.data);
        if (revRes?.data) setMonthlyRevenue(revRes.data);
      } catch (e) { console.error(e); }
      finally { 
        setLoad("stats", false); setLoad("inquiries", false); setLoad("payments", false);
        setLoad("subscriptions", false); setLoad("products", false); setLoad("attendance", false); setLoad("revenue", false);
      }
    };
    
    fetchData();
  }, []);

  const refreshAll = () => { 
    fetchStats();
    fetchInquiries();
    fetchPayments();
    fetchSubscriptions();
    fetchProducts();
    fetchAttendance();
    fetchMonthlyRevenue();
  };

  const isAnyLoading = Object.values(loading).some(Boolean);

  // ── Inquiry tab data ──
  const inqData: any[] = inquiries?.[inqTab] ?? [];
  const inqTabs = [
    { id: "subscriptions",     label: "Subscriptions",    icon: CreditCard },
    { id: "product_orders",    label: "Product Orders",   icon: ShoppingBag },
    { id: "contact_inquiries", label: "Contact",          icon: Mail },
  ] as const;

  return (
    <div className="space-y-6">
      {/* ── Top Header + Global Date Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle title="Dashboard" subtitle="Real-time gym intelligence — members, revenue & activity" />
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScannerOpen(true)}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            title="Scan ID Card"
          >
            <Camera size={16} />
            Scan
          </motion.button>
          <DateRangeFilter
            defaultPreset="monthly"
            onChange={(r) => setDateRange(r)}
          />
          <button onClick={refreshAll}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all" title="Refresh all">
            <RefreshCw size={14} className={isAnyLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── [ROW 1] 5 Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.35 }}
          className="col-span-2 relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl hover:border-white/20 transition-all group flex flex-col justify-between"
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20 bg-indigo-500" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 bg-opacity-20 mb-3 group-hover:scale-110 transition-transform">
                <Users size={18} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-tight">Total Users</p>
              <p className="text-3xl font-black text-white tracking-tighter">{stats?.total_users ?? "—"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-auto relative z-10">
            <button onClick={() => navigate('/admin/users?role=admin')} className="py-2 px-1 rounded-xl bg-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/30 border border-transparent transition-all flex flex-col items-center group/btn">
              <span className="text-lg font-black text-indigo-400 group-hover/btn:scale-110 transition-transform">{stats?.total_admins ?? 0}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Admins</span>
            </button>
            <button onClick={() => navigate('/admin/users?role=trainer')} className="py-2 px-1 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-transparent transition-all flex flex-col items-center group/btn">
              <span className="text-lg font-black text-emerald-400 group-hover/btn:scale-110 transition-transform">{stats?.total_trainers ?? 0}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Trainers</span>
            </button>
            <button onClick={() => navigate('/admin/users?role=user')} className="py-2 px-1 rounded-xl bg-white/5 hover:bg-sky-500/20 hover:border-sky-500/30 border border-transparent transition-all flex flex-col items-center group/btn">
              <span className="text-lg font-black text-sky-400 group-hover/btn:scale-110 transition-transform">{stats?.total_members ?? 0}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Users</span>
            </button>
          </div>
        </motion.div>
        <StatCard label="Active Subscriptions" value={stats?.total_active_subscriptions} icon={CreditCard}  color="bg-violet-500"  delay={0.05} subLabel="Expired" subValue={stats?.total_expired_subscriptions} />
        <StatCard label="New Registrations"    value={stats?.new_registrations}           icon={UserPlus}    color="bg-sky-500"     delay={0.1}  />
        <StatCard label="Upcoming Renewals"    value={stats?.upcoming_renewals}           icon={Clock}       color="bg-amber-500"   delay={0.15} />
        <StatCard label="Total Revenue"        value={stats?.total_revenue != null ? fmt(stats.total_revenue) : "—"} icon={DollarSign} color="bg-emerald-500" delay={0.2} />
      </div>

      {/* ── [ROW 2] Recent Inquiries (4 tabs) ── */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <SectionHeader title="Recent Inquiries" sub="Latest incoming requests" onRedirect={() => navigate('/admin/inquiries')} />
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {inqTabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setInqTab(id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  inqTab === id ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                <Icon size={12} />{label}
              </button>
            ))}
          </div>
        </div>
        {loading.inquiries ? <SkeletonRows /> : inqData.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-500">
            <Bell size={32} className="opacity-20" /><p className="text-sm font-bold">No records</p>
          </div>
        ) : (
          <div className="space-y-2">
            {inqData.slice(0, 5).map((item: any, i: number) => (
              <motion.div key={item.id ?? i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-xs font-black text-violet-300 shrink-0">
                    {(item.name ?? item.user_name ?? "?")?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-bold text-white truncate">{item.name ?? item.user_name ?? "—"}</p>
                    {inqTab === 'subscriptions' && <p className="text-[10px] text-slate-400 truncate mt-0.5"><span className="text-indigo-400 font-bold">{item.plan_name || 'Plan'}</span> • {item.duration_in_months ? `${item.duration_in_months} Months` : 'N/A'}</p>}
                    {inqTab === 'product_orders' && <p className="text-[10px] text-slate-400 truncate mt-0.5"><span className="text-emerald-400 font-bold">{item.product_name || 'Product'}</span> • Qty: {item.quantity || 1}</p>}
                    {inqTab === 'contact_inquiries' && <p className="text-[10px] text-slate-400 truncate mt-0.5"><span className="text-amber-400 font-bold">{item.subject || 'Inquiry'}</span> • {item.phone || item.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => navigate('/admin/inquiries')} className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all text-slate-500">
                    <ChevronRight size={14} />
                  </button>
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
          <SectionHeader title="Recent Payments" sub="This month" onRedirect={() => navigate('/admin/payments')} />
          {loading.payments ? <SkeletonRows /> : payments.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-8">No payments</p>
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
          <SectionHeader title="Subscription History" sub="This month" onRedirect={() => navigate('/admin/subscriptions')} />
          {loading.subscriptions ? <SkeletonRows /> : subscriptions.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-8">No records</p>
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
          <SectionHeader title="Product Purchases" sub="This month" onRedirect={() => navigate('/admin/products')} />
          {loading.products ? <SkeletonRows /> : products.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-8">No records</p>
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
          <SectionHeader title="Attendance" sub="Live count" onRedirect={() => navigate('/admin/attendance')} />
          <DateRangeFilter
            defaultPreset="today"
            onChange={(r) => setAttRange(r)}
          />
        </div>
        {loading.attendance ? (
          <div className="grid grid-cols-3 gap-4"><div className="h-20 rounded-xl bg-white/5 animate-pulse" /><div className="h-20 rounded-xl bg-white/5 animate-pulse" /><div className="h-20 rounded-xl bg-white/5 animate-pulse" /></div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Check-ins", value: attendance?.total_count ?? 0, icon: Users,    color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { label: "Present Now",     value: attendance?.present_now   ?? 0, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Checked Out",     value: attendance?.checked_out   ?? 0, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
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
          <SectionHeader title="Monthly Revenue" sub="Subscription · Product · Renewal breakdown" onRedirect={() => navigate('/admin/revenueops')} />
          <div className="flex items-center gap-2">
            {[3, 6, 12].map((m) => (
              <button key={m} onClick={() => setRevenueMonths(m)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  revenueMonths === m ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white border border-white/10"}`}>
                {m}M
              </button>
            ))}
          </div>
        </div>
        {loading.revenue ? (
          <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
        ) : monthlyRevenue.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-slate-500">
            <TrendingUp size={40} className="opacity-20" /><p className="text-sm font-bold">No revenue data</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month_label" stroke="#475569" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<RevTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 12 }} />
                <Bar dataKey="subscription_revenue" name="Subscriptions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="product_revenue"      name="Products"      fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="renewal_revenue"      name="Renewals"      fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>

      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
