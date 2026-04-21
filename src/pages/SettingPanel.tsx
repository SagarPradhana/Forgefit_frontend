import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { 
  Bell, 
  Lock, 
  User, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Zap, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  GlassCard, 
  CommonButton, 
  SectionTitle,
  InputField 
} from "../components/ui/primitives";
import { toast } from "../store/toastStore";

type TabType = "general" | "security" | "notifications";

export function SettingsPanel() {
  const [searchParams] = useSearchParams();
  const isPasswordOnly = searchParams.get("view") === "password";
  const [activeTab, setActiveTab] = useState<TabType>(isPasswordOnly ? "security" : "general");
  
  useEffect(() => {
    if (isPasswordOnly) {
      setActiveTab("security");
    }
  }, [isPasswordOnly]);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [prefs, setPrefs] = useState({
    workoutReminders: true,
    paymentAlerts: true,
    newsletters: false,
    publicProfile: true,
    twoFactor: false
  });

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Settings synchronized successfully");
  };

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Alerts", icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* --- TAB NAVIGATION --- */}
      {!isPasswordOnly && (
        <div className="flex p-1.5 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl w-full sm:w-fit mx-auto sm:mx-0 overflow-x-auto no-scrollbar">
          <div className="flex min-w-max sm:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={14} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {activeTab === "general" && (
            <div className="space-y-6">
              <GlassCard className="p-8 shadow-2xl">
                <SectionTitle 
                  title="Profile Preferences" 
                  subtitle="Manage your public presence and account visibility"
                  className="mb-8"
                />
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Privacy</label>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-emerald-400" />
                          <span className="text-sm font-bold text-white">Public Profile</span>
                        </div>
                        <ToggleButton active={prefs.publicProfile} onClick={() => handleToggle("publicProfile")} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center items-center text-center">
                    <Zap className="text-indigo-400 mb-3" size={32} />
                    <h4 className="text-sm font-black text-white uppercase mb-1">Quick Sync</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      All your fitness data automatically synchronizes with the mobile app every 15 minutes.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <GlassCard className="p-8">
                <SectionTitle 
                  title={isPasswordOnly ? "Change Password" : "Security Vault"} 
                  subtitle={isPasswordOnly ? "Update your account credentials" : "Fortify your account with advanced authentication"}
                  className="mb-8"
                />

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                      <InputField 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwords.current}
                        onChange={(val: any) => setPasswords({...passwords, current: val})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                      <InputField 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwords.new}
                        onChange={(val: any) => setPasswords({...passwords, new: val})}
                      />
                    </div>
                    <div className="flex justify-start pt-2">
                      <CommonButton className="px-8 bg-indigo-500 text-xs font-black uppercase tracking-widest rounded-xl">
                        Update Vault
                      </CommonButton>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="text-orange-400" size={18} />
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Two-Factor Auth</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 tracking-tight">Add an extra layer of protection using your mobile device.</p>
                      <button 
                        onClick={() => handleToggle("twoFactor")}
                        className={`w-full py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          prefs.twoFactor 
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                            : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {prefs.twoFactor ? "Enabled" : "Enable 2FA"}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <GlassCard className="p-8">
                <SectionTitle 
                  title="Alert Matrix" 
                  subtitle="Configure how the gym system reaches out to you"
                  className="mb-8"
                />

                <div className="space-y-4">
                  <NotificationRow 
                    icon={Zap} 
                    title="Workout Reminders" 
                    desc="Receive push notifications 30 mins before your scheduled session."
                    active={prefs.workoutReminders}
                    onToggle={() => handleToggle("workoutReminders")}
                    color="text-indigo-400"
                  />
                  <NotificationRow 
                    icon={Mail} 
                    title="Payment Invoices" 
                    desc="Digital receipts and monthly billing alerts sent to your email."
                    active={prefs.paymentAlerts}
                    onToggle={() => handleToggle("paymentAlerts")}
                    color="text-emerald-400"
                  />
                  <NotificationRow 
                    icon={Smartphone} 
                    title="Gym Newsletters" 
                    desc="Be the first to hear about new equipment, events and offers."
                    active={prefs.newsletters}
                    onToggle={() => handleToggle("newsletters")}
                    color="text-amber-400"
                  />
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* --- FOOTER ACTIONS --- */}
      {!isPasswordOnly && (
        <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-2 text-slate-500">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Auto-saved to local storage</span>
          </div>
          <CommonButton
            variant="secondary"
            onClick={handleSave}
            className="px-10 h-12 text-xs font-black uppercase tracking-widest shadow-orange-500/20"
          >
            Confirm Synchronization
          </CommonButton>
        </div>
      )}
    </div>
  );
}

// --- SMALL SUB-COMPONENTS ---

function ToggleButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-500 ${
        active ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-700 shadow-inner"
      }`}
    >
      <motion.div
        animate={{ x: active ? 20 : 0 }}
        className="h-4 w-4 bg-white rounded-full shadow-md"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function NotificationRow({ icon: Icon, title, desc, active, onToggle, color }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </div>
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-tight mb-0.5">{title}</h4>
          <p className="text-[10px] font-medium text-slate-400 max-w-[250px] leading-relaxed">{desc}</p>
        </div>
      </div>
      <ToggleButton active={active} onClick={onToggle} />
    </div>
  );
}

