import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, CheckCircle, Bell, Info, AlertTriangle, AlertCircle, Clock, CheckSquare } from "lucide-react";
import { useNotificationStore, type Notification } from "../../store/notificationStore";
import { createPortal } from "react-dom";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null;
}

export const NotificationModal = ({ isOpen, onClose, selectedId }: NotificationModalProps) => {
  const { notifications, markAsRead, removeNotification, clearAll } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<"All" | "Unread" | "Archive">("All");

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "Unread") return !n.read;
    if (activeTab === "Archive") return n.read;
    return true;
  });

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return (
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
          <CheckCircle size={20} className="text-emerald-400" />
        </div>
      );
      case "warning": return (
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]">
          <AlertTriangle size={20} className="text-amber-400" />
        </div>
      );
      case "error": return (
        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]">
          <AlertCircle size={20} className="text-red-400" />
        </div>
      );
      default: return (
        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]">
          <Info size={20} className="text-indigo-400" />
        </div>
      );
    }
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className="relative w-full max-w-xl bg-slate-900/40 border border-white/10 backdrop-blur-[40px] rounded-[32px] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

        {/* Header */}
        <div className="px-8 py-7 flex items-center justify-between border-b border-white/5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl text-indigo-400 border border-white/10 shadow-lg shadow-indigo-500/5">
                <Bell size={24} />
              </div>
              {notifications.some(n => !n.read) && (
                <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-0.5">Alert Center</h2>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Updates & System Logs</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="group flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                title="Clear All"
              >
                <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters/Tabs (Optional Visual only) */}
        <div className="px-8 py-3 bg-white/[0.02] border-b border-white/5 flex gap-4 overflow-x-auto no-scrollbar">
          {(["All", "Unread", "Archive"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition ${activeTab === tab ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="max-h-[55vh] overflow-y-auto px-6 py-4 custom-scrollbar relative z-10">
          <AnimatePresence initial={false} mode="wait">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 flex flex-col items-center justify-center text-center px-10"
              >
                <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6 border border-white/10 rotate-12">
                  <Bell size={40} className="text-slate-700 -rotate-12" />
                </div>
                <h3 className="text-white font-black uppercase tracking-wider mb-2">Universe is Quiet</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  You're all caught up! No new notifications at the moment. Check back later for gym updates.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notif, idx) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: idx * 0.05 }}
                    className={`group relative p-5 rounded-[24px] border transition-all duration-500 ${notif.read
                        ? "bg-white/[0.03] border-white/5 opacity-70 hover:opacity-100"
                        : "bg-gradient-to-br from-white/[0.08] to-transparent border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] hover:from-white/[0.12]"
                      } ${selectedId === notif.id ? "ring-2 ring-indigo-500/50 ring-offset-[4px] ring-offset-slate-900" : ""}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex gap-5">
                      <div className="shrink-0 transition-transform group-hover:scale-110 duration-500">
                        {getIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-[14px] font-black tracking-tight transition-colors ${notif.read ? "text-slate-300" : "text-white"}`}>
                              {notif.title}
                            </h3>
                            {!notif.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 text-slate-500">
                            <Clock size={10} className="shrink-0" />
                            <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                              {formatTimestamp(notif.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className={`text-[12px] leading-[1.6] mb-4 font-medium transition-colors ${notif.read ? "text-slate-500" : "text-slate-400 group-hover:text-slate-300"}`}>
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 bg-white/5 px-2 py-0.5 rounded">
                              System ID: {notif.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                            {!notif.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notif.id);
                                }}
                                className="h-8 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-white hover:bg-indigo-500 rounded-lg transition-all"
                              >
                                <CheckSquare size={12} />
                                Read
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notif.id);
                              }}
                              className="h-8 w-8 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Left accent line for unread */}
                    {!notif.read && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar Info */}
        <div className="px-8 py-5 bg-white/[0.03] border-t border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <div className={`h-full w-full bg-indigo-500/20`} />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">
              {notifications.length} Total Messages
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">
                {notifications.filter(n => !n.read).length} Unread
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
