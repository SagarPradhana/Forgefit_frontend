import { useState } from "react";
import { useGymStore } from "../../store/gymStore";
import {
  Table,
  StatusBadge,
} from "../../components/ui/primitives";
import { Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "../../store/toastStore";
import { expiringUsers } from "../../data/mockData";

export function InquiryCenter() {
  const {
    subscriptionRequests,
    productRequests,
    contactInquiries,
    updateSubscriptionRequest,
    deleteSubscriptionRequest,
    updateProductRequest,
    deleteProductRequest,
    updateContactInquiry,
    deleteContactInquiry,
  } = useGymStore();

  const [activeTab, setActiveTab] = useState<"subscriptions" | "products" | "contacts" | "expiry">("subscriptions");

  const tabs = [
    { id: "subscriptions", label: "Subscriptions", count: subscriptionRequests.length },
    { id: "products", label: "Product Orders", count: productRequests.length },
    { id: "contacts", label: "Contact Inquiries", count: contactInquiries.length },
    { id: "expiry", label: "Expiring Soon", count: expiringUsers.length },
  ];

  return (
      <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                          activeTab === tab.id
                              ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                  >
                      {tab.label}
                      <span className="ml-2 px-1.5 py-0.5 rounded-md bg-black/30 text-[9px]">{tab.count}</span>
                  </button>
              ))}
          </div>

          <div className="w-full">
            {activeTab === "subscriptions" && (
                <Table
                    headers={["User", "Requested Plan", "Date", "Status", "Actions"]}
                    rows={subscriptionRequests.map((r) => [
                        <div key={r.id}>
                            <p className="font-bold text-white">{r.userName}</p>
                            <p className="text-[10px] text-slate-500">{r.email}</p>
                        </div>,
                        <span key={`${r.id}-plan`} className="text-indigo-300 font-bold">{r.planName}</span>,
                        <span key={`${r.id}-date`} className="text-slate-400 text-xs">{r.date}</span>,
                        <StatusBadge key={`${r.id}-status`} status={r.status === "pending" ? "Pending" : r.status === "resolved" ? "Paid" : "Pending"} />,
                        <div key={`${r.id}-actions`} className="flex gap-3">
                            <button onClick={() => { updateSubscriptionRequest(r.id, "resolved"); toast.success("Approved Subscription"); }} className="text-emerald-400 hover:scale-125 transition-transform" title="Approve"><CheckCircle size={18}/></button>
                            <button onClick={() => { updateSubscriptionRequest(r.id, "rejected"); toast.error("Rejected Subscription"); }} className="text-amber-400 hover:scale-125 transition-transform" title="Reject"><XCircle size={18}/></button>
                            <button onClick={() => { deleteSubscriptionRequest(r.id); toast.error("Deleted Request"); }} className="text-red-400 hover:scale-125 transition-transform" title="Delete"><Trash2 size={18}/></button>
                        </div>
                    ])}
                />
            )}

            {activeTab === "products" && (
                <Table
                    headers={["User", "Product Info", "Qty", "Status", "Actions"]}
                    rows={productRequests.map((r) => [
                        <div key={r.id}>
                            <p className="font-bold text-white">{r.userName}</p>
                            <p className="text-[10px] text-slate-500">{r.email}</p>
                        </div>,
                        <span key={`${r.id}-prod`} className="text-orange-300 font-bold">{r.productName}</span>,
                        <span key={`${r.id}-qty`} className="text-slate-400 font-black">{r.quantity}</span>,
                        <StatusBadge key={`${r.id}-status`} status={r.status === "pending" ? "Pending" : r.status === "resolved" ? "Paid" : "Pending"} />,
                        <div key={`${r.id}-actions`} className="flex gap-3">
                            <button onClick={() => { updateProductRequest(r.id, "resolved"); toast.success("Order Processed"); }} className="text-emerald-400 hover:scale-125 transition-transform" title="Approve"><CheckCircle size={18}/></button>
                            <button onClick={() => { updateProductRequest(r.id, "rejected"); toast.error("Order Cancelled"); }} className="text-amber-400 hover:scale-125 transition-transform" title="Reject"><XCircle size={18}/></button>
                            <button onClick={() => { deleteProductRequest(r.id); toast.error("Order Deleted"); }} className="text-red-400 hover:scale-125 transition-transform" title="Delete"><Trash2 size={18}/></button>
                        </div>
                    ])}
                />
            )}

            {activeTab === "contacts" && (
                <Table
                    headers={["User", "Subject & Message", "Date", "Status", "Actions"]}
                    rows={contactInquiries.map((r) => [
                        <div key={r.id}>
                            <p className="font-bold text-white">{r.userName}</p>
                            <p className="text-[10px] text-slate-500">{r.email}</p>
                        </div>,
                        <div key={`${r.id}-msg`} className="max-w-xs">
                            <p className="text-xs font-bold text-indigo-300 uppercase tracking-tight">{r.subject}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{r.message}</p>
                        </div>,
                        <span key={`${r.id}-date`} className="text-slate-400 text-xs">{r.date}</span>,
                        <StatusBadge key={`${r.id}-status`} status={r.status === "pending" ? "Pending" : r.status === "resolved" ? "Paid" : "Pending"} />,
                        <div key={`${r.id}-actions`} className="flex gap-3">
                            <button onClick={() => { updateContactInquiry(r.id, "resolved"); toast.success("Marked as Resolved"); }} className="text-emerald-400 hover:scale-125 transition-transform" title="Resolve"><CheckCircle size={18}/></button>
                            <button onClick={() => { deleteContactInquiry(r.id); toast.error("Inquiry Deleted"); }} className="text-red-400 hover:scale-125 transition-transform" title="Delete"><Trash2 size={18}/></button>
                        </div>
                    ])}
                />
            )}
            {activeTab === "expiry" && (
                <Table
                    headers={["User", "Cycle Details", "Authority Status", "Action"]}
                    rows={expiringUsers.map((user) => [
                        <div key={user.name}>
                            <p className="font-bold text-white uppercase tracking-tight italic">{user.name}</p>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Active Member</p>
                        </div>,
                        <div key={`${user.name}-cycle`} className="flex flex-col">
                            <span className="text-xl font-black text-orange-400 italic leading-none">{user.daysLeft} DAYS</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Timeline to Termination</span>
                        </div>,
                        <div key={`${user.name}-status`} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Renewal Critical</span>
                        </div>,
                        <button 
                            key={`${user.name}-notif`}
                            onClick={() => toast.success(`Renewal reminder dispatched to ${user.name}`)}
                            className="h-10 px-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2"
                        >
                            <AlertCircle size={14} />
                            Dispatch Warning
                        </button>
                    ])}
                />
            )}
          </div>
      </div>
  );
}
