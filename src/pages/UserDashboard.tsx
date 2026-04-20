import { useState } from "react";
import {
  GlassCard,
  Modal,
  SectionTitle,
  StatusBadge,
  CommonButton,
  LoadingSpinner,
} from "../components/ui/primitives";
import { userProfile } from "../data/mockData";
import { Dumbbell, CreditCard, Activity, Flame } from "lucide-react";

function UserDashboard() {
  // 🔁 State
  const [open, setOpen] = useState(userProfile.daysLeft <= 5);
  const [workoutDone, setWorkoutDone] = useState(false);

  // 📊 Progress calculation
  const progress = Math.min(
    100,
    Math.max(0, (userProfile.daysLeft / 30) * 100),
  );

  // 🏋️ Mock workout data
  const todayWorkout = {
    title: "Chest & Triceps",
    exercises: ["Bench Press", "Push Ups", "Cable Fly"],
  };

  // 🔥 Streak (mock)
  const streak = 5;

  return (
    <div className="space-y-6">
      {/* 🔥 HEADER */}
      <SectionTitle
        title="Welcome Back 👋"
        subtitle="Here’s your fitness overview"
      />

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* HERO */}
          <GlassCard className="p-6 bg-gradient-to-r from-indigo-500/10 to-orange-400/10 border-indigo-400/20">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-sm text-slate-400">Current Plan</p>
                <h2 className="text-2xl font-bold mt-1">
                  {userProfile.currentPlan}
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  {userProfile.daysLeft} days remaining
                </p>
              </div>

              <CommonButton>Upgrade Plan</CommonButton>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-orange-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </GlassCard>

          {/* 🏋️ DAILY WORKOUT */}
          <GlassCard className="p-5 hover:scale-[1.01] transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Today's Workout</p>
                <h3 className="font-semibold text-lg">{todayWorkout.title}</h3>
              </div>
              <Dumbbell className="text-indigo-400" />
            </div>

            <ul className="mt-3 text-sm text-slate-300 space-y-1">
              {todayWorkout.exercises.map((ex, i) => (
                <li key={i}>• {ex}</li>
              ))}
            </ul>

            <CommonButton
              className={`mt-4 w-full ${workoutDone ? "bg-green-500" : ""}`}
              onClick={() => setWorkoutDone(true)}
            >
              {workoutDone ? "Completed ✅" : "Mark as Done"}
            </CommonButton>
          </GlassCard>

          {/* 📊 STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <GlassCard className="p-4">
              <div className="flex justify-between">
                <p className="text-xs text-slate-400">Attendance</p>
                <Activity size={16} className="text-green-400" />
              </div>
              <p className="text-lg font-semibold mt-1">
                {userProfile.attendance}
              </p>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex justify-between">
                <p className="text-xs text-slate-400">Calories</p>
                <Flame size={16} className="text-orange-400" />
              </div>
              <p className="text-lg font-semibold mt-1">320 kcal</p>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex justify-between">
                <p className="text-xs text-slate-400">Payment</p>
                <CreditCard size={16} className="text-cyan-400" />
              </div>
              <StatusBadge
                status={
                  userProfile.paymentStatus as
                    | "Pending"
                    | "Active"
                    | "Expired"
                    | "Paid"
                }
              />
            </GlassCard>
          </div>

          {/* 🏆 STREAK */}
          <GlassCard className="p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">Workout Streak</p>
              <p className="text-lg font-semibold">{streak} Days 🔥</p>
            </div>
            <Flame className="text-orange-400" />
          </GlassCard>

          {/* 📈 CHART */}
          <GlassCard className="p-6 h-48 flex items-center justify-center text-slate-500">
            Activity Chart (Integrate Recharts here)
          </GlassCard>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* ALERT */}
          <GlassCard className="p-5 border-orange-300/30 bg-orange-500/10">
            <p className="text-orange-300 font-semibold text-sm">
              Plan expires soon
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Renew to continue your workouts
            </p>
            <CommonButton className="mt-3 w-full">Renew</CommonButton>
          </GlassCard>

          {/* 🧠 TRAINER TIP */}
          <GlassCard className="p-5 bg-indigo-500/10 border-indigo-300/20">
            <p className="text-indigo-300 font-semibold text-sm">
              Trainer Tip 💡
            </p>
            <p className="text-xs text-slate-300 mt-2">
              Focus on controlled reps today and stay hydrated for better
              recovery.
            </p>
          </GlassCard>

          {/* PROFILE */}
          <GlassCard className="p-5 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-white/10 mb-3" />
            <p className="font-semibold">Your Profile</p>
            <p className="text-xs text-slate-400">Active Member</p>
          </GlassCard>

          {/* RECENT ACTIVITY */}
          <GlassCard className="p-5">
            <p className="text-sm text-slate-400 mb-3">Recent Activity</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✔ Workout completed</li>
              <li>✔ Cardio session</li>
              <li>✔ Plan updated</li>
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* 🚨 MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Plan Expiry Alert"
      >
        Your subscription is about to expire. Renew now to continue access.
      </Modal>
    </div>
  );
}

export default UserDashboard;
