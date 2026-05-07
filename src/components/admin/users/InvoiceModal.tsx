import { useRef, useState } from "react";
import { Modal, GlowButton, CommonButton } from "../../ui/primitives";
import { Download, X } from "lucide-react";
import { useGymStore } from "../../../store/gymStore";
import { toast } from "../../../store/toastStore";
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

interface PaymentInvoice {
  id: string;
  user_id: string;
  username: string;
  member_id: string;
  name?: string;
  Name?: string;
  mobile: string;
  email?: string;
  amount: number;
  payment_date: number;
  payment_method: string;
  status: string;
  purchase_type: string;
  purchase_details?: any;
  created_date: number;
  updated_date: number;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentInvoice | null;
}

export function InvoiceModal({ isOpen, onClose, payment }: InvoiceModalProps) {
  const { publicAppConfig } = useGymStore();
  const printRef = useRef<HTMLDivElement>(null);

  const brandName = publicAppConfig?.brand_name || "ForgeFit";
  const logo = publicAppConfig?.logo_image_path || "/logo.png";
  const currency = publicAppConfig?.currency || "₹";

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!printRef.current || !payment) return;

    setIsDownloading(true);
    console.log("Starting PDF generation for payment:", payment.id);

    try {
      // Use toCanvas for more reliability in some browsers
      const canvas = await htmlToImage.toCanvas(printRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        cacheBust: true,
      });

      console.log("Canvas generated, creating PDF...");
      const dataUrl = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${payment.id.slice(0, 8)}.pdf`);
      console.log("PDF saved successfully");
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      toast.error("Failed to generate PDF. Try the Print option.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!payment) return null;

  const getPurchaseDescription = () => {
    const details = payment.purchase_details;
    if (!details) return payment.purchase_type;

    if (payment.purchase_type === "subscription" || payment.purchase_type === "renewal") {
      return details.plan_name || details.name || "Gym Subscription";
    }
    if (payment.purchase_type === "product") {
      return details.product_name || details.name || "Product Purchase";
    }
    return payment.purchase_type;
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Payment Invoice"
      footer={
        <div className="flex gap-3">
          <CommonButton variant="ghost" onClick={onClose}>
            <X size={18} />
          </CommonButton>
          <GlowButton
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-indigo-600 disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isDownloading ? "Generating..." : "Download PDF"}
          </GlowButton>
        </div>
      }
    >
      <div ref={printRef} className="invoice-container max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="header bg-gradient-to-r from-indigo-500 to-purple-500 p-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt={brandName} className="w-16 h-16 rounded-xl bg-white object-contain p-1" />
            <div>
              <h2 className="text-2xl font-black text-white">{brandName}</h2>
              <p className="text-xs text-white/80 uppercase tracking-widest">Official Invoice</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs uppercase tracking-widest">Invoice ID</p>
            <p className="text-white font-mono text-sm">#{payment.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Billed To</p>
              <p className="font-bold text-slate-900">{payment.name || payment.Name || "N/A"}</p>
              <p className="text-xs text-slate-500">#{payment.member_id || payment.username || "N/A"}</p>
              <p className="text-xs text-slate-500">{payment.mobile}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Invoice Details</p>
              <p className="text-sm text-slate-900">
                <span className="text-slate-500">Date: </span>
                {new Date(payment.payment_date * 1000).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
              <p className="text-sm text-slate-900">
                <span className="text-slate-500">Time: </span>
                {new Date(payment.payment_date * 1000).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${payment.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                payment.status === "pending" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                {payment.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-l-lg">Description</th>
                <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest">Method</th>
                <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-r-lg">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900 capitalize">{getPurchaseDescription()}</p>
                  <p className="text-xs text-slate-500 uppercase">{payment.purchase_type}</p>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-medium text-slate-600 uppercase">{payment.payment_method}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-lg font-bold text-slate-900">{currency}{payment.amount}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="bg-slate-50 p-4 rounded-xl flex justify-end">
            <div className="w-48 flex justify-between">
              <span className="text-sm text-slate-600">Total</span>
              <span className="text-xl font-black text-indigo-600">{currency}{payment.amount}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Thank you for your payment • {brandName}
            </p>
            <p className="text-[9px] text-slate-300 mt-1">
              Generated on {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}