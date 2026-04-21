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

function AdminDashboard() {
  const { t } = useTranslation();
  const { subscriptionRequests, productRequests, contactInquiries } = useGymStore();
  const [mgmtModalOpen, setMgmtModalOpen] = useState(false);

  useEffect(() => {
    const hasPending = 
      subscriptionRequests.some(r => r.status === 'pending') ||
      productRequests.some(r => r.status === 'pending') ||
      contactInquiries.some(r => r.status === 'pending');
    
    if (hasPending) {
       setMgmtModalOpen(true);
    }
  }, []);

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending",
  ).length;
  const newSignups = 78;
  const serviceHighlights = services.slice(0, 3);
  const recentPayments = payments.slice(-4).reverse();

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

      <SectionTitle
        title={t("dashboard")}
        subtitle="Monitor users, subscriptions, and revenue growth."
      />

      <div className="mb-4 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <GlassCard className="p-6">
          <p className="text-sm text-slate-300">{t("totalUsers")}</p>
          <p className="mt-3 text-3xl font-bold">{adminMetrics.users}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-sm text-slate-300">Active Subscriptions</p>
          <p className="mt-3 text-3xl font-bold">
            {adminMetrics.subscriptions}
          </p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-sm text-slate-300">{t("revenue")}</p>
          <p className="mt-3 text-3xl font-bold">{adminMetrics.revenue}</p>
        </GlassCard>
      </div>

      <div className="mb-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <GlassCard className="p-6">
          <p className="text-sm text-slate-300">{t("newSignups")}</p>
          <p className="mt-3 text-3xl font-bold">{newSignups}</p>
          <p className="mt-2 text-sm text-slate-400">
            {t("registeredLast30")}
          </p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-sm text-slate-300">{t("pendingPayments")}</p>
          <p className="mt-3 text-3xl font-bold">{pendingPayments}</p>
          <p className="mt-2 text-sm text-slate-400">{t("awaitingFollowup")}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-sm text-slate-300">{t("upcomingRenewals")}</p>
          <p className="mt-3 text-3xl font-bold">{expiringUsers.length}</p>
          <p className="mt-2 text-sm text-slate-400">
            {t("renewalsDue7")}
          </p>
        </GlassCard>
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
