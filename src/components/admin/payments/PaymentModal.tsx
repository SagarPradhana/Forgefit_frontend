import { Modal, GlowButton, ButtonLoader } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";
import { type PaymentMethod, type PaymentStatus, type PurchaseType } from "../../../services/adminPaymentService";
import { useTranslation } from "react-i18next";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPaymentId: string | null;
  paymentForm: {
    user_id: string;
    amount: string;
    payment_date: string;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    purchase_type: PurchaseType;
    purchase_id: string;
    purchase_details: any;
  };
  setPaymentForm: (form: any) => void;
  usersDropdown: any[];
  subscriptionPlans: any[];
  fetchedProducts: any[];
  currencySymbol: string;
  onSuccess: () => void;
  mutation: any;
}


export function PaymentModal({
  isOpen,
  onClose,
  editPaymentId,
  paymentForm,
  setPaymentForm,
  usersDropdown,
  subscriptionPlans,
  fetchedProducts,
  currencySymbol,
  mutation: paymentMutation
}: PaymentModalProps) {
  const { t } = useTranslation();

  const handleSubmit = async () => {
    // 🛡️ VALIDATION
    if (!paymentForm.user_id) {
      toast.error(t("pleaseSelectMember") || "Please select a member");
      return;
    }
    if (!paymentForm.purchase_id) {
      const msg = paymentForm.purchase_type === "product"
        ? (t("pleaseSelectProduct") || "Please select a product")
        : (t("pleaseSelectPlan") || "Please select a plan");
      toast.error(msg);
      return;
    }
    if (!paymentForm.payment_date) {
      toast.error(t("pleaseSelectDate") || "Please select a date");
      return;
    }

    const payload = {
      ...paymentForm,
      amount: Number(paymentForm.amount),
      payment_date: Math.floor(new Date(paymentForm.payment_date).getTime() / 1000)
    };

    paymentMutation.mutate(payload);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={editPaymentId ? t("financialAdjustment") : t("logTransaction")}
      footer={
        <>
          <GlowButton className="bg-gray-600" onClick={onClose} disabled={paymentMutation.isPending}>{t("cancel")}</GlowButton>
          <GlowButton onClick={handleSubmit} disabled={paymentMutation.isPending}>
            <ButtonLoader label={t("submit")} loadingLabel={t("loading")} loading={paymentMutation.isPending} />
          </GlowButton>
        </>
      }
    >
      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("selectMember")}</label>
          <select
            className={`w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold ${editPaymentId ? "opacity-50 cursor-not-allowed" : ""}`}
            value={paymentForm.user_id}
            onChange={(e) => setPaymentForm({ ...paymentForm, user_id: e.target.value })}
            disabled={!!editPaymentId}
          >
            <option value="">{t("chooseRegistryEntity")}</option>
            {usersDropdown.map((u: any) => (
              <option key={u.id} value={u.id}>{u.name} (@{u.username || u.member_id})</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("purchaseType")}</label>
          <select
            className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold uppercase"
            value={paymentForm.purchase_type}
            onChange={(e) => setPaymentForm({ ...paymentForm, purchase_type: e.target.value as any, purchase_id: "", amount: "0" })}
          >
            <option value="product">{t("product")}</option>
            <option value="subscription">{t("subscription")}</option>
          </select>
        </div>

        {paymentForm.purchase_type === "product" && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("selectInventoryItem")}</label>
            <select
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              value={paymentForm.purchase_id}
              onChange={(e) => {
                const product = fetchedProducts.find(p => p.id === e.target.value);
                setPaymentForm({
                  ...paymentForm,
                  purchase_id: e.target.value,
                  amount: product ? String(product.price) : "0",
                  purchase_details: product ? { product_name: product.name, price: product.price, category: product.category } : { additionalProp1: {} }
                });
              }}
            >
              <option value="">{t("chooseProduct")}</option>
              {fetchedProducts.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} ({currencySymbol}{p.price})</option>
              ))}
            </select>
          </div>
        )}

        {paymentForm.purchase_type === "subscription" && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("selectSubscriptionPlan")}</label>
            <select
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              value={paymentForm.purchase_id}
              onChange={(e) => {
                const plan = subscriptionPlans.find(pl => pl.id === e.target.value);
                setPaymentForm({
                  ...paymentForm,
                  purchase_id: e.target.value,
                  amount: plan ? String(plan.price) : "0",
                  purchase_details: plan ? { plan_name: plan.name, price: plan.price, duration: plan.duration_in_months } : { additionalProp1: {} }
                });
              }}
            >
              <option value="">{t("chooseSubscriptionPlan")}</option>
              {subscriptionPlans.map((pl: any) => (
                <option key={pl.id} value={pl.id}>{pl.name} - {pl.duration_in_months} months ({currencySymbol}{pl.price})</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("transactionValue")} ({currencySymbol})</label>
            <input
              className="w-full rounded-xl bg-slate-800 border border-white/10 p-4 text-slate-400 font-bold cursor-not-allowed"
              type="text"
              value={paymentForm.amount}
              readOnly
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("entryDate")}</label>
            <input
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={paymentForm.payment_date}
              onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("strategicMethod")}</label>
            <select
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold uppercase"
              value={paymentForm.payment_method}
              onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value as any })}
            >
              <option value="cash">{t("cash")}</option>
              <option value="card">{t("card")}</option>
              <option value="upi">{t("upi")}</option>
              <option value="other">{t("other")}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
            <select
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold uppercase"
              value={paymentForm.status}
              onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value as any })}
            >
              <option value="paid">{t("paid")}</option>
              <option value="pending">{t("pending")}</option>
              <option value="failed">{t("failed")}</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}
