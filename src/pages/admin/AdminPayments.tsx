import { useState } from "react";
import { useGymStore } from "../../store/gymStore";
import { useTranslation } from "react-i18next";
import {
  GlassCard,
  GlowButton,
  SectionTitle,
  Skeleton,
  Table,
  EmptyState,
  StatusBadge,
  CommonButton,
  Pagination,
  LoadingOverlay,
  InlineSpinner,
} from "../../components/ui/primitives";
import { Edit2, Trash2, Printer, FileText, Download } from "lucide-react";
import { adminPaymentService, type PaymentResponse, type PaymentMethod, type PaymentStatus, type PurchaseType } from "../../services/adminPaymentService";
import { adminProductService } from "../../services/adminProductService";
import { adminSubscriptionService, type PlanResponse } from "../../services/adminSubscriptionService";
import { getCurrencySymbol } from "../../utils/currency";
import { toast } from "../../store/toastStore";
import { DeleteConfirmationModal } from "../../components/common/DeleteConfirmationModal";
import { DateRangeFilter, type DateRange } from "../../components/ui/DateRangeFilter";
import { InvoiceModal } from "../../components/admin/users/InvoiceModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { API_ENDPOINTS } from "../../utils/url";
import { api } from "../../utils/httputils";
import { PaymentModal } from "../../components/admin/payments/PaymentModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys";

