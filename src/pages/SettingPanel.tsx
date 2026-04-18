import { GlassCard, CommonButton } from "../components/ui/primitives";
import { useState } from "react";
import { Bell, Lock } from "lucide-react";

export function SettingsPanel() {
  const [password, setPassword] = useState("");
  const [reminders, setReminders] = useState(true);

  return (
    <div className="space-y-6">
      {/* 🔐 PASSWORD */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Lock size={16} /> Security
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full rounded-xl bg-white/10 border border-white/10 p-3 text-sm outline-none focus:border-indigo-400"
        />

        <CommonButton>Update Password</CommonButton>
      </GlassCard>

      {/* 🔔 NOTIFICATIONS */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Bell size={16} /> Notifications
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-300">Enable workout reminders</p>

          {/* TOGGLE */}
          <button
            onClick={() => setReminders(!reminders)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              reminders ? "bg-indigo-500" : "bg-white/10"
            }`}
          >
            <div
              className={`h-4 w-4 bg-white rounded-full transition ${
                reminders ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </GlassCard>

      {/* 💾 SAVE */}
      <div className="flex justify-end">
        <CommonButton variant="secondary">Save Changes</CommonButton>
      </div>
    </div>
  );
}
