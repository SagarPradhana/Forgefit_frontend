import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../store/gymStore";
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
import { Calendar as CalendarIcon, List as ListIcon, Info, Users, Clock, ShieldCheck, Star, CheckCircle2, Zap, CreditCard, Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import UserDashboard from "../UserDashboard";
import { SubscriptionCard } from "../SubscriptionCard";
import { AttendanceCalendar } from "../AttendanceCalender";
import { ProductCard } from "../ProductCard";
import { SettingsPanel } from "../SettingPanel";
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../store/toastStore";
import { ChangePassword } from "../../components/admin/ChangePassword";
import { appAttendanceService, type AppAttendanceResponse, type AppAttendanceStatsResponse } from "../../services/appAttendanceService";
import { appSubscriptionService, type AppSubscriptionPlanResponse, type AppCurrentSubscriptionResponse, type AppSubscriptionHistoryResponse } from "../../services/appSubscriptionService";
import { appInquiryService } from "../../services/appInquiryService";
import { appProductService, type AppProductResponse } from "../../services/appProductService";
import { appPaymentService, type AppPaymentResponse } from "../../services/appPaymentService";
import { DateRangeFilter, type DateRange } from "../../components/ui/DateRangeFilter";
import { getCurrencySymbol } from "../../utils/currency";


export function UserPortalPages({ page }: { page: string }) {
  const { t } = useTranslation();
  const { appConfig, featureFlags } = useGymStore();
  const currency = appConfig?.currency || "USD";
  const currencySymbol = getCurrencySymbol(currency);
  const flags = featureFlags[1] ?? {
    showProducts: true,
    allowUpgrade: true,
    showOffers: true,
  };

  // --- STATE HOOKS (MUST BE TOP LEVEL) ---
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any>(null);
  const [view, setView] = useState<"table" | "calendar">("calendar");

  // Attendance Dates & State
  const [attDateRange, setAttDateRange] = useState<DateRange>({ label: "This Month" });
  const [fetchedAttendance, setFetchedAttendance] = useState<AppAttendanceResponse[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AppAttendanceStatsResponse | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [viewMoreAttendance, setViewMoreAttendance] = useState<AppAttendanceResponse[] | null>(null);

  // ── Subscription State ──
  const [fetchedSubscriptionPlans, setFetchedSubscriptionPlans] = useState<AppSubscriptionPlanResponse[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<AppCurrentSubscriptionResponse | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<AppSubscriptionHistoryResponse[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [upgradeDescription, setUpgradeDescription] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<"" | "active" | "expired">("")

  const location = useLocation();

  // Auto-open history modal when navigated with ?history=1 (e.g. from dashboard)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("history") === "1" && page === "subscription") {
      setHistoryModalOpen(true);
    }
  }, [location.search, page]);
  // ── Products State ──
  const [fetchedProducts, setFetchedProducts] = useState<AppProductResponse[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productCategories, setProductCategories] = useState<string[]>([]);

  // ── Payments State ──
  const [fetchedPayments, setFetchedPayments] = useState<AppPaymentResponse[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentDateRange, setPaymentDateRange] = useState<DateRange>({ label: "This Month" });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");
  const [paymentPurchaseTypeFilter, setPaymentPurchaseTypeFilter] = useState<string>("");

  const auth = useAuthStore();
  const userId = auth.id;

  const fetchUserAttendance = useCallback(async () => {
    if (!userId) return;
    setAttendanceLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        appAttendanceService.getAttendanceStats(userId, { from_date: attDateRange.from_date, to_date: attDateRange.to_date }),
        appAttendanceService.getAttendance(userId, { from_date: attDateRange.from_date, to_date: attDateRange.to_date })
      ]);
      if (statsRes) setAttendanceStats(statsRes);
      if (listRes && listRes.data) setFetchedAttendance(listRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAttendanceLoading(false);
    }
  }, [userId, attDateRange]);

  useEffect(() => {
    if (page === "attendance") {
      fetchUserAttendance();
    }
  }, [page, fetchUserAttendance]);

  const fetchSubscriptions = useCallback(async () => {
    if (!userId) return;
    setSubscriptionsLoading(true);
    try {
      const [plansRes, currentRes, historyRes] = await Promise.all([
        appSubscriptionService.getSubscriptionPlans({ is_deleted: false, count: 100 }),
        appSubscriptionService.getCurrentSubscription(userId),
        appSubscriptionService.getSubscriptionHistory(userId, { count: 100 })
      ]);
      if (plansRes && plansRes.data) setFetchedSubscriptionPlans(plansRes.data);
      if (currentRes && currentRes.id) {
        setCurrentSubscription(currentRes as unknown as AppCurrentSubscriptionResponse);
      } else if (currentRes && currentRes.data && currentRes.data.length > 0) {
        const activeSub = currentRes.data.find(sub => sub.user_id === userId) || currentRes.data[0];
        setCurrentSubscription(activeSub);
      }
      if (historyRes && historyRes.data) setSubscriptionHistory(historyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubscriptionsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (page === "subscription") {
      fetchSubscriptions();
    }
  }, [page, fetchSubscriptions]);

  // ── Products Fetcher ──
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await appProductService.getProducts({
        search: productSearch || undefined,
        category: productCategory || undefined,
        is_deleted: false,
        count: 100,
        offset: 0,
      });
      if (res && res.data) {
        setFetchedProducts(res.data);
        // Extract unique categories
        const cats = [...new Set(res.data.map((p) => p.category).filter(Boolean))];
        setProductCategories(cats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  }, [productSearch, productCategory]);

  useEffect(() => {
    if (page === "products") {
      fetchProducts();
    }
  }, [page, fetchProducts]);

  // ── Payments Fetcher ──
  const fetchPayments = useCallback(async () => {
    if (!userId) return;
    setPaymentsLoading(true);
    try {
      const res = await appPaymentService.getPayments({
        user_id: userId!,
        from_date: paymentDateRange.from_date,
        to_date: paymentDateRange.to_date,
        status: (paymentStatusFilter || undefined) as any,
        payment_method: (paymentMethodFilter || undefined) as any,
        purchase_type: (paymentPurchaseTypeFilter || undefined) as any,
        count: 100,
        offset: 0,
        order_by: "payment_date",
        order_dir: "DESC",
      });
      if (res && res.data) {
        setFetchedPayments(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentsLoading(false);
    }
  }, [paymentDateRange, paymentStatusFilter, paymentMethodFilter, paymentPurchaseTypeFilter]);

  useEffect(() => {
    if (page === "payments") {
      fetchPayments();
    }
  }, [page, fetchPayments]);

  const formatAttendanceForUI = (data: AppAttendanceResponse[]) => {
    const map = new Map<string, AppAttendanceResponse[]>();
    data.forEach(a => {
      const d = new Date(a.date * 1000).toISOString().split('T')[0];
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(a);
    });
    return Array.from(map.entries()).map(([date, records]) => {
      return {
        date,
        checkIn: new Date(records[0].check_in * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOut: records[0].check_out ? new Date(records[0].check_out * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---",
        records
      };
    });
  };

  if (page === "dashboard") return <UserDashboard />;

  if (page === "profile") {
    const user = auth;
    const sub = user.latest_subscription_details;
    const fmtDate = (ts: number | null | undefined) =>
      ts ? new Date(Number(ts) * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Hero Card */}
        <GlassCard className="p-6 md:p-10 border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]" />
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
            <div className="relative shrink-0">
              {user.profile_image_path ? (
                <img src={user.profile_image_path} alt={user.name || ""}
                  className="h-24 w-24 md:h-32 md:w-32 rounded-2xl md:rounded-3xl object-cover shadow-2xl shadow-indigo-500/30 border-2 border-indigo-500/30" />
              ) : (
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 to-orange-400 flex items-center justify-center text-3xl md:text-5xl font-black text-white shadow-2xl shadow-indigo-500/40">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-indigo-500 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                {user.role || "member"}
              </span>
            </div>
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{user.name}</h2>
              {user.username && <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">{user.username}</p>}
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Gym Member</p>
              {user.joining_date && (
                <p className="text-[10px] text-slate-500 font-bold">
                  Member since {fmtDate(user.joining_date)}
                </p>
              )}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <GlassCard className="p-6 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-3">Contact Information</h3>
            {[
              { label: "Full Name",    value: user.name },
              { label: "Username",     value: user.username },
              { label: "Email",        value: user.email },
              { label: "Mobile",       value: user.mobile },
              { label: "Address",      value: user.address },
              { label: "Joining Date", value: fmtDate(user.joining_date) },
            ].map(({ label, value }) => (
              <div key={label} className="grid gap-0.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-sm text-white font-bold">{value || "—"}</p>
              </div>
            ))}
          </GlassCard>

          {/* Health & Vitals */}
          <GlassCard className="p-6 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-3">Health & Vitals</h3>
            <div className="space-y-3">
              {[
                { label: "Date of Birth",       value: fmtDate(user.metadata?.dob) },
                { label: "Gender",              value: user.metadata?.gender },
                { label: "Height",              value: user.metadata?.height ? `${user.metadata.height} cm` : null },
                { label: "Weight",              value: user.metadata?.weight ? `${user.metadata.weight} kg` : null },
                { label: "Fitness Goal",        value: user.metadata?.fitness_goal },
                { label: "Workout Time",        value: user.metadata?.workout_time },
                { label: "Medical Conditions",  value: user.metadata?.medical_conditions },
                { label: "Emergency Contact",   value: user.metadata?.emergency_contact },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
                  <div className="grid gap-0.5 flex-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                    <p className="text-sm text-white font-bold capitalize group-hover:text-indigo-100 transition-colors">{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
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
                { label: "Amount",     value: sub.amount ? `${currencySymbol}${Number(sub.amount).toLocaleString("en-IN")}` : null },
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

    const handleConfirmUpgrade = async () => {
      if (!userId || !selectedPlanForUpgrade) return;
      try {
        await appInquiryService.createSubscriptionInquiry({
          user_id: userId,
          subscription_plan_id: selectedPlanForUpgrade.id,
          description: upgradeDescription || `Requesting plan transition to ${selectedPlanForUpgrade.name}`
        });
        toast.success(`Request for ${selectedPlanForUpgrade.name} plan sent successfully! Our team will process it shortly.`);
        setUpgradeOpen(false);
        setUpgradeDescription("");
      } catch (err) {
        toast.error("Failed to submit request.");
      }
    };

    const currentPlanName = currentSubscription?.subscription_name;
    const currentDuration = currentSubscription?.duration_in_months ? `${currentSubscription.duration_in_months} Months` : "N/A";
    const fmtDate = (ts: number | null | undefined) =>
      ts ? new Date(Number(ts) * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";


    return (
      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionTitle
            title={t("subscription")}
            subtitle={t("membershipCycle")}
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" /> Auto-Renewal Enabled
            </div>
            <button
              onClick={() => setHistoryModalOpen(true)}
              className="px-4 h-10 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-500 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all shadow-lg text-[10px] font-black uppercase tracking-widest"
              title="Subscription History"
            >
              <Clock size={16} />
              <span>History</span>
            </button>
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
                <p className="text-[9px] sm:text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2 leading-none">Current Subscription</p>
                {currentSubscription ? (
                  <>
                    <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter leading-none mb-4">{currentPlanName}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                      <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        <Clock size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" /> Expires: {fmtDate(currentSubscription?.end_date)}
                      </span>
                      <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        <CheckCircle2 size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" /> Duration: {currentDuration}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-500 italic tracking-tighter leading-none mb-4">Not Available</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                      <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-orange-400 uppercase tracking-widest whitespace-nowrap">
                        <Info size={12} className="sm:w-[14px] sm:h-[14px]" /> Please select a strategy from below
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>


          </div>
        </motion.div>

        {subscriptionsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {fetchedSubscriptionPlans.map((p) => (
              <SubscriptionCard
                key={p.id}
                plan={p}
                currentPlan={currentPlanName}
                highlight={p.price > 1000} // Example highlight logic
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
        )}

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
                  You are requesting to transition from <span className="text-white font-bold">{currentPlanName}</span> to <span className="text-indigo-400 font-bold">{selectedPlanForUpgrade?.name || "a New Plan"}</span>.
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
                  <span className="text-white font-black italic">{currencySymbol}{selectedPlanForUpgrade?.price || "0"}.00</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Administrative Processing</span>
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">24-48 Hours</span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Additional Description</label>
                <textarea
                  value={upgradeDescription}
                  onChange={(e) => setUpgradeDescription(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 min-h-[80px]"
                  placeholder="Any specific requests?"
                />
              </div>
              <GlowButton
                className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest"
                onClick={handleConfirmUpgrade}
              >
                Confirm Strategy Transition
              </GlowButton>
              <p className="text-[9px] text-center text-slate-500 italic px-6">
                By confirming, you authorize our administrative team to process your plan change. Final billing will be adjusted on your next cycle.
              </p>
            </div>
          </div>
        </Modal>

        {/* --- HISTORY MODAL --- */}
        <Modal open={historyModalOpen} onClose={() => setHistoryModalOpen(false)} title="Subscription History">
          <div className="p-4 space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              {([["", "All"], ["active", "Active"], ["expired", "Expired"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setHistoryStatusFilter(val)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    historyStatusFilter === val
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-[55vh] overflow-y-auto">
              {subscriptionHistory.length === 0 ? (
                <EmptyState title="No History" hint="You don't have any past subscriptions." />
              ) : (() => {
                const filtered = subscriptionHistory.filter(h =>
                  historyStatusFilter === "" ? true
                  : historyStatusFilter === "active" ? h.status === true
                  : h.status === false
                );
                return filtered.length === 0 ? (
                  <EmptyState title="No Records" hint={`No ${historyStatusFilter} subscriptions found.`} />
                ) : (
                  <div className="space-y-3">
                    {filtered.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all group">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-white uppercase tracking-tight">
                            {(h as any).subscription_name || "Subscription"}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <span>{fmtDate(h.start_date)} → {fmtDate(h.end_date)}</span>
                            <span className="text-indigo-400">{h.duration_in_months} {h.duration_in_months === 1 ? "Month" : "Months"}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-black text-emerald-400">{currencySymbol}{Number(h.amount).toLocaleString("en-IN")}</span>
                          <StatusBadge status={h.status ? "Active" : "Expired"} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  if (page === "attendance") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionTitle
            title={t("attendance")}
            subtitle="Monitor your performance and consistency"
          />
          <div className="flex flex-wrap items-center gap-3">
            <DateRangeFilter
              defaultPreset="monthly"
              onChange={(r) => setAttDateRange(r)}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total visits</p>
              <p className="text-xl font-black text-white leading-none">{attendanceStats?.total_visits || 0} <span className="text-[10px] text-emerald-500">Days</span></p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Avg Duration</p>
              <p className="text-xl font-black text-white leading-none">{attendanceStats?.avg_duration_in_hrs || 0} <span className="text-[10px] text-indigo-500">Hours</span></p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Info size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Current Streak</p>
              <p className="text-xl font-black text-white leading-none">{attendanceStats?.current_streak || 0} <span className="text-[10px] text-orange-500">Days</span></p>
            </div>
          </GlassCard>
        </div>

        {attendanceLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : fetchedAttendance.length > 0 ? (
          view === "calendar" ? (
            <AttendanceCalendar data={formatAttendanceForUI(fetchedAttendance)} onViewMore={setViewMoreAttendance} />
          ) : (
            <GlassCard>
              <Table
                headers={["Date", "Check In", "Check Out", "Action"]}
                rows={formatAttendanceForUI(fetchedAttendance).map((a) => [
                  a.date,
                  a.checkIn,
                  a.checkOut,
                  a.records.length > 1 ? (
                    <button
                      onClick={() => setViewMoreAttendance(a.records)}
                      className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] rounded hover:bg-indigo-500/40"
                    >
                      +{a.records.length - 1} More
                    </button>
                  ) : null
                ])}
              />
            </GlassCard>
          )
        ) : (
          <EmptyState title="Registry Empty" hint="No attendance markers found for the current temporal selection." />
        )}

        <Modal open={!!viewMoreAttendance} onClose={() => setViewMoreAttendance(null)} title="Check-in Details">
          <div className="p-4">
            <Table
              headers={["Check In", "Check Out", "Status", "Duration"]}
              rows={(viewMoreAttendance || []).map((r) => [
                new Date(r.check_in * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                r.check_out ? new Date(r.check_out * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---",
                <StatusBadge key={r.id} status={r.status === "present" ? "Present" : (r.status as any)} />,
                r.duration || "—"
              ])}
            />
          </div>
        </Modal>
      </div>
    );
  }

  if (page === "payments") {
    const fmtCurrency = (n: number) =>
      new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(n ?? 0);
    const fmtPayDate = (ts: number) =>
      ts ? new Date(ts * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
      <div className="space-y-6">
        {/* Header + Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionTitle title={t("payments")} subtitle="Your complete transaction history" />
          <div className="flex items-center gap-2">
            <DateRangeFilter
              defaultPreset="monthly"
              onChange={(r) => setPaymentDateRange(r)}
            />
            <button
              onClick={fetchPayments}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all"
              title="Refresh"
            >
              <RefreshCw size={14} className={paymentsLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {["", "paid", "pending", "failed"].map((s) => (
              <button
                key={s}
                onClick={() => setPaymentStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${paymentStatusFilter === s
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {s || "All Status"}
              </button>
            ))}
          </div>

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:border-indigo-500/50 transition-all"
          >
            <option value="" className="bg-slate-900">All Methods</option>
            <option value="cash" className="bg-slate-900">Cash</option>
            <option value="card" className="bg-slate-900">Card</option>
            <option value="upi" className="bg-slate-900">UPI</option>
            <option value="other" className="bg-slate-900">Other</option>
          </select>

          {/* Purchase Type Filter */}
          <select
            value={paymentPurchaseTypeFilter}
            onChange={(e) => setPaymentPurchaseTypeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:border-indigo-500/50 transition-all"
          >
            <option value="" className="bg-slate-900">All Types</option>
            <option value="subscription" className="bg-slate-900">Subscription</option>
            <option value="renewal" className="bg-slate-900">Renewal</option>
            <option value="product" className="bg-slate-900">Product</option>
            <option value="other" className="bg-slate-900">Other</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Transactions</p>
              <p className="text-xl font-black text-white leading-none">{fetchedPayments.length}</p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Paid</p>
              <p className="text-xl font-black text-emerald-400 leading-none">
                {fmtCurrency(fetchedPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0))}
              </p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Pending</p>
              <p className="text-xl font-black text-orange-400 leading-none">
                {fmtCurrency(fetchedPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0))}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Payments Table */}
        {paymentsLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
          </div>
        ) : fetchedPayments.length > 0 ? (
          <GlassCard>
            <Table
              headers={["Purchase Type", "Amount", "Method", "Date", "Status"]}
              rows={fetchedPayments.map((p) => [
                <span key={`type-${p.id}`} className="capitalize">{p.purchase_type || "—"}</span>,
                <span key={`amt-${p.id}`} className="font-black text-emerald-400">{fmtCurrency(p.amount)}</span>,
                <span key={`meth-${p.id}`} className="capitalize">{p.payment_method || "—"}</span>,
                fmtPayDate(p.payment_date),
                <StatusBadge
                  key={p.id}
                  status={p.status === "paid" ? "Paid" : p.status === "pending" ? "Pending" : (p.status as any)}
                />,
              ])}
            />
          </GlassCard>
        ) : (
          <EmptyState title="No Payments" hint="No payment records found for the selected filters." />
        )}
      </div>
    );
  }

  if (page === "products") {
    return flags.showProducts ? (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionTitle
            title={t("products")}
            subtitle="Browse supplements & fitness gear available at the gym"
          />
          <button
            onClick={fetchProducts}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all"
            title="Refresh"
          >
            <RefreshCw size={14} className={productsLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Search + Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setProductCategory("")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${productCategory === ""
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              All
            </button>
            {productCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setProductCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${productCategory === cat
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[420px] w-full rounded-2xl" />)}
          </div>
        ) : fetchedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Products Found"
            hint="No products match your current search or category filter."
          />
        )}
      </div>
    ) : (
      <EmptyState
        title="Products Hidden"
        hint="Admin disabled product recommendations for this user."
      />
    );
  }

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
