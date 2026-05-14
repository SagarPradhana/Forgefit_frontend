import { Modal, GlowButton } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";
import { handlePhoneKeyDown, handlePhonePaste, sanitizePhone } from "../../../utils/formUtils";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProductId: string | null;
  productForm: {
    name: string;
    category: string;
    price: string;
    stock: string;
    unit: string;
    image: string;
    description: string;
  };
  setProductForm: (form: any) => void;
  currencySymbol: string;
  onSuccess: () => void;
  onSave: (payload: any) => void;
  isSaving: boolean;
}

export function ProductModal({
  isOpen,
  onClose,
  editProductId,
  productForm,
  setProductForm,
  currencySymbol,
  onSave,
  isSaving
}: ProductModalProps) {
  const { t } = useTranslation();

  const handleSubmit = async () => {
    if (!productForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!productForm.price || Number(productForm.price) < 0) {
      toast.error("Product price must be 0 or greater");
      return;
    }
    if (productForm.stock === "" || Number(productForm.stock) < 0) {
      toast.error("Stock count must be 0 or greater");
      return;
    }

    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      stock_count: Number(productForm.stock),
      unit: productForm.unit,
      image_url: productForm.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=400",
      description: productForm.description
    };

    onSave(payload);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={editProductId ? t("modifyInventory") : t("registerProduct")}
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
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("productDesignation")}</label>
          <input
            className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
            placeholder={t("productName")}
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("classification")}</label>
            <select
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            >
              <option>{t("supplements")}</option>
              <option>{t("apparel")}</option>
              <option>{t("equipment")}</option>
              <option>{t("accessories")}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("price")} ({currencySymbol})</label>
            <input
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              type="text"
              placeholder="0.00"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: sanitizePhone(e.target.value) })}
              onKeyDown={handlePhoneKeyDown}
              onPaste={handlePhonePaste}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("stockLevel")}</label>
            <input
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              type="text"
              placeholder="0"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: sanitizePhone(e.target.value) })}
              onKeyDown={handlePhoneKeyDown}
              onPaste={handlePhonePaste}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("unitOfMeasure")}</label>
            <input
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
              placeholder={t("unitOfMeasurePlaceholder")}
              value={productForm.unit}
              onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("imageURL")}</label>
          <input
            className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold text-xs"
            placeholder="https://..."
            value={productForm.image}
            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("detailedSpecifications")}</label>
          <textarea
            className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition resize-none h-24 font-medium"
            placeholder={t("detailedSpecificationsPlaceholder")}
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
}
