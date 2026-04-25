import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../store/gymStore";
import {
  payments,
  products,
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
import { Calendar as CalendarIcon, List as ListIcon, Info, Users, Clock, Filter, CalendarCheck, ShieldCheck, Star, CheckCircle2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserDashboard from "../UserDashboard";
import { ProfileCard } from "../ProfileCard";
import { SubscriptionCard } from "../SubscriptionCard";
import { AttendanceCalendar } from "../AttendanceCalender";
import { ProductCard } from "../ProductCard";
import { SettingsPanel } from "../SettingPanel";
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../store/toastStore";
import { ChangePassword } from "../../components/admin/ChangePassword";
import { adminAttendanceService, type AttendanceResponse } from "../../services/adminAttendanceService";
import { useEffect } from "react";

export function UserPortalPages({ page }: { page: string }) {
  const { t } = useTranslation();
  const plans = useGymStore((s) => s.plans);
  const flags = useGymStore(
    (s) =>
      s.featureFlags[1] ?? {
        showProducts: true,
        allowUpgrade: true,
        showOffers: true,
      },
  );

  // --- STATE HOOKS (MUST BE TOP LEVEL) ---
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any>(null);
  const [view, setView] = useState<"table" | "calendar">("calendar");

  // Attendance Dates & State
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(today.setDate(diff)).toISOString().split("T")[0];

  const [range, setRange] = useState<"weekly" | "monthly" | "custom">("monthly");
  const [customDates, setCustomDates] = useState({ start: firstDay, end: lastDay });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = ["2024", "2025", "2026"];

  const auth = useAuthStore();
  const authName = auth.name;
  const userId = auth.id;

  const [fetchedAttendance, setFetchedAttendance] = useState<AttendanceResponse[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const fetchUserAttendance = async () => {
    if (!userId) return;
    setAttendanceLoading(true);
    try {
      let from_date: number | undefined;
      let to_date: number | undefined;

      if (range === "monthly") {
        from_date = Math.floor(new Date(selectedYear, selectedMonth, 1).getTime() / 1000);
        to_date = Math.floor(new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59).getTime() / 1000);
      } else if (range === "weekly") {
        from_date = Math.floor(new Date(selectedWeek).getTime() / 1000);
        const endWeek = new Date(selectedWeek);
        endWeek.setDate(endWeek.getDate() + 6);
        to_date = Math.floor(endWeek.setHours(23, 59, 59, 999) / 1000);
      } else if (range === "custom") {
        from_date = Math.floor(new Date(customDates.start).getTime() / 1000);
        to_date = Math.floor(new Date(customDates.end).setHours(23, 59, 59, 999) / 1000);
      }

      const res = await adminAttendanceService.getUserAttendance(userId, { from_date, to_date });
      if (res && res.data) {
        setFetchedAttendance(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    if (page === "attendance") {
      fetchUserAttendance();
    }
  }, [page, range, selectedMonth, selectedYear, selectedWeek, customDates]);

  const formatAttendanceForUI = (data: AttendanceResponse[]) => {
    return data.map(a => ({
      date: new Date(a.date * 1000).toISOString().split('T')[0],
      checkIn: new Date(a.check_in * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: a.check_out ? new Date(a.check_out * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---"
    }));
  };

  if (page === "dashboard") return <UserDashboard />;

  if (page === "profile") {
    const user = auth;
    const sub = user.latest_subscription_details;
    const fmtDate = (ts: number | null | undefined) =>
      ts ? new Date(Number(ts) * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
      <div className="space-y-6">
        <SectionTitle title={t("profile")} subtitle="Your membership profile and health details" />

        {/* Hero */}
        <GlassCard className="p-6 bg-gradient-to-br from-indigo-500/10 to-orange-500/5 border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]" />
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="relative shrink-0">
              {user.profile_image_path ? (
                <img src={user.profile_image_path} alt={user.name || ""}
                  className="h-24 w-24 rounded-2xl object-cover shadow-2xl shadow-indigo-500/30 border-2 border-indigo-500/30" />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-orange-400 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-500/40">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-indigo-500 text-[9px] font-black uppercase tracking-widest text-white">
                {user.role || "member"}
              </span>
            </div>
            <div className="text-center sm:text-left space-y-1.5">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{user.name}</h2>
              {user.username && <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">{user.username}</p>}
              <p className="text-xs text-slate-400 uppercase tracking-wide">Gym Member</p>
              {user.joining_date && (
                <p className="text-[10px] text-slate-500 font-bold">Joined {fmtDate(user.joining_date)}</p>
              )}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-3">Contact Details</h3>
            {[
              { label: "Full Name", value: user.name },
              { label: "Username",  value: user.username },
              { label: "Email",     value: user.email },
              { label: "Mobile",    value: user.mobile },
              { label: "Address",   value: user.address },
            ].map(({ label, value }) => (
              <div key={label} className="grid gap-0.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-sm text-white font-bold">{value || "—"}</p>
              </div>
            ))}
          </GlassCard>

          {/* Health & Vitals */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-3">Health & Vitals</h3>
            {[
              { label: "Date of Birth",       value: fmtDate(user.metadata?.dob) },
              { label: "Gender",              value: user.metadata?.gender },
              { label: "Height (cm)",         value: user.metadata?.height ? `${user.metadata.height} cm` : null },
              { label: "Weight (kg)",         value: user.metadata?.weight ? `${user.metadata.weight} kg` : null },
              { label: "Fitness Goal",        value: user.metadata?.fitness_goal },
              { label: "Workout Time",        value: user.metadata?.workout_time },
              { label: "Medical Conditions",  value: user.metadata?.medical_conditions },
              { label: "Emergency Contact",   value: user.metadata?.emergency_contact },
            ].map(({ label, value }) => (
              <div key={label} className="grid gap-0.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-sm text-white font-bold capitalize">{value || "—"}</p>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Active Subscription */}
        {sub && (
          <GlassCard className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-3 mb-4">Active Subscription</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { label: "Plan",       value: sub.subscription_name },
                { label: "Duration",   value: sub.duration_in_months ? `${sub.duration_in_months} Months` : null },
                { label: "Amount",     value: sub.amount ? `₹${Number(sub.amount).toLocaleString("en-IN")}` : null },
                { label: "Start Date", value: fmtDate(sub.start_date) },
                { label: "End Date",   value: fmtDate(sub.end_date) },
                { label: "Status",     value: sub.status === true ? "Active" : sub.status === false ? "Inactive" : String(sub.status ?? "—") },
              ].map(({ label, value }) => (
                <div key={label} className="grid gap-0.5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                  <p className="text-sm text-emerald-300 font-bold">{value || "—"}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    );
  }

  if (page === "subscription") {
    const handlePlanSelect = (plan: any) => {
      setSelectedPlanForUpgrade(plan);
      setUpgradeOpen(true);
    };

    const handleConfirmUpgrade = () => {
      toast.success(`Request for ${selectedPlanForUpgrade?.name} plan sent successfully! Our team will process it shortly.`);
      setUpgradeOpen(false);
    };

    return (
      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionTitle
            title={t("subscription")}
            subtitle={t("membershipCycle")}
          />
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" /> Auto-Renewal Enabled
          </div>
        </div>

        {/* --- ACTIVE STRATEGY BANNER --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-1 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-r from-indigo-500/20 via-emerald-500/20 to-orange-500/20 shadow-2xl"
        >
          <div className="bg-slate-950/90 backdrop-blur-2xl px-6 py-10 sm:px-10 sm:py-12 rounded-[1.8rem] sm:rounded-[2.3rem] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -mr-48 -mt-48" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 relative z-10 w-full sm:w-auto">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-indigo-500 to-emerald-400 p-[3px] shadow-2xl shadow-indigo-500/30 shrink-0">
                <div className="h-full w-full bg-slate-950 rounded-[1.3rem] sm:rounded-[1.8rem] flex items-center justify-center">
                  <Star size={32} className="text-white sm:w-[40px] sm:h-[40px]" fill="currentColor" />
                </div>
              </div>
              <div>
                <p className="text-[9px] sm:text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2 leading-none">Primary Strategy</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter leading-none mb-4">{userProfile.currentPlan}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                  <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    <Clock size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" /> May 20, 2026
                  </span>
                  <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    <CheckCircle2 size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" /> 12 Benefits
                  </span>
                </div>
              </div>
            </div>

            {flags.allowUpgrade && (
              <GlowButton
                className="relative z-10 w-full md:w-auto px-8 md:px-12 h-14 md:h-16 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40"
                onClick={() => setUpgradeOpen(true)}
              >
                Request Manual Renewal
              </GlowButton>
            )}
          </div>
        </motion.div>

        {/* --- PLAN MATRIX --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((p) => (
            <SubscriptionCard
              key={p.id}
              plan={p}
              currentPlan={userProfile.currentPlan}
              highlight={p.name === "Performance"} // Assuming Performance is popular
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* --- UPGRADE WIZARD --- */}
        <Modal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          title={selectedPlanForUpgrade ? `Request: ${selectedPlanForUpgrade.name}` : "Upgrade Strategy"}
        >
          <div className="space-y-8 p-4">
            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Zap size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Upgrade Confirmation</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are requesting to transition from <span className="text-white font-bold">{userProfile.currentPlan}</span> to <span className="text-indigo-400 font-bold">{selectedPlanForUpgrade?.name || "a New Plan"}</span>.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Request Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Strategy Level</span>
                  <span className="text-white font-black uppercase tracking-tighter">{selectedPlanForUpgrade?.name || "Inquiry Only"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Monthly Commitment</span>
                  <span className="text-white font-black italic">${selectedPlanForUpgrade?.price || "0"}.00</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Administrative Processing</span>
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">24-48 Hours</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <GlowButton
                className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest"
                onClick={handleConfirmUpgrade}
              >
                Confirm Strategy Transition
              </GlowButton>
              <p className="text-[9px] text-center text-slate-500 italic mt-4 px-6">
                By confirming, you authorize our administrative team to process your plan change. Final billing will be adjusted on your next cycle.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  if (page === "attendance") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title={t("attendance")}
            subtitle="Monitor your performance and consistency"
          />
          <div className="flex p-1 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-xl">
            <button
              onClick={() => setView("calendar")}
              className={`p-2.5 rounded-lg transition-all duration-300 relative group ${view === "calendar" ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              title="Calendar View"
            >
              {view === "calendar" && (
                <motion.div layoutId="viewActive" className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-lg" />
              )}
              <CalendarIcon size={18} className="relative z-10" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2.5 rounded-lg transition-all duration-300 relative group ${view === "table" ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              title="List View"
            >
              {view === "table" && (
                <motion.div layoutId="viewActive" className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-lg" />
              )}
              <ListIcon size={18} className="relative z-10" />
            </button>
          </div>
        </div>

        {/* --- DYNAMIC FILTER BAR --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
            {["weekly", "monthly", "custom"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r as any)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${range === r ? "text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                {range === r && (
                  <motion.div layoutId="rangeActive" className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
                )}
                <span className="relative z-10">{r}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {range === "custom" && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2 px-3">
                  <CalendarCheck size={14} className="text-indigo-400" />
                  <input
                    type="date"
                    className="bg-transparent text-[10px] font-bold text-white outline-none [color-scheme:dark]"
                    value={customDates.start}
                    onChange={(e) => setCustomDates({ ...customDates, start: e.target.value })}
                  />
                  <span className="text-slate-600 text-xs">to</span>
                  <input
                    type="date"
                    className="bg-transparent text-[10px] font-bold text-white outline-none [color-scheme:dark]"
                    value={customDates.end}
                    onChange={(e) => setCustomDates({ ...customDates, end: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {range === "weekly" && (
              <motion.div
                key="weekly"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-xl"
              >
                <span className="text-[10px] font-black uppercase text-slate-500 pl-3">Select Week Start</span>
                <input
                  type="date"
                  className="bg-transparent text-[10px] font-bold text-white outline-none [color-scheme:dark] pr-3"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                />
              </motion.div>
            )}

            {range === "monthly" && (
              <motion.div
                key="monthly"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 shadow-xl"
              >
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-transparent text-[10px] font-bold text-white outline-none cursor-pointer px-3 py-1.5"
                >
                  {months.map((m, i) => <option key={m} value={i} className="bg-slate-900">{m}</option>)}
                </select>
                <div className="w-px h-4 bg-white/10" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent text-[10px] font-bold text-white outline-none cursor-pointer px-3 py-1.5"
                >
                  {years.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Filter size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Filter</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total visits</p>
              <p className="text-xl font-black text-white leading-none">18 <span className="text-[10px] text-emerald-500">Days</span></p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Avg Duration</p>
              <p className="text-xl font-black text-white leading-none">1.5 <span className="text-[10px] text-indigo-500">Hours</span></p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Info size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Current Streak</p>
              <p className="text-xl font-black text-white leading-none">4 <span className="text-[10px] text-orange-500">Days</span></p>
            </div>
          </GlassCard>
        </div>

        {attendanceLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : fetchedAttendance.length > 0 ? (
          view === "calendar" ? (
            <AttendanceCalendar data={formatAttendanceForUI(fetchedAttendance)} />
          ) : (
            <GlassCard>
              <Table
                headers={["Date", "Check In", "Check Out"]}
                rows={formatAttendanceForUI(fetchedAttendance).map((a) => [
                  a.date,
                  a.checkIn,
                  a.checkOut,
                ])}
              />
            </GlassCard>
          )
        ) : (
          <EmptyState title="Registry Empty" hint="No attendance markers found for the current temporal selection." />
        )}
      </div>
    );
  }

  if (page === "payments")
    return (
      <GlassCard>
        <SectionTitle title={t("payments")} />
        <Table
          headers={["Transaction", "Amount", "Date", "Status"]}
          rows={payments
            .filter((p) => p.user === (authName || userProfile.name))
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
          title={t("products")}
          subtitle="Recommended supplements & fitness gear"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          title={t("settings")}
          subtitle="Manage your account and preferences"
        />
        <SettingsPanel />
      </div>
    );
  }

  if (page === "change-password") {
    return (
      <div className="py-10">
        <ChangePassword />
      </div>
    );
  }

  return <Skeleton className="h-24" />;
}
