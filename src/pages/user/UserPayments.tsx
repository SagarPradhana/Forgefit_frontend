import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../store/gymStore";
import { 
  GlassCard, 
  SectionTitle, 
  Skeleton, 
  EmptyState, 
  Table, 
  StatusBadge 
} from "../../components/ui/primitives";
import { CreditCard, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { appPaymentService, type AppPaymentResponse } from "../../services/appPaymentService";
import { DateRangeFilter, type DateRange } from "../../components/ui/DateRangeFilter";
import { getCurrencySymbol } from "../../utils/currency";

export function UserPayments() {
  const { t } = useTranslation();
  const { appConfig } = useGymStore();
  const currency = appConfig?.currency || "INR";
  const currencySymbol = getCurrencySymbol(currency);
  const { id: userId } = useAuthStore();

  const [fetchedPayments, setFetchedPayments] = useState<AppPaymentResponse[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentDateRange, setPaymentDateRange] = useState<DateRange>({ label: "This Month" });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");
  const [paymentPurchaseTypeFilter, setPaymentPurchaseTypeFilter] = useState<string>("");

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
  }, [userId, paymentDateRange, paymentStatusFilter, paymentMethodFilter, paymentPurchaseTypeFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(n ?? 0);
  const fmtPayDate = (ts: number) =>
    ts ? new Date(ts * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="space-y-6">
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

      <div className="flex flex-wrap items-center gap-3">
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

      {paymentsLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      ) : fetchedPayments.length > 0 ? (
        <GlassCard>
          <Table
            columns={[
              {
                key: "ref",
                label: "Reference",
                render: (p) => <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">#{p.id.slice(-6)}</span>
              },
              {
                key: "date",
                label: "Date",
                render: (p) => <span className="text-xs font-bold text-slate-400">{fmtPayDate(p.payment_date)}</span>
              },
              {
                key: "purchase",
                label: "Purchase",
                render: (p) => (
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white uppercase tracking-tight italic">{p.purchase_type}</span>
                    <span className="text-[9px] text-slate-500 truncate max-w-[150px]">
                      {p.purchase_details ? JSON.stringify(p.purchase_details).slice(0, 40) + "..." : "---"}
                    </span>
                  </div>
                )
              },
              {
                key: "method",
                label: "Method",
                render: (p) => <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{p.payment_method}</span>
              },
              {
                key: "amount",
                label: "Amount",
                render: (p) => <span className="text-sm font-black text-white italic">{currencySymbol}{p.amount}</span>
              },
              {
                key: "status",
                label: "Status",
                render: (p) => <StatusBadge status={p.status.charAt(0).toUpperCase() + p.status.slice(1) as any} />
              }
            ]}
            data={fetchedPayments}
          />
        </GlassCard>
      ) : (
        <EmptyState title="Financial Ledger Clean" hint="No transaction markers detected for the current selection." />
      )}
    </div>
  );
}
