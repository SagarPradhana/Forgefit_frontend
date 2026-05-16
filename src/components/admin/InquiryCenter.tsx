import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  StatusBadge,
  Skeleton,
  Pagination,
  InlineSpinner,
  LoadingOverlay,
} from "../../components/ui/primitives";
import { Trash2, CheckCircle, Search } from "lucide-react";
import { toast } from "../../store/toastStore";
import { adminInquiryService } from "../../services/adminInquiryService";
import { DeleteConfirmationModal } from "../common/DeleteConfirmationModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys";

type InquiryType = "subscriptions" | "products" | "contacts" | "expiry";

export function InquiryCenter() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<InquiryType>("subscriptions");
  const [meta, setMeta] = useState({ count: 10, offset: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
      setMeta((prev) => ({ ...prev, offset: 0 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🛡️ FETCH INQUIRIES QUERY
  const { data: inquiriesData, isLoading: initialLoading, isFetching: loading } = useQuery({
    queryKey: queryKeys.admin.inquiries(activeTab, { 
      search: debouncedSearchQuery, 
      offset: meta.offset, 
      count: meta.count 
    }),
    queryFn: async () => {
      const params = {
        search: debouncedSearchQuery || undefined,
        count: meta.count,
        offset: meta.offset,
      };
      switch (activeTab) {
        case "subscriptions": return adminInquiryService.getSubscriptionInquiries(params);
        case "products": return adminInquiryService.getProductOrders(params);
        case "contacts": return adminInquiryService.getContactInquiries(params);
        case "expiry": return adminInquiryService.getExpiringMembers(params);
        default: return { data: [], total_count: 0 };
      }
    },
  });

  // 🛡️ RESOLVE MUTATION
  const resolveMutation = useMutation({
    mutationFn: (id: string) => {
      switch (activeTab) {
        case "subscriptions": return adminInquiryService.updateSubscriptionInquiry(id);
        case "products": return adminInquiryService.updateProductOrder(id);
        case "contacts": return adminInquiryService.updateContactInquiry(id);
        case "expiry": return adminInquiryService.updateExpiringMemberRecord(id);
        default: throw new Error("Invalid tab");
      }
    },
    onSuccess: () => {
      toast.success(t("success"));
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
    onError: () => toast.error("Resolve operation failed")
  });

  // 🛡️ DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      switch (activeTab) {
        case "subscriptions": return adminInquiryService.deleteSubscriptionInquiry(id);
        case "products": return adminInquiryService.deleteProductOrder(id);
        case "contacts": return adminInquiryService.deleteContactInquiry(id);
        case "expiry": return adminInquiryService.deleteExpiringMemberRecord(id);
        default: throw new Error("Invalid tab");
      }
    },
    onSuccess: () => {
      toast.success(t("success"));
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    },
    onError: () => toast.error("Delete operation failed")
  });

  const data = inquiriesData?.data || [];
  const totalCount = inquiriesData?.total_count || 0;

  const tabs: { id: InquiryType; label: string }[] = [
    { id: "subscriptions", label: t("subscriptions") },
    { id: "products", label: t("products") },
    { id: "contacts", label: t("contact") },
    { id: "expiry", label: t("upcomingRenewals") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMeta({ ...meta, offset: 0 });
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${activeTab === tab.id
                ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                }`}
            >
              {t(tab.id)}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
            placeholder={t("searchRecords")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6 px-1">
        {activeTab === "subscriptions" && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t("subscriptionsTabSubtitle")}</p>}
        {activeTab === "products" && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t("productsTabSubtitle")}</p>}
        {activeTab === "contacts" && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t("contactsTabSubtitle")}</p>}
        {activeTab === "expiry" && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t("expiryTabSubtitle")}</p>}
      </div>

      <div className="relative w-full min-h-[260px]">
        {initialLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : (
          <>
            {activeTab === "subscriptions" && (
              <Table
                columns={[
                  { key: "name", label: t("name"), render: (r) => <p className="font-bold text-white uppercase tracking-tighter text-xs">{r.user_name || r.name || r.username || '—'}</p> },
                  { key: "contact", label: t("mobileEmail"), render: (r) => <p className="text-[10px] text-slate-500">{r.user_mobile || r.email || '—'}</p> },
                  { 
                    key: "plan", 
                    label: t("requestedPlan"), 
                    render: (r) => (
                      <div>
                        <p className="text-indigo-400 font-black italic text-xs">
                          {r.plan_name || r.subscription_plan_name || r.subscription_name || `Plan: ${r.subscription_plan_id?.substring(0, 8)}…`}
                        </p>
                        {r.description && <p className="text-[10px] text-slate-500 mt-0.5 italic line-clamp-1">{r.description}</p>}
                      </div>
                    ) 
                  },
                  { key: "date", label: t("inquiryDate"), render: (r) => <span className="text-slate-400 text-xs">{new Date(r.inquiry_date * 1000).toLocaleDateString()}</span> },
                  { key: "status", label: t("status"), render: (r) => <StatusBadge status={r.status ? t("resolved") as any : t("pending") as any} /> },
                  { 
                    key: "actions", 
                    label: t("actions"), 
                    render: (r) => (
                      <div className="flex gap-3">
                        <button
                          onClick={() => resolveMutation.mutate(r.id)}
                          disabled={resolveMutation.isPending && resolveMutation.variables === r.id}
                          className="text-emerald-400 hover:scale-125 transition-transform disabled:opacity-60 disabled:hover:scale-100"
                          title={t("resolve")}
                        >
                          {resolveMutation.isPending && resolveMutation.variables === r.id ? <InlineSpinner size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button onClick={() => { setDeleteTargetId(r.id); setDeleteModalOpen(true); }} className="text-red-400 hover:scale-125 transition-transform" title={t("delete")}><Trash2 size={16} /></button>
                      </div>
                    ) 
                  },
                ]}
                data={data}
              />
            )}

            {activeTab === "products" && (
              <Table
                columns={[
                  { key: "name", label: t("name"), render: (r) => <p className="font-bold text-white uppercase tracking-tighter text-xs">{r.user_name || r.name || r.username || '—'}</p> },
                  { key: "contact", label: t("mobileEmail"), render: (r) => <p className="text-[10px] text-slate-500">{r.user_mobile || r.email || '—'}</p> },
                  { 
                    key: "prod", 
                    label: t("product"), 
                    render: (r) => (
                      <div>
                        <p className="text-orange-400 font-black text-xs">
                          {r.product_name || r.product?.name || `Product: ${r.product_id?.substring(0, 8)}…`}
                        </p>
                        {r.description && <p className="text-[10px] text-slate-500 mt-0.5 italic line-clamp-1">{r.description}</p>}
                      </div>
                    ) 
                  },
                  { key: "qty", label: t("qty"), render: (r) => <span className="text-slate-200 font-black italic text-lg">{r.quantity}</span> },
                  { key: "date", label: t("date"), render: (r) => <span className="text-slate-400 text-xs">{new Date(r.inquiry_date * 1000).toLocaleDateString()}</span> },
                  { key: "status", label: t("status"), render: (r) => <StatusBadge status={r.status ? t("resolved") as any : t("pending") as any} /> },
                  { 
                    key: "actions", 
                    label: t("actions"), 
                    render: (r) => (
                      <div className="flex gap-3">
                        <button
                          onClick={() => resolveMutation.mutate(r.id)}
                          disabled={resolveMutation.isPending && resolveMutation.variables === r.id}
                          className="text-emerald-400 hover:scale-125 transition-transform disabled:opacity-60 disabled:hover:scale-100"
                          title={t("resolve")}
                        >
                          {resolveMutation.isPending && resolveMutation.variables === r.id ? <InlineSpinner size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button onClick={() => { setDeleteTargetId(r.id); setDeleteModalOpen(true); }} className="text-red-400 hover:scale-125 transition-transform" title={t("delete")}><Trash2 size={16} /></button>
                      </div>
                    ) 
                  },
                ]}
                data={data}
              />
            )}

            {activeTab === "contacts" && (
              <Table
                columns={[
                  { key: "name", label: t("name"), render: (r) => <p className="font-bold text-white uppercase tracking-tighter text-xs">{r.name}</p> },
                  { key: "contact", label: t("mobileEmail"), render: (r) => <p className="text-[10px] text-slate-500">{r.phone || r.email}</p> },
                  { 
                    key: "msg", 
                    label: t("subjectObjective"), 
                    render: (r) => (
                      <div className="max-w-xs">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-tight">{r.subject || t("contactMessage")}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-2 italic">"{r.message}"</p>
                      </div>
                    ) 
                  },
                  { key: "date", label: t("date"), render: (r) => <span className="text-slate-400 text-xs">{new Date(r.inquiry_date * 1000).toLocaleDateString()}</span> },
                  { key: "status", label: t("status"), render: (r) => <StatusBadge status={r.status ? t("resolved") as any : t("pending") as any} /> },
                  { 
                    key: "actions", 
                    label: t("actions"), 
                    render: (r) => (
                      <div className="flex gap-3">
                        <button
                          onClick={() => resolveMutation.mutate(r.id)}
                          disabled={resolveMutation.isPending && resolveMutation.variables === r.id}
                          className="text-emerald-400 hover:scale-125 transition-transform disabled:opacity-60 disabled:hover:scale-100"
                          title={t("resolve")}
                        >
                          {resolveMutation.isPending && resolveMutation.variables === r.id ? <InlineSpinner size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button onClick={() => { setDeleteTargetId(r.id); setDeleteModalOpen(true); }} className="text-red-400 hover:scale-125 transition-transform" title={t("delete")}><Trash2 size={16} /></button>
                      </div>
                    ) 
                  },
                ]}
                data={data}
              />
            )}

            {activeTab === "expiry" && (
              <Table
                columns={[
                  { key: "name", label: t("name"), render: (r) => <p className="font-bold text-white uppercase tracking-tight italic">{r.user_name || r.name || r.username || '—'}</p> },
                  { key: "contact", label: t("mobileEmail"), render: (r) => <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{r.user_mobile || r.mobile || r.email || '—'}</p> },
                  { 
                    key: "cycle", 
                    label: t("timeline"), 
                    render: (r) => (
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-orange-400 italic leading-none">{r.remaining_days} {t("days")}</span>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{t("daysRemaining")}</span>
                      </div>
                    ) 
                  },
                  { 
                    key: "status", 
                    label: t("status"), 
                    render: (r) => (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{r.status ? t("resolved") : t("renewalCritical")}</span>
                      </div>
                    ) 
                  },
                  { 
                    key: "actions", 
                    label: t("actions"), 
                    render: (r) => (
                      <div className="flex gap-3">
                        <button
                          onClick={() => resolveMutation.mutate(r.id)}
                          disabled={resolveMutation.isPending && resolveMutation.variables === r.id}
                          className="h-8 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-60"
                        >
                          {resolveMutation.isPending && resolveMutation.variables === r.id ? <InlineSpinner size={12} /> : <CheckCircle size={12} />} {t("resolve")}
                        </button>
                        <button onClick={() => { setDeleteTargetId(r.id); setDeleteModalOpen(true); }} className="text-red-400 hover:scale-125 transition-transform p-2"><Trash2 size={16} /></button>
                      </div>
                    ) 
                  },
                ]}
                data={data}
              />
            )}

            {data.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-500 uppercase font-black tracking-widest text-xs">{t("noRecords")}</p>
              </div>
            )}

            <Pagination
              currentPage={Math.floor(meta.offset / meta.count) + 1}
              totalPages={Math.ceil((totalCount || 0) / (meta?.count || 1))}
              hasPrev={meta.offset > 0}
              hasNext={meta.offset + meta.count < totalCount}
              onPrev={() => setMeta({ ...meta, offset: Math.max(0, meta.offset - meta.count) })}
              onNext={() => setMeta({ ...meta, offset: meta.offset + meta.count })}
            />
          </>
        )}
        <LoadingOverlay show={loading && !initialLoading} label={t("refreshing") || "Refreshing records..."} compact />
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteTargetId && deleteMutation.mutate(deleteTargetId)}
        title={t("deleteRecordQuestion")}
        description={t("removalDescription")}
        confirmLabel={t("delete")}
        isProcessing={deleteMutation.isPending}
      />

      {/* FULL SCREEN LOADING OVERLAY */}
      <LoadingOverlay show={deleteMutation.isPending || resolveMutation.isPending} label={t("processingRequest") || "Processing Request..."} />
    </div>
  );
}
