import { Modal, GlowButton } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";
import { handlePhoneKeyDown, handlePhonePaste, sanitizePhone } from "../../../utils/formUtils";
import { useTranslation } from "react-i18next";

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPlanId: string | null;
  planForm: {
    name: string;
    description: string;
    actual_price: string;
    price: string;
    duration_in_months: string;
  };
  setPlanForm: (form: any) => void;
  currencySymbol: string;
  onSuccess: () => void;
  onSave: (payload: any) => void;
  isSaving: boolean;
}

export function SubscriptionPlanModal({
  isOpen,
  onClose,
  editPlanId,
  planForm,
  setPlanForm,
  currencySymbol,
  onSave,
  isSaving
}: SubscriptionPlanModalProps) {
  const { t } = useTranslation();

  const handleSubmit = async () => {
    if (!planForm.name.trim()) {
      toast.error("Plan name is required");
      return;
    }
    if (!planForm.price || Number(planForm.price) <= 0) {
      toast.error("Valuation price must be greater than 0");
      return;
    }
    if (planForm.actual_price && Number(planForm.actual_price) < Number(planForm.price)) {
      toast.error("Actual price cannot be less than the selling price");
      return;
    }

    const payload = {
      name: planForm.name,
      description: planForm.description,
      actual_price: Number(planForm.actual_price),
      price: Number(planForm.price),
      duration_in_months: Number(planForm.duration_in_months),
    };

    onSave(payload);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={editPlanId ? t("editStrategy") : t("defineStrategy")}
      footer={
        <>
          <GlowButton className="bg-gray-600" onClick={onClose} disabled={isSaving}>{t("cancel")}</GlowButton>
          <GlowButton onClick={handleSubmit} disabled={isSaving}>
            {t("submit")}
          </GlowButton>
        </>
      }
    >
      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("planDesignation")}</label>
          <input
            className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
            placeholder={t("planDesignationPlaceholder")}
            value={planForm.name}
            onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("actualPrice")} ({currencySymbol})</label>
            <input
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              placeholder="0"
              type="text"
              value={planForm.actual_price}
              onChange={(e) => setPlanForm({ ...planForm, actual_price: sanitizePhone(e.target.value) })}
              onKeyDown={handlePhoneKeyDown}
              onPaste={handlePhonePaste}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("strategicValuation")} ({currencySymbol})</label>
            <input
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              placeholder="0"
              type="text"
              value={planForm.price}
              onChange={(e) => setPlanForm({ ...planForm, price: sanitizePhone(e.target.value) })}
              onKeyDown={handlePhoneKeyDown}
              onPaste={handlePhonePaste}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</label>
            <select
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              value={planForm.duration_in_months}
              onChange={(e) => setPlanForm({ ...planForm, duration_in_months: e.target.value })}
            >
              <option value="1">1 {t("month")}</option>
              <option value="3">3 {t("months")}</option>
              <option value="6">6 {t("months")}</option>
              <option value="12">1 {t("year")}</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("protocolDescription")}</label>
          <textarea
            className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition resize-none h-32 font-medium"
            placeholder={t("protocolDescriptionPlaceholder")}
            value={planForm.description}
            onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
}
