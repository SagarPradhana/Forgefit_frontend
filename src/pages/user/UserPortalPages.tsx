import { useState } from "react";
import { useGymStore } from "../../store/gymStore";
import {
  attendanceHistory,
  payments,
  products,
  type Status,
  userProfile,
} from "../../data/mockData";
import {
  EmptyState,
  GlassCard,
  GlowButton,
  Modal,
  SectionTitle,
  Skeleton,
  StatusBadge,
  Table,
} from "../../components/ui/primitives";
import UserDashboard from "../UserDashboard";
import { ProfileCard } from "../ProfileCard";
import { SubscriptionCard } from "../SubscriptionCard";
import { AttendanceCalendar } from "../AttendanceCalender";
import { ProductCard } from "../ProductCard";
import { SettingsPanel } from "../SettingPanel";

export function UserPortalPages({ page }: { page: string }) {
  const plans = useGymStore((s) => s.plans);
  const flags = useGymStore(
    (s) =>
      s.featureFlags[1] ?? {
        showProducts: true,
        allowUpgrade: true,
        showOffers: true,
      },
  );
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [view, setView] = useState<"table" | "calendar">("calendar");

  if (page === "dashboard") return <UserDashboard />;

  if (page === "profile") {
    return (
      <div className="space-y-6">
        <SectionTitle
          title="Profile"
          subtitle="Manage your personal information"
        />
        <ProfileCard user={userProfile} />
      </div>
    );
  }

  if (page === "subscription")
    return (
      <div className="space-y-6">
        <SectionTitle
          title="Subscription"
          subtitle="Manage your plan and upgrade anytime"
        />

        <GlassCard className="p-6 bg-gradient-to-r from-indigo-500/10 to-orange-400/10 border-indigo-400/20">
          <p className="text-sm text-slate-400">Current Plan</p>
          <h2 className="text-2xl font-bold mt-1">{userProfile.currentPlan}</h2>

          {flags.allowUpgrade ? (
            <GlowButton className="mt-4" onClick={() => setUpgradeOpen(true)}>
              Upgrade / Renew
            </GlowButton>
          ) : (
            <p className="mt-2 text-sm text-slate-400">
              Upgrades disabled for this profile
            </p>
          )}
        </GlassCard>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <SubscriptionCard
              key={p.id}
              plan={p}
              currentPlan={userProfile.currentPlan}
              highlight={i === 1}
              onSelect={() => setUpgradeOpen(true)}
            />
          ))}
        </div>

        <Modal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          title="Upgrade Subscription"
        >
          <div className="space-y-4 text-sm text-slate-300">
            <p>Select your preferred plan and confirm payment.</p>
            <GlowButton className="w-full">Proceed to Payment</GlowButton>
          </div>
        </Modal>
      </div>
    );

  if (page === "attendance") {
    return (
      <div className="space-y-6">
        <SectionTitle
          title="Attendance"
          subtitle="Track your daily gym visits"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-lg text-sm ${
              view === "calendar"
                ? "bg-indigo-500 text-white"
                : "bg-white/5 text-slate-300"
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg text-sm ${
              view === "table"
                ? "bg-indigo-500 text-white"
                : "bg-white/5 text-slate-300"
            }`}
          >
            Table
          </button>
        </div>

        {view === "calendar" ? (
          <AttendanceCalendar data={attendanceHistory} />
        ) : (
          <GlassCard>
            <Table
              headers={["Date", "Check In", "Check Out"]}
              rows={attendanceHistory.map((a) => [
                a.date,
                a.checkIn,
                a.checkOut,
              ])}
            />
          </GlassCard>
        )}
      </div>
    );
  }

  if (page === "payments")
    return (
      <GlassCard>
        <SectionTitle title="Payments" />
        <Table
          headers={["Transaction", "Amount", "Date", "Status"]}
          rows={payments
            .filter((p) => p.user === userProfile.name)
            .map((p) => [
              p.id,
              p.amount,
              p.date,
              <StatusBadge
                key={p.id}
                status={p.status as "Paid" | "Pending"}
              />,
            ])}
        />
      </GlassCard>
    );

  if (page === "products")
    return flags.showProducts ? (
      <div className="space-y-6">
        <SectionTitle
          title="Products"
          subtitle="Recommended supplements & fitness gear"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>
      </div>
    ) : (
      <EmptyState
        title="Products Hidden"
        hint="Admin disabled product recommendations for this user."
      />
    );

  if (page === "settings") {
    return (
      <div className="space-y-6">
        <SectionTitle
          title="Settings"
          subtitle="Manage your account and preferences"
        />
        <SettingsPanel />
      </div>
    );
  }

  return <Skeleton className="h-24" />;
}
