import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, CreditCard, History, Plus, RefreshCw, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useGet, useMutation } from "../../../hooks/useApi";
import { API_ENDPOINTS } from "../../../utils/url";
import { toast } from "../../../store/toastStore";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
}

export const SubscriptionModal = ({ isOpen, onClose, selectedUser }: SubscriptionModalProps) => {
  const [activeTab, setActiveTab] = useState<"add" | "history">("add");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1);
  const [endDate, setEndDate] = useState("");

  const { data: plansData, loading: plansLoading } = useGet(API_ENDPOINTS.ADMIN.PLANS);
  const plans = plansData?.data || [];

  const { data: historyData, loading: historyLoading, refetch: refetchHistory } = useGet(
    selectedUser ? API_ENDPOINTS.ADMIN.USER_SUBSCRIPTIONS(selectedUser.id) : null
  );
  const history = historyData?.data || [];

  const { mutate: subscribe, loading: subscribing } = useMutation("post", {
    onSuccess: () => {
      toast.success("Subscription updated successfully");
      refetchHistory();
      setActiveTab("history");
    }
  });

  // Real-time end date calculation
  useEffect(() => {
    const start = new Date(joiningDate);
    if (!isNaN(start.getTime())) {
      const end = new Date(start.setMonth(start.getMonth() + duration));
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [joiningDate, duration]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("add");
      setSelectedPlanId("");
      setJoiningDate(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen]);

  if (!isOpen || !selectedUser) return null;

  const handleSubscribe = () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }
    const payload = {
      plan_id: selectedPlanId,
      joining_date: Math.floor(new Date(joiningDate).getTime() / 1000),
      amount: Number(amount),
      duration_in_months: Number(duration)
    };
    subscribe(API_ENDPOINTS.ADMIN.USER_SUBSCRIBE(selectedUser.id), payload);
  };

  const handlePlanSelect = (planId: string) => {
    const plan = plans.find((p: any) => p.id === planId);
    if (plan) {
      setSelectedPlanId(planId);
      setAmount(plan.price);
      setDuration(plan.duration || 1);
    } else {
      setSelectedPlanId("");
      setAmount(0);
      setDuration(1);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative z-[101] w-full max-w-4xl bg-slate-950/95 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CreditCard size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Subscription Hub</h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{selectedUser.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition text-slate-400 border border-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="flex p-2 bg-white/5 border-b border-white/10 shrink-0">
          <button onClick={() => setActiveTab("add")} className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${activeTab === "add" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}>
            <Plus size={16} /> New / Renew
          </button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${activeTab === "history" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}>
            <History size={16} /> History
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {activeTab === "add" ? (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Membership Plan</label>
                  <select 
                    value={selectedPlanId} 
                    onChange={(e) => handlePlanSelect(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white font-bold appearance-none focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="" className="bg-slate-900">Select a payment plan...</option>
                    {plans.map((p: any) => (
                      <option key={p.id} value={p.id} className="bg-slate-900">{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-400 font-bold uppercase">Plan Rate</span>
                     <span className="text-lg font-black text-white">₹{amount}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-400 font-bold uppercase">Months</span>
                     <span className="text-sm font-bold text-slate-200">{duration} Months</span>
                   </div>
                   <div className="h-px bg-white/5" />
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-indigo-400 font-black uppercase">Charge Amount</span>
                     <input 
                       type="number" 
                       value={amount} 
                       onChange={(e) => setAmount(Number(e.target.value))}
                       className="w-24 bg-transparent text-right text-indigo-400 font-black text-lg focus:outline-none"
                     />
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Activation Date</label>
                    <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-indigo-500/50 uppercase mb-2 text-right">Expiration Date</label>
                    <p className="p-3 text-right text-indigo-400 font-bold text-sm bg-indigo-500/5 rounded-xl border border-indigo-500/20">{endDate}</p>
                  </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl flex items-start gap-3">
                  <Calendar size={16} className="text-orange-400 shrink-0 mt-1" />
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-medium">Automatic expiration calculated for <span className="text-white font-black">{endDate}</span>. Admin can override price if needed.</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={subscribing || !selectedPlanId}
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 rounded-2xl font-black uppercase text-white shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {subscribing ? <Loader2 className="animate-spin" size={20} /> : <><RefreshCw size={20} /> Process Membership</>}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {historyLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
              ) : history.length > 0 ? (
                <div className="overflow-hidden rounded-3xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Validity</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Charge</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.map((sub: any, idx: number) => (
                        <tr key={idx} className="bg-slate-900/20">
                          <td className="px-6 py-4">
                            <p className="font-bold text-white uppercase tracking-tight">{sub.plan_name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black">{sub.duration} Months</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-300 font-mono text-[11px]">{new Date(sub.start_date * 1000).toLocaleDateString()}</p>
                            <p className="text-[9px] text-indigo-400 font-black uppercase">Active Record</p>
                          </td>
                          <td className="px-6 py-4 text-slate-300 font-bold">₹{sub.amount}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center">
                   <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <History size={32} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No History Records Found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
