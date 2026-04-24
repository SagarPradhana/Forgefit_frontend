import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  StatusBadge,
  Skeleton,
} from "../../components/ui/primitives";
import { Trash2, CheckCircle, Search } from "lucide-react";
import { toast } from "../../store/toastStore";
import { adminInquiryService } from "../../services/adminInquiryService";

type InquiryType = "subscriptions" | "products" | "contacts" | "expiry";

export function InquiryCenter() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<InquiryType>("subscriptions");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, count: 10, offset: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery || undefined,
        count: meta.count,
        offset: meta.offset,
      };

      let res;
      switch (activeTab) {
        case "subscriptions":
          res = await adminInquiryService.getSubscriptionInquiries(params);
          break;
        case "products":
          res = await adminInquiryService.getProductOrders(params);
          break;
        case "contacts":
          res = await adminInquiryService.getContactInquiries(params);
          break;
        case "expiry":
          res = await adminInquiryService.getExpiringMembers(params);
          break;
      }

      if (res && res.data) {
        setData(res.data);
        setMeta(prev => ({ ...prev, total: res.totalcount }));
      }
    } catch (err) {
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, meta.count, meta.offset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      switch (activeTab) {
        case "subscriptions": await adminInquiryService.deleteSubscriptionInquiry(id); break;
        case "products": await adminInquiryService.deleteProductOrder(id); break;
        case "contacts": await adminInquiryService.deleteContactInquiry(id); break;
        case "expiry": await adminInquiryService.deleteExpiringMemberRecord(id); break;
      }
      toast.success("Record deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Delete operation failed");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      switch (activeTab) {
        case "subscriptions": await adminInquiryService.updateSubscriptionInquiry(id); break;
        case "products": await adminInquiryService.updateProductOrder(id); break;
        case "contacts": await adminInquiryService.updateContactInquiry(id); break;
        case "expiry": await adminInquiryService.updateExpiringMemberRecord(id); break;
      }
      toast.success("Record marked as resolved");
      fetchData();
    } catch (err) {
      toast.error("Resolve operation failed");
    }
  };

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
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
            placeholder="Filter records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : (
          <>
            {activeTab === "subscriptions" && (
              <Table
                headers={["User", "Requested Plan", "Inquiry Date", "Status", "Actions"]}
                rows={data.map((r) => [
                  <div key={r.id}>
                    <p className="font-bold text-white uppercase tracking-tighter text-xs">{r.name || r.username}</p>
                    <p className="text-[10px] text-slate-500">{r.email}</p>
                  </div>,
                  <span key={`${r.id}-plan`} className="text-indigo-400 font-black italic">PLAN ID: {r.subscription_plan_id?.substring(0, 8)}...</span>,
                  <span key={`${r.id}-date`} className="text-slate-400 text-xs">{new Date(r.inquiry_date * 1000).toLocaleDateString()}</span>,
                  <StatusBadge key={`${r.id}-status`} status={r.status ? "Resolved" : "Pending"} />,
                  <div key={`${r.id}-actions`} className="flex gap-3">
                    <button onClick={() => handleResolve(r.id)} className="text-emerald-400 hover:scale-125 transition-transform" title="Resolve"><CheckCircle size={16} /></button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:scale-125 transition-transform" title="Delete"><Trash2 size={16} /></button>
                  </div>
                ])}
              />
            )}

            {activeTab === "products" && (
              <Table
                headers={["User", "Product ID", "Quantity", "Date", "Status", "Actions"]}
                rows={data.map((r) => [
                  <div key={r.id}>
                    <p className="font-bold text-white uppercase tracking-tighter text-xs">{r.name || r.username}</p>
                    <p className="text-[10px] text-slate-500">{r.email}</p>
                  </div>,
                  <span key={`${r.id}-prod`} className="text-orange-400 font-black">PROD: {r.product_id?.substring(0, 8)}...</span>,
                  <span key={`${r.id}-qty`} className="text-slate-200 font-black italic text-lg">{r.quantity}</span>,
                  <span key={`${r.id}-date`} className="text-slate-400 text-xs">{new Date(r.inquiry_date * 1000).toLocaleDateString()}</span>,
                  <StatusBadge key={`${r.id}-status`} status={r.status ? "Resolved" : "Pending"} />,
                  <div key={`${r.id}-actions`} className="flex gap-3">
                    <button onClick={() => handleResolve(r.id)} className="text-emerald-400 hover:scale-125 transition-transform" title="Resolve"><CheckCircle size={16} /></button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:scale-125 transition-transform" title="Delete"><Trash2 size={16} /></button>
                  </div>
                ])}
              />
            )}

            {activeTab === "contacts" && (
              <Table
                headers={["Liaison", "Subject & Objective", "Contact Signals", "Date", "Status", "Actions"]}
                rows={data.map((r) => [
                  <div key={r.id}>
                    <p className="font-bold text-white uppercase tracking-tighter text-xs">{r.name}</p>
                    <p className="text-[10px] text-slate-500">{r.email}</p>
                  </div>,
                  <div key={`${r.id}-msg`} className="max-w-xs">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-tight">{r.subject || 'Strategic Inquiry'}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-2 italic">"{r.message}"</p>
                  </div>,
                  <div key={`${r.id}-contact`} className="flex flex-col">
                    <span className="text-[10px] font-black text-white">{r.phone}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">{r.email}</span>
                  </div>,
                  <span key={`${r.id}-date`} className="text-slate-400 text-xs">{new Date(r.inquiry_date * 1000).toLocaleDateString()}</span>,
                  <StatusBadge key={`${r.id}-status`} status={r.status ? "Resolved" : "Pending"} />,
                  <div key={`${r.id}-actions`} className="flex gap-3">
                    <button onClick={() => handleResolve(r.id)} className="text-emerald-400 hover:scale-125 transition-transform" title="Resolve"><CheckCircle size={16} /></button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:scale-125 transition-transform" title="Delete"><Trash2 size={16} /></button>
                  </div>
                ])}
              />
            )}

            {activeTab === "expiry" && (
              <Table
                headers={["Entity", "Timeline", "Status", "Actions"]}
                rows={data.map((r) => [
                  <div key={r.id}>
                    <p className="font-bold text-white uppercase tracking-tight italic">{r.name || r.username}</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{r.mobile || r.email || 'Member Protocol'}</p>
                  </div>,
                  <div key={`${r.id}-cycle`} className="flex flex-col">
                    <span className="text-xl font-black text-orange-400 italic leading-none">{r.remaining_days} DAYS</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Timeline to Termination</span>
                  </div>,
                  <div key={`${r.id}-status`} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{r.status ? "Resolved" : "Renewal Critical"}</span>
                  </div>,
                  <div key={`${r.id}-actions`} className="flex gap-3">
                    <button onClick={() => handleResolve(r.id)} className="h-8 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                      <CheckCircle size={12} /> Resolve
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:scale-125 transition-transform p-2"><Trash2 size={16} /></button>
                  </div>
                ])}
              />
            )}

            {data.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-500 uppercase font-black tracking-widest text-xs">No signals detected in the {activeTab} frequency.</p>
              </div>
            )}

            {meta.total > meta.count && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  disabled={meta.offset === 0}
                  onClick={() => setMeta({ ...meta, offset: Math.max(0, meta.offset - meta.count) })}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white disabled:opacity-30"
                >
                  Prev
                </button>
                <button
                  disabled={meta.offset + meta.count >= meta.total}
                  onClick={() => setMeta({ ...meta, offset: meta.offset + meta.count })}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
