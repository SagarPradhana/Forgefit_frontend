import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, FileText, ChevronLeft, ChevronRight, Loader2, Eye, EyeOff } from "lucide-react";
import type { UserFormData, ModalStep, UserRole } from "./types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  modalStep: ModalStep;
  setModalStep: (step: ModalStep) => void;
  editingUserId: string | null;
  onSave: () => void;
  onNext: () => void;
  onBack: () => void;
  roles: any[];
  plans: any[];
  trainers: any[];
  isAnyLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  getModalTitle: () => string;
  getStepNumber: () => string;
  isFinalStep: boolean;
}

export const UserModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  modalStep,
  setModalStep,
  editingUserId,
  onSave,
  onNext,
  onBack,
  roles,
  plans,
  trainers,
  isAnyLoading,
  showPassword,
  setShowPassword,
  getModalTitle,
  getStepNumber,
  isFinalStep,
}: UserModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-start justify-center pt-10 md:pt-20 pb-10 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{
          scale: isOpen ? 1 : 0.9,
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : 30,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-[9999] w-full max-w-2xl mx-4 bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-fit backdrop-blur-xl mb-10"
      >
        {/* Header */}
        <div className="relative border-b border-white/15 bg-slate-900 flex-shrink-0 rounded-t-2xl overflow-hidden">
          {/* Centered Step Indicator */}
          <div className="py-2 bg-gradient-to-r from-indigo-600 to-orange-400 flex justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              Step {getStepNumber()}
            </span>
          </div>

          <div className="flex items-center justify-between p-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {getModalTitle()}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Registration Wizard
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition text-slate-300 hover:text-white border border-white/10"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Role Selection */}
          {modalStep === "role" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Name <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Phone Number <span className="text-orange-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Password {editingUserId && <span className="text-[10px] text-slate-400 font-normal ml-2">(Leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={editingUserId ? "••••••••" : "Enter password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Role <span className="text-orange-400">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                  disabled={editingUserId !== null}
                  className={`w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition ${editingUserId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {roles.map((r: any) => {
                    const roleName = typeof r === 'string' ? r : r.role;
                    const roleKey = typeof r === 'string' ? r : (r.id || r.role_id);
                    return (
                      <option key={roleKey} value={roleName} className="bg-slate-900 text-white capitalize">
                        {roleName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Details */}
          {modalStep === "details" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Address <span className="text-orange-400">*</span>
                </label>
                <textarea
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                  rows={3}
                />
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Documents Policy</p>
                    <p className="text-xs text-slate-400 font-medium">Profile photo and ID proofs are now managed via the "Document Vault" icon on the user card.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Personal Info */}
          {modalStep === "personalInfo" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.personalInfo?.age || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo!,
                          age: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.personalInfo?.gender || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo!,
                          gender: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  >
                    <option value="" className="bg-slate-900 text-white">
                      Select Gender
                    </option>
                    <option value="Male" className="bg-slate-900 text-white">
                      Male
                    </option>
                    <option
                      value="Female"
                      className="bg-slate-900 text-white"
                    >
                      Female
                    </option>
                    <option value="Other" className="bg-slate-900 text-white">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="Height"
                    value={formData.personalInfo?.height || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo!,
                          height: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Weight"
                    value={formData.personalInfo?.weight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo!,
                          weight: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.personalInfo?.dob || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo!,
                        dob: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Fitness Goal
                </label>
                <select
                  value={formData.personalInfo?.fitnessGoal || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo!,
                        fitnessGoal: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                >
                  <option
                    value="Fat Loss"
                    className="bg-slate-900 text-white"
                  >
                    Fat Loss
                  </option>
                  <option
                    value="Muscle Gain"
                    className="bg-slate-900 text-white"
                  >
                    Muscle Gain
                  </option>
                  <option
                    value="General Fitness"
                    className="bg-slate-900 text-white"
                  >
                    General Fitness
                  </option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 4: Health Info */}
          {modalStep === "healthInfo" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Medical Conditions (Optional)
                </label>
                <textarea
                  placeholder="e.g., Diabetes, Hypertension"
                  value={formData.healthInfo?.medicalConditions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      healthInfo: {
                        ...formData.healthInfo!,
                        medicalConditions: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Injuries (Optional)
                </label>
                <textarea
                  placeholder="e.g., Knee pain, Back injury"
                  value={formData.healthInfo?.injuries || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      healthInfo: {
                        ...formData.healthInfo!,
                        injuries: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Allergies (Optional)
                </label>
                <textarea
                  placeholder="e.g., Peanuts, Latex"
                  value={formData.healthInfo?.allergies || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      healthInfo: {
                        ...formData.healthInfo!,
                        allergies: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* Step 5: Membership Details */}
          {modalStep === "membershipDetails" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Plan Selection
                </label>
                <select
                  value={formData.membershipDetails?.planId || ""}
                  onChange={(e) => {
                    const selectedPlan = plans.find((p: any) => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      membershipDetails: {
                        ...formData.membershipDetails!,
                        planId: e.target.value,
                        planType: selectedPlan?.name || "",
                        amount: selectedPlan?.price || (formData.membershipDetails?.amount || 0),
                        durationInMonths: selectedPlan?.duration || (formData.membershipDetails?.durationInMonths || 12)
                      },
                    })
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                >
                  <option value="" className="bg-slate-900 text-white">
                    Select Plan
                  </option>
                  {plans.map((p: any) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} - ₹{p.price} ({p.duration} Mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    value={formData.membershipDetails?.durationInMonths || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        membershipDetails: {
                          ...formData.membershipDetails!,
                          durationInMonths: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.membershipDetails?.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        membershipDetails: {
                          ...formData.membershipDetails!,
                          amount: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.membershipDetails?.joiningDate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      membershipDetails: {
                        ...formData.membershipDetails!,
                        joiningDate: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Trainer Assigned
                </label>
                <select
                  value={formData.membershipDetails?.trainerId || ""}
                  onChange={(e) => {
                    const selectedTrainer = trainers.find((t: any) => t.id === e.target.value);
                    setFormData({
                      ...formData,
                      membershipDetails: {
                        ...formData.membershipDetails!,
                        trainerId: e.target.value,
                        trainerAssigned: selectedTrainer?.name || "",
                      },
                    })
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                >
                  <option value="" className="bg-slate-900 text-white">
                    Select Trainer
                  </option>
                  {trainers.map((t: any) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 6: Preferences */}
          {modalStep === "preferences" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Workout Time
                </label>
                <select
                  value={formData.preferences?.workoutTime || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences!,
                        workoutTime: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                >
                  <option value="Morning" className="bg-slate-900 text-white">
                    Morning
                  </option>
                  <option value="Evening" className="bg-slate-900 text-white">
                    Evening
                  </option>
                  <option value="Both" className="bg-slate-900 text-white">
                    Both
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Notification Preference
                </label>
                <select
                  value={formData.preferences?.notificationPreference || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences!,
                        notificationPreference: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                >
                  <option value="Email" className="bg-slate-900 text-white">
                    Email
                  </option>
                  <option value="SMS" className="bg-slate-900 text-white">
                    SMS
                  </option>
                  <option value="Push" className="bg-slate-900 text-white">
                    Push Notification
                  </option>
                  <option value="None" className="bg-slate-900 text-white">
                    None
                  </option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 border-t border-white/15 bg-white/5 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
          >
            Cancel
          </motion.button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {modalStep !== "role" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Back
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isAnyLoading}
              onClick={isFinalStep ? onSave : onNext}
              className="flex-1 sm:flex-none px-10 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
            >
              {isAnyLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isFinalStep ? (editingUserId ? "Update User" : "Submit") : "Next"}
                  {!isFinalStep && <ChevronRight size={20} />}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