export function AdminPayments() {
  const { t } = useTranslation();
  const { appConfig } = useGymStore();
  const currencySymbol = getCurrencySymbol(appConfig?.currency || "INR");

  const queryClient = useQueryClient();
  const [paymentsMeta, setPaymentsMeta] = useState({
    page_no: 1,
    page_size: 10,
  });
  const [paymentStatus, setPaymentStatus] = useState<"All" | "Paid" | "Pending">("All");
  const [paymentDateRange, setPaymentDateRange] = useState<DateRange>({ label: "This Month" });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<string | null>(null);
  const [usersDropdown, setUsersDropdown] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<PlanResponse[]>([]);
  const [fetchedProducts, setFetchedProducts] = useState<any[]>([]);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: any } | null>(null);

  // 🛡️ FETCH PAYMENTS QUERY
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: queryKeys.admin.payments({
      page: paymentsMeta.page_no,
      status: paymentStatus,
      range: paymentDateRange
    }),
    queryFn: () => adminPaymentService.getPayments({
      count: paymentsMeta.page_size,
      offset: (paymentsMeta.page_no - 1) * paymentsMeta.page_size,
      status: paymentStatus !== "All" ? paymentStatus.toLowerCase() as any : undefined,
      from_date: paymentDateRange.from_date,
      to_date: paymentDateRange.to_date,
    }),
  });

  // 🛡️ DELETE PAYMENT MUTATION
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminPaymentService.deletePayment(id),
    onSuccess: () => {
      toast.success("Transaction purged from registry");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.payments({}) });
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Operation failed");
    }
  });

  // 📝 SAVE PAYMENT MUTATION (CREATE/UPDATE)
  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      editPayment
        ? adminPaymentService.updatePayment(editPayment, payload)
        : adminPaymentService.createPayment(payload),
    onSuccess: () => {
      toast.success(editPayment ? "Financial record updated" : "New transaction logged");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.payments({}) });
      setPaymentModalOpen(false);
      setEditPayment(null);
    },
    onError: () => {
      toast.error("Process failed");
    }
  });

  const fetchedPayments = paymentsData?.data || [];
  const totalCount = paymentsData?.total_count || paymentsData?.count || 0;
  const lastPage = Math.ceil(totalCount / paymentsMeta.page_size) || 1;

  const [modalBootstrapping, setModalBootstrapping] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    user_id: "",
    amount: "0",
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: "cash" as PaymentMethod,
    status: "paid" as PaymentStatus,
    purchase_type: "product" as PurchaseType,
    purchase_id: "",
    purchase_details: { additionalProp1: {} } as any
  });



  const bootstrapPaymentModal = async (payment?: PaymentResponse) => {
    setModalBootstrapping(true);
    try {
      await Promise.all([
        api.get(API_ENDPOINTS.ADMIN.GET_USERS_DROPDOWN).then((res: any) => res.data && setUsersDropdown(res.data)),
        adminProductService.getProducts({ count: 100 }).then((res: any) => res.data && setFetchedProducts(res.data)),
        adminSubscriptionService.getPlans({ count: 100 }).then((res: any) => res.data && setSubscriptionPlans(res.data)),
      ]);

      if (payment) {
        setEditPayment(payment.id);
        setPaymentForm({
          user_id: payment.user_id,
          amount: String(payment.amount),
          payment_date: new Date(payment.payment_date * 1000).toISOString().split('T')[0],
          payment_method: payment.payment_method as PaymentMethod,
          status: payment.status as PaymentStatus,
          purchase_type: payment.purchase_type as PurchaseType,
          purchase_id: payment.purchase_id,
          purchase_details: payment.purchase_details || { additionalProp1: {} }
        });
      } else {
        setPaymentForm({
          user_id: "",
          amount: "0",
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: "cash" as PaymentMethod,
          status: "paid" as PaymentStatus,
          purchase_type: "product" as PurchaseType,
          purchase_id: "",
          purchase_details: { additionalProp1: {} }
        });
        setEditPayment(null);
      }

      setPaymentModalOpen(true);
    } finally {
      setModalBootstrapping(false);
    }
  };

  const handleExportPDF = async () => {
    if (!fetchedPayments.length) {
      toast.error("No data to export");
      return;
    }
    setExportingPdf(true);
    try {
      const doc = new jsPDF();
      doc.text(`Payments Report-${new Date().toLocaleDateString()}`, 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [["Username", "Name", "Mobile", "Date", "Amount", "Method", "Type", "Status"]],
        body: fetchedPayments.map((p) => [
          p.username || "System",
          (p as any).name || p.Name || "N/A",
          p.mobile || "N/A",
          new Date(p.payment_date * 1000).toLocaleDateString(),
          p.amount.toString(),
          p.payment_method,
          p.purchase_type,
          p.status
        ]),
      });
      doc.save(`Payments_Report-${new Date().toLocaleDateString()}.pdf`);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    if (!fetchedPayments.length) {
      toast.error("No data to export");
      return;
    }
    setExportingExcel(true);
    try {
      const data = fetchedPayments.map((p) => ({
        Username: p.username || "System",
        Name: (p as any).name || p.Name || "N/A",
        Mobile: p.mobile || "N/A",
        Date: new Date(p.payment_date * 1000).toLocaleDateString(),
        Amount: p.amount,
        Method: p.payment_method,
        Type: p.purchase_type,
        Status: p.status
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
      XLSX.writeFile(workbook, `Payments_Report-${new Date().toLocaleDateString()}.xlsx`);
    } finally {
      setExportingExcel(false);
    }
  };



  return (
    <GlassCard>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <SectionTitle
          title={t("payments")}
          subtitle="Secure transaction ledger with multi-dimensional filtering."
        />
        <GlowButton
          onClick={() => bootstrapPaymentModal()}
          disabled={modalBootstrapping}
        >
          {t("createNewPayment")}
        </GlowButton>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("transactionStatus")}</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition shadow-2xl"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as any)}
          >
            <option value="All">{t("allTransactions")}</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <DateRangeFilter
          defaultPreset="monthly"
          onChange={(r) => setPaymentDateRange(r)}
        />
        <div className="flex gap-2 ml-auto">
          <CommonButton variant="ghost" onClick={handleExportPDF} disabled={exportingPdf} className="flex items-center gap-2">
            {exportingPdf ? <InlineSpinner size={16} /> : <FileText size={16} />} PDF
          </CommonButton>
          <CommonButton variant="ghost" onClick={handleExportExcel} disabled={exportingExcel} className="flex items-center gap-2 text-emerald-400">
            {exportingExcel ? <InlineSpinner size={16} /> : <Download size={16} />} Excel
          </CommonButton>
        </div>
      </div>

      {paymentsLoading && fetchedPayments.length === 0 ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : fetchedPayments.length > 0 ? (
        <div className="relative">
          <Table
            columns={[
              { key: "name", label: t("name"), render: (p) => <span className="text-xs font-bold text-white uppercase tracking-tight italic">{(p as any).name || p.Name || '--'}</span> },
              { key: "contact", label: t("contact"), render: (p) => <span className="text-[10px] font-black text-indigo-400 tracking-widest">{p.mobile || '--'}</span> },
              { key: "date", label: t("timestamp"), render: (p) => <span className="text-xs font-medium text-slate-300">{new Date(p.payment_date * 1000).toLocaleDateString()}</span> },
              { key: "amount", label: t("valuation"), render: (p) => <span className="text-emerald-400 font-black italic">{currencySymbol}{p.amount}</span> },
              { key: "method", label: t("method"), render: (p) => <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{p.payment_method}</span> },
              { key: "type", label: t("type"), render: (p) => <span className="text-[10px] font-bold text-slate-400 uppercase">{p.purchase_type}</span> },
              { key: "status", label: t("status"), render: (p) => <StatusBadge status={p.status.charAt(0).toUpperCase() + p.status.slice(1) as any} /> },
              {
                key: "actions",
                label: t("operations"),
                render: (p) => (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => bootstrapPaymentModal(p)}
                      className={`${p.purchase_type === "subscription" ? "text-slate-600 cursor-not-allowed pointer-events-none" : "text-indigo-400 hover:text-indigo-300"}`}
                      title={p.purchase_type === "subscription" ? t("cannotEditSubPayment") : t("editPayment")}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget({ type: "payment", id: p.id });
                        setDeleteModalOpen(true);
                      }}
                      className={`${p.purchase_type === "subscription" ? "text-slate-600 cursor-not-allowed pointer-events-none" : "text-red-400 hover:text-red-300"}`}
                      title={p.purchase_type === "subscription" ? t("cannotDeleteSubPayment") : t("deletePayment")}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setInvoiceModalOpen(true);
                      }}
                      className="text-emerald-400 hover:text-emerald-300"
                      title={t("downloadInvoice")}
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                )
              },
            ]}
            data={fetchedPayments}
          />
          <LoadingOverlay show={paymentsLoading && fetchedPayments.length > 0} label="Refreshing payments" compact />

          <Pagination
            currentPage={paymentsMeta.page_no}
            totalPages={lastPage}
            hasPrev={paymentsMeta.page_no > 1}
            hasNext={paymentsMeta.page_no < lastPage}
            onPrev={() => setPaymentsMeta({ ...paymentsMeta, page_no: paymentsMeta.page_no - 1 })}
            onNext={() => setPaymentsMeta({ ...paymentsMeta, page_no: paymentsMeta.page_no + 1 })}
          />
        </div>
      ) : (
        <EmptyState
          title="Financial Static"
          hint="No transaction signals detected for the selected parameters."
        />
      )}

      {/* Create/Edit Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        editPaymentId={editPayment}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
        usersDropdown={usersDropdown}
        subscriptionPlans={subscriptionPlans}
        fetchedProducts={fetchedProducts}
        currencySymbol={currencySymbol}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: queryKeys.admin.payments({}) })}
        mutation={saveMutation}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen && deleteTarget?.type === "payment"}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (deleteTarget && deleteTarget.type === "payment") {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        title="Registry Purge"
        description="This financial record will be permanently erased from the master ledger."
        confirmLabel="Submit"
        isProcessing={deleteMutation.isPending}
      />

      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => {
          setInvoiceModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />

      {/* FULL SCREEN LOADING OVERLAY */}
      <LoadingOverlay
        show={deleteMutation.isPending || saveMutation.isPending || modalBootstrapping}
        label={modalBootstrapping ? "Preparing Modal..." : (t("processingRequest") || "Processing Request...")}
      />
    </GlassCard>
  );
}
