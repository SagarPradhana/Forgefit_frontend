import {
  GlassCard,
  CommonButton,
  StatusBadge,
} from "../components/ui/primitives";
import { User, Mail, Dumbbell, Target } from "lucide-react";

export function ProfileCard({ user }: any) {
  return (
    <GlassCard className="p-6 space-y-6">
      {/* 🔥 TOP SECTION */}
      <div className="flex items-center gap-4">
        {/* AVATAR */}
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-orange-400 flex items-center justify-center text-white font-bold text-xl">
          {user.name?.[0]}
        </div>

        {/* INFO */}
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      {/* 📊 DETAILS */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <User size={16} /> Trainer: {user.trainer}
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Target size={16} /> Goal: {user.fitnessGoal}
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Dumbbell size={16} /> Plan: {user.currentPlan}
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Mail size={16} /> Contact: {user.email}
        </div>
      </div>

      {/* 📌 STATUS */}
      <div className="flex items-center justify-between">
        <StatusBadge status={user.paymentStatus as any} />

        <CommonButton variant="secondary">Edit Profile</CommonButton>
      </div>
    </GlassCard>
  );
}
