import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../store/gymStore";
import {
  GlassCard,
  SectionTitle,
  Skeleton,
  EmptyState,
  Table,
  StatusBadge,
  Modal
} from "../../components/ui/primitives";
import { CreditCard, CheckCircle2, Clock, RefreshCw, Eye, Calendar, ChevronRight } from "lucide-react";
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
  const [selectedPayment, setSelectedPayment] = useState<AppPaymentResponse | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

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
                key: "action",
                label: "",
                render: (p) => (
                  <button
                    onClick={() => { setSelectedPayment(p); setViewModalOpen(true); }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition-all"
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                )
              },
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

      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Payment Details">
        {selectedPayment && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-transparent border border-white/10">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Reference</p>
                <p className="text-lg font-black text-white italic">#{selectedPayment.id.slice(-8).toUpperCase()}</p>
              </div>
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${selectedPayment.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : selectedPayment.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {selectedPayment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Date & Time</p>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-400" />
                  <p className="text-sm font-bold text-white">
                    {new Date(selectedPayment.payment_date * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <p className="text-xs text-slate-400 pl-6">
                  {new Date(selectedPayment.payment_date * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Amount</p>
                <p className="text-2xl font-black text-white italic">{currencySymbol}{selectedPayment.amount}</p>
                <p className="text-xs text-slate-400">{selectedPayment.payment_method.toUpperCase()}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Purchase Details</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white uppercase tracking-tight">{selectedPayment.purchase_type}</span>
                <ChevronRight size={12} className="text-slate-600" />
                <span className="text-xs text-slate-400">
                  {selectedPayment.purchase_details?.plan_name ||
                    selectedPayment.purchase_details?.product_name ||
                    selectedPayment.purchase_details?.name ||
                    JSON.stringify(selectedPayment.purchase_details).slice(0, 50) || "—"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Member</p>
                <p className="text-sm font-bold text-white">{selectedPayment.name}</p>
                <p className="text-[10px] text-slate-400">@{selectedPayment.username}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Contact</p>
                <p className="text-sm font-bold text-white">{selectedPayment.mobile}</p>
                <p className="text-[10px] text-slate-400 truncate">{selectedPayment.email}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
