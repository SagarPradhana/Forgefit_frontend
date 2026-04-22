import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Loader2, Eye, EyeOff } from "lucide-react";
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
  roles: string[];
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

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
        <div className="relative border-b border-white/15 bg-slate-900 flex-shrink-0 rounded-t-2xl overflow-hidden">
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

        <div className="p-6 overflow-y-auto flex-1">
          {modalStep === "role" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Username <span className="text-orange-400">*</span></label>
                <input
                  id="user_registration_username_field"
                  name="user_registration_username_field"
                  type="text"
                  autoComplete="new-password"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Full Name <span className="text-orange-400">*</span></label>
                <input
                  id="user_registration_full_name_field"
                  name="user_registration_full_name_field"
                  type="text"
                  autoComplete="new-password"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Mobile <span className="text-orange-400">*</span></label>
                  <input
                    name="user_account_mobile"
                    type="tel"
                    placeholder="Mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email <span className="text-orange-400">*</span></label>
                  <input
                    id="user_registration_email_field"
                    name="user_registration_email_field"
                    type="email"
                    autoComplete="new-password"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>
              </div>

              {!editingUserId && (
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Password <span className="text-orange-400">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Security password"
                      value={formData.password || ""}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
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
              )}
            </motion.div>
          )}

          {modalStep === "details" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Role <span className="text-orange-400">*</span></label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 transition capitalize"
                >
                  {roles.map((role) => (
                    <option key={role} value={role} className="bg-slate-900 capitalize">
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Address <span className="text-orange-400">*</span></label>
                <textarea
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Joining Date <span className="text-orange-400">*</span></label>
                <input
                  type="date"
                  value={new Date(formData.joining_date * 1000).toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, joining_date: Math.floor(new Date(e.target.value).getTime() / 1000) })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 transition"
                />
              </div>
            </motion.div>
          )}

          {modalStep === "metadata" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Height</label>
                  <input
                    type="number"
                    value={formData.metadata.height}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, height: Number(e.target.value) } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Weight</label>
                  <input
                    type="number"
                    value={formData.metadata.weight}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, weight: Number(e.target.value) } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">DOB</label>
                  <input
                    type="date"
                    value={new Date(formData.metadata.dob * 1000).toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, dob: Math.floor(new Date(e.target.value).getTime() / 1000) } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Gender</label>
                  <select
                    value={formData.metadata.gender}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, gender: e.target.value } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
                  >
                    <option value="male" className="bg-slate-900">Male</option>
                    <option value="female" className="bg-slate-900">Female</option>
                    <option value="other" className="bg-slate-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.metadata.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, emergency_contact: e.target.value } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Fitness Goal</label>
                  <select
                    value={formData.metadata.fitness_goal}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, fitness_goal: e.target.value } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
                  >
                    <option value="fat_loss" className="bg-slate-900">Fat Loss</option>
                    <option value="muscle_gain" className="bg-slate-900">Muscle Gain</option>
                    <option value="fitness" className="bg-slate-900">General Fitness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Workout Time</label>
                  <select
                    value={formData.metadata.workout_time}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, workout_time: e.target.value } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
                  >
                    <option value="morning" className="bg-slate-900">Morning</option>
                    <option value="evening" className="bg-slate-900">Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">Medical Conditions / Injuries / Allergies</label>
                <textarea
                  placeholder="Notes..."
                  value={`${formData.metadata.medical_conditions}\n${formData.metadata.injuries}\n${formData.metadata.allergies}`.trim()}
                  onChange={(e) => {
                    setFormData({
                      ...formData, metadata: {
                        ...formData.metadata,
                        medical_conditions: e?.target?.value || "",
                        injuries: e?.target?.value || "",
                        allergies: e?.target?.value || ""
                      }
                    });
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs resize-none"
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {modalStep === "membership" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Assign Trainer</label>
                <select
                  value={formData.trainer_id || ""}
                  onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 transition"
                >
                  <option value="" className="bg-slate-900">Select Trainer (Optional)</option>
                  {trainers.map((t: any) => (
                    <option key={t.id} value={t.id} className="bg-slate-900">{t.name}</option>
                  ))}
                </select>
              </div>

              {!editingUserId && (
                <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Initial Membership Selection</p>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Plan</label>
                    <select
                      value={formData.subscription_id || ""}
                      onChange={(e) => {
                        const plan = plans.find(p => p.id === e.target.value);
                        setFormData({
                          ...formData,
                          subscription_id: e.target.value,
                          duration_in_months: plan?.duration || 1,
                          amount: plan?.price || 0
                        });
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                    >
                      <option value="">No Plan (Free Trial)</option>
                      {plans.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                      ))}
                    </select>
                  </div>

                  {formData.subscription_id && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-1">Duration</label>
                        <p className="text-white font-bold">{formData.duration_in_months} Months</p>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-1">Amount</label>
                        <p className="text-indigo-400 font-bold">₹{formData.amount}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 border-t border-white/15 bg-white/5 flex-shrink-0 rounded-b-2xl">
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
                  {isFinalStep ? (editingUserId ? "Update User" : "Finish & Create") : "Next"}
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
