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
  const [duration, setDuration] = useState<number>(12);

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

  useEffect(() => {
    if (isOpen) {
      setActiveTab("add");
      setSelectedPlanId("");
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
      setDuration(plan.duration);
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
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CreditCard size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Subscription Management</h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{selectedUser.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-white/5 border-b border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${activeTab === "add" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}
          >
            <Plus size={16} /> New / Renew
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${activeTab === "history" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}
          >
            <History size={16} /> Previous Subscriptions
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {activeTab === "add" ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Side */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Select Membership Plan</label>
                  {plansLoading ? (
                    <div className="h-40 flex items-center justify-center border border-white/10 rounded-2xl bg-white/5">
                      <Loader2 className="animate-spin text-indigo-400" size={32} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {plans.map((plan: any) => (
                        <button
                          key={plan.id}
                          onClick={() => handlePlanSelect(plan.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedPlanId === plan.id ? "bg-indigo-500/20 border-indigo-500" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                        >
                          <div className="text-left">
                            <p className="font-black text-white uppercase tracking-tight">{plan.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{plan.duration} Months Validity</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-indigo-400 uppercase">₹{plan.price}</p>
                            {selectedPlanId === plan.id && <CheckCircle2 size={16} className="text-indigo-400 mt-1 ml-auto" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details Side */}
              <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Joining Date</label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Duration (Months)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Subscription Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white text-lg font-black focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={subscribing || !selectedPlanId}
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {subscribing ? <Loader2 className="animate-spin" size={20} /> : <><RefreshCw size={20} /> Update Subscription</>}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {historyLoading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-indigo-500" size={40} />
                </div>
              ) : history.length > 0 ? (
                <div className="overflow-hidden rounded-3xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Name</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Date</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.map((sub: any, idx: number) => (
                        <tr key={idx} className="bg-slate-900/20">
                          <td className="px-6 py-4 font-bold text-white tracking-tight">{sub.plan_name}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono tracking-tighter">
                            {new Date(sub.start_date * 1000).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-slate-400">{sub.duration} Mo</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Completed</span>
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
                  <h4 className="text-white font-bold">No history available</h4>
                  <p className="text-slate-500 text-sm">This user hasn't had any previous subscriptions.</p>
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
