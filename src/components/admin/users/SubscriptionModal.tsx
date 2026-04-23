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
    selectedUser ? `${API_ENDPOINTS.ADMIN.SUBSCRIPTION_HISTORY}?user_id=${selectedUser.id}` : null
  );
  const history = historyData?.data || [];

  const { mutate: subscribe, loading: subscribing } = useMutation("post", {
    onSuccess: () => {
      toast.success("Strategic membership activated");
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
      toast.error("Please select a target plan");
      return;
    }
    const payload = {
      user_id: selectedUser.id,
      joining_date: Math.floor(new Date(joiningDate).getTime() / 1000),
      subscription_plan_id: selectedPlanId,
      duration_in_months: Number(duration),
      amount: Number(amount),
    };
    subscribe(API_ENDPOINTS.ADMIN.SUBSCRIPTION_CREATE, payload);
  };

  const handlePlanSelect = (planId: string) => {
    const plan = plans.find((p: any) => p.id === planId);
    if (plan) {
      setSelectedPlanId(planId);
      setAmount(plan.price);
      setDuration(plan.duration_in_months || 1);
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
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative z-[101] w-full max-w-4xl bg-slate-950/80 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-2xl"
      >
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <CreditCard size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Subscription Management</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{selectedUser.name}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-white/10">
            <X size={24} />
          </button>
        </div>

        <div className="flex p-3 bg-white/5 border-b border-white/5 shrink-0 gap-2">
          <button onClick={() => setActiveTab("add")} className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${activeTab === "add" ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/30" : "text-slate-400 hover:bg-white/5"}`}>
            <Plus size={18} /> Add Plan
          </button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${activeTab === "history" ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/30" : "text-slate-400 hover:bg-white/5"}`}>
            <History size={18} /> History
          </button>
        </div>

        <div className="p-10 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {activeTab === "add" ? (
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Selection Protocol</label>
                  <div className="relative group">
                    <select 
                      value={selectedPlanId} 
                      onChange={(e) => handlePlanSelect(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-5 text-white font-black text-sm appearance-none focus:outline-none focus:border-indigo-500/50 transition-all hover:bg-slate-900"
                    >
                      <option value="" className="bg-slate-900">Select Strategic Tier...</option>
                      {plans.map((p: any) => (
                        <option key={p.id} value={p.id} className="bg-slate-900">{p.name} — ${p.price}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <Plus size={16} />
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
                   
                   <div className="flex items-center justify-between relative z-10">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Base Valuation</span>
                     <span className="text-2xl font-black text-white italic">${amount}</span>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Calculated Span</span>
                     <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-400" />
                        <span className="text-sm font-black text-slate-200">{duration} Months</span>
                     </div>
                   </div>
                   <div className="h-px bg-white/10 relative z-10" />
                   <div className="flex items-center justify-between relative z-10">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Final Price</span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 whitespace-nowrap">Standard Membership Rate</span>
                     </div>
                     <div className="flex items-center gap-2 bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10">
                        <span className="text-indigo-400 font-black italic">$</span>
                        <span className="text-indigo-100 font-black text-xl">{amount}</span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initiation</label>
                    <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white font-bold text-xs focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-indigo-500/50 uppercase tracking-widest text-right mr-1">Termination</label>
                    <div className="p-4 text-right text-indigo-400 font-black font-mono text-xs bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
                      {endDate}
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-[1.5rem] flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold">
                    Automatic synchronization set for <span className="text-white font-black">{endDate}</span>. 
                    <br />
                    <span className="text-orange-500/80">Override capability active for custom strategic pricing.</span>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={subscribing || !selectedPlanId}
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 py-6 rounded-[1.5rem] font-black uppercase text-xs italic tracking-[0.2em] text-white shadow-2xl shadow-indigo-500/40 disabled:opacity-50 flex items-center justify-center gap-4 group transition-all"
                >
                  {subscribing ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      <CheckCircle2 size={24} className="group-hover:rotate-12 transition-transform" /> 
                      Apply Plan
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {historyLoading ? (
                <div className="py-24 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-indigo-500" size={48} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Retrieving Logs...</span>
                </div>
              ) : history.length > 0 ? (
                <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20">
                  <table className="w-full text-left">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Designation</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Protocol Life</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Investment</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5">
                            <p className="font-black text-white uppercase tracking-tighter italic text-sm">{sub.plan_name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{sub.duration_in_months || sub.duration} Month Span</p>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-slate-300 font-black font-mono text-[10px]">{new Date(sub.start_date * 1000).toLocaleDateString()}</span>
                                <div className="h-1 w-8 bg-indigo-500/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-1/2" />
                                </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                             <span className="text-indigo-400 font-black text-sm italic">${sub.amount}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-400/5">
                                Active Protocol
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-24 text-center">
                   <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <History size={40} className="text-slate-700" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Active Protocols</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-2 italic">Waiting for initial membership deployment</p>
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

