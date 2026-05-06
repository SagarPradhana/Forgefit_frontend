import { useRef } from "react";
import { Modal, GlowButton } from "../../ui/primitives";
import { Printer, Download, X } from "lucide-react";
import { useGymStore } from "../../../store/gymStore";

interface PaymentInvoice {
  id: string;
  user_id: string;
  username: string;
  member_id: string;
  name: string;
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
  const logo = publicAppConfig?.logo || "/logo.png";
  const currency = publicAppConfig?.currency || "₹";

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${payment?.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
          .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center; }
          .brand-section { display: flex; align-items: center; gap: 16px; }
          .logo { width: 60px; height: 60px; border-radius: 12px; background: white; object-fit: contain; padding: 4px; }
          .brand-name { font-size: 28px; font-weight: 800; }
          .invoice-title { font-size: 14px; opacity: 0.9; letter-spacing: 2px; text-transform: uppercase; }
          .invoice-details { padding: 40px; }
          .section-title { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
          .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; }
          .info-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
          .info-value { font-size: 15px; font-weight: 600; color: #1a1a2e; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .items-table th { background: #667eea; color: white; padding: 14px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
          .items-table td { padding: 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; }
          .items-table tr:last-child td { border-bottom: none; }
          .amount-section { background: #f8f9fa; padding: 24px; border-radius: 8px; display: flex; justify-content: flex-end; }
          .amount-row { display: flex; justify-content: space-between; width: 200px; gap: 40px; }
          .amount-label { font-size: 14px; color: #666; }
          .amount-value { font-size: 18px; font-weight: 700; color: #1a1a2e; }
          .total-row { border-top: 2px solid #ddd; padding-top: 12px; margin-top: 12px; }
          .total-row .amount-value { font-size: 22px; color: #667eea; }
          .footer { padding: 24px 40px; background: #f8f9fa; border-top: 1px solid #e0e0e0; }
          .footer-text { font-size: 12px; color: #999; text-align: center; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
          .status-paid { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-failed { background: #f8d7da; color: #721c24; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    handlePrint();
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
          <GlowButton variant="ghost" onClick={onClose}>
            <X size={18} />
          </GlowButton>
          <GlowButton onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={18} />
            Print Invoice
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
              <p className="font-bold text-slate-900">{payment.name || "N/A"}</p>
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
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                payment.status === "paid" ? "bg-emerald-100 text-emerald-700" :
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