import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  GlassCard,
  SectionTitle,
  NoDataFound,
  StatusBadge,
  Table,
  Modal,
  GlowButton,
} from "../components/ui/primitives";
import {
  adminMetrics,
  attendanceHistory,
  expiringUsers,
  monthlyRevenue,
  payments,
  services,
} from "../data/mockData";
import { InquiryCenter } from "../components/admin/InquiryCenter";
import { useGymStore } from "../store/gymStore";

import { Users, Activity, DollarSign, UserPlus, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { useGet } from "../hooks/useApi";
import { API_ENDPOINTS } from "../utils/url";
import { toast } from "../store/toastStore";

function AdminDashboard() {
  const { t } = useTranslation();
  const { subscriptionRequests, productRequests, contactInquiries, dashboardColorTheme } = useGymStore();
  const [mgmtModalOpen, setMgmtModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { refetch: syncAllSubscriptions } = useGet(API_ENDPOINTS.ADMIN.SYNC_SUBSCRIPTIONS, {
    enabled: false,
    onSuccess: () => {
      toast.success("All user subscription plans synchronized successfully.");
      setIsSyncing(false);
    },
    onError: () => {
      toast.error("Failed to sync subscription plans.");
      setIsSyncing(false);
    },
  });

  const handleSync = () => {
    setIsSyncing(true);
    syncAllSubscriptions();
  };

  // Gradient mapping based on DashboardLayout themes
  const themeGradients: Record<string, string> = {
    theme1: "from-blue-500/20 to-emerald-500/20",
    theme2: "from-purple-500/20 to-pink-500/20",
    theme3: "from-emerald-500/20 to-cyan-500/20",
    theme4: "from-orange-500/20 to-blue-500/20",
    theme5: "from-amber-500/20 to-sky-500/20",
  };

  const activeGradient = themeGradients[dashboardColorTheme] || themeGradients.theme1;

  useEffect(() => {
    const hasPending =
      subscriptionRequests.some(r => r.status === 'pending') ||
      productRequests.some(r => r.status === 'pending') ||
      contactInquiries.some(r => r.status === 'pending');

    if (hasPending) {
      setMgmtModalOpen(true);
    }
  }, [subscriptionRequests, productRequests, contactInquiries]);

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending",
  ).length;
  const newSignups = 78;
  const serviceHighlights = services.slice(0, 3);
  const recentPayments = payments.slice(-4).reverse();

  const metrics = [
    { label: t("totalUsers"), value: adminMetrics.users, icon: Users, color: "text-blue-400" },
    { label: "Active Subs", value: adminMetrics.subscriptions, icon: Activity, color: "text-emerald-400" },
    { label: t("revenue"), value: adminMetrics.revenue, icon: DollarSign, color: "text-emerald-400" },
    { label: t("newSignups"), value: newSignups, icon: UserPlus, color: "text-indigo-400" },
    { label: t("pendingPayments"), value: pendingPayments, icon: Clock, color: "text-red-400" },
    { label: t("upcomingRenewals"), value: expiringUsers.length, icon: AlertTriangle, color: "text-orange-400" },
  ];

  return (
    <>
      <Modal
        open={mgmtModalOpen}
        onClose={() => setMgmtModalOpen(false)}
        title={t("priorityCenter")}
        maxWidth="max-w-[95vw]"
      >
        <div className="py-2">
          <InquiryCenter />
        </div>
      </Modal>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <SectionTitle
          title={t("dashboard")}
          subtitle="Monitor users, subscriptions, and revenue growth."
        />
        <GlowButton
          onClick={handleSync}
          disabled={isSyncing}
          className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
        >
          <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Syncing..." : "Sync Subscriptions"}
        </GlowButton>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m, i) => (
          <GlassCard key={i} className={`p-4 bg-gradient-to-br ${activeGradient} border-white/10 hover:border-white/20 transition-all group relative overflow-hidden`}>
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl bg-white/10 ${m.color} group-hover:scale-110 transition-transform`}>
                  <m.icon size={18} />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-tight">{m.label}</p>
                <p className="text-xl font-black text-white tracking-tighter">{m.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="min-h-[320px] p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-300">Monthly Revenue</p>
              <h3 className="text-xl font-semibold text-white">
                Revenue performance
              </h3>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs uppercase text-slate-400">
              {adminMetrics.revenue}
            </span>
          </div>
          <div className="mt-6 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#F97316" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[320px] p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-300">Growth</p>
              <h3 className="text-xl font-semibold text-white">
                Monthly trend
              </h3>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs uppercase text-slate-400">
              {recentPayments.length} latest payments
            </span>
          </div>
          <div className="mt-6 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-1 xl:grid-cols-[1.55fr_0.75fr]">
        <GlassCard className="p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-300">Recent Payments</p>
              <h3 className="text-xl font-semibold text-white">
                Latest subscription activity
              </h3>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs uppercase text-slate-400">
              {recentPayments.length} entries
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <Table
              headers={["ID", "User", "Date", "Amount", "Status"]}
              rows={recentPayments.map((payment) => [
                payment.id,
                payment.user,
                payment.date,
                payment.amount,
                <StatusBadge
                  key={payment.id}
                  status={payment.status as "Paid" | "Pending"}
                />,
              ])}
            />
          </div>
        </GlassCard>

        <GlassCard className="space-y-4 p-6">
          <div>
            <p className="text-sm text-slate-300">Upcoming renewals</p>
            <h3 className="text-xl font-semibold text-white">
              Priority follow-ups
            </h3>
          </div>

          {expiringUsers.length > 0 ? (
            <div className="space-y-3">
              {expiringUsers.map((user) => (
                <div
                  key={user.name}
                  className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 transition-colors"
                >
                  <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                    {user.daysLeft} day(s) left
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <NoDataFound
              title="No renewals due"
              subtitle="All subscriptions are up to date."
            />
          )}

          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 mt-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Attendance snapshot</p>
            {attendanceHistory.slice(-3).map((item) => (
              <div
                key={item.date}
                className="mt-3 rounded-2xl bg-white/80 dark:bg-slate-950/70 p-3 border border-slate-100 dark:border-transparent shadow-sm dark:shadow-none"
              >
                <p className="font-bold text-slate-900 dark:text-white">{item.date}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {item.checkIn} — {item.checkOut}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {serviceHighlights.map((service) => (
          <GlassCard key={service.title} className="p-5">
            <p className="text-sm text-slate-300">Service</p>
            <h3 className="mt-3 text-lg font-semibold text-white">
              {service.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {service.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </>
  );
}

export default AdminDashboard;
