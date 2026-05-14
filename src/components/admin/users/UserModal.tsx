import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Loader2, Eye, EyeOff } from "lucide-react";
import type { UserFormData, ModalStep, UserRole } from "./types";
import { handlePhoneKeyDown, handlePhonePaste, sanitizePhone } from "../../../utils/formUtils";
import { useTranslation } from "react-i18next";

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
  portalType?: "admin" | "trainer";
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
  trainers,
  isAnyLoading,
  showPassword,
  setShowPassword,
  getModalTitle,
  getStepNumber,
  isFinalStep,
  portalType = "admin",
}: UserModalProps) => {
  const { t } = useTranslation();
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
        className="relative z-[9999] w-full max-w-2xl mx-4 bg-gradient-to-br from-slate-900 to-indigo-950/90 border border-white/10 rounded-2xl shadow-[0_0_50px_-10px_rgba(99,102,241,0.2)] flex flex-col max-h-fit backdrop-blur-xl mb-10"
      >
        <div className="relative border-b border-white/15 bg-white/5 flex-shrink-0 rounded-t-2xl overflow-hidden">
          <div className="py-2 bg-gradient-to-r from-indigo-600 to-orange-400 flex justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              {t("step")} {getStepNumber()}
            </span>
          </div>

          <div className="flex items-center justify-between p-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {getModalTitle()}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                {t("registrationWizard")}
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
              {/* <div>
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
              </div> */}

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
                    onChange={(e) => setFormData({ ...formData, mobile: sanitizePhone(e.target.value) })}
                    onKeyDown={handlePhoneKeyDown}
                    onPaste={handlePhonePaste}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    id="user_registration_email_field"
                    name="user_registration_email_field"
                    type="email"
                    autoComplete="new-password"
                    placeholder="Email address (optional)"
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
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.joining_date ? new Date(formData.joining_date * 1000).toISOString().split('T')[0] : ""}
                  onChange={(e) => {
                    const date = e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : 0;
                    setFormData({ ...formData, joining_date: date });
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 transition"
                />
              </div>
            </motion.div>
          )}

          {modalStep === "metadata" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >

              {formData.role === "trainer" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Specialization <span className="text-orange-400">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g., Strength Training, Yoga, HIIT"
                        value={formData.metadata.specialization || ""}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, specialization: e.target.value } })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Experience (Years) <span className="text-orange-400">*</span></label>
                      <input
                        type="number"
                        placeholder="Years of experience"
                        value={formData.metadata.experience || ""}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, experience: Number(e.target.value) } })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Certifications</label>
                    <input
                      type="text"
                      placeholder="Any certifications or credentials"
                      value={formData.metadata.certifications || ""}
                      onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, certifications: e.target.value } })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </>
              ) : (
                <>
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
                        max={new Date().toISOString().split('T')[0]}
                        value={formData.metadata.dob ? new Date(formData.metadata.dob * 1000).toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                          const date = e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : 0;
                          setFormData({ ...formData, metadata: { ...formData.metadata, dob: date } });
                        }}
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
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, emergency_contact: sanitizePhone(e.target.value) } })}
                        onKeyDown={handlePhoneKeyDown}
                        onPaste={handlePhonePaste}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">{t("fitnessGoal")}</label>
                      <select
                        value={formData.metadata.fitness_goal}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, fitness_goal: e.target.value } })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
                      >
                        <option value="fat_loss" className="bg-slate-900">{t("fatLoss")}</option>
                        <option value="muscle_gain" className="bg-slate-900">{t("muscleGain")}</option>
                        <option value="fitness" className="bg-slate-900">{t("generalFitness")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">{t("workoutTime")}</label>
                      <select
                        value={formData.metadata.workout_time}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, workout_time: e.target.value } })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
                      >
                        <option value="morning" className="bg-slate-900">{t("morning")}</option>
                        <option value="evening" className="bg-slate-900">{t("evening")}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("medicalConditions")}</label>
                    <textarea
                      placeholder={t("medicalConditionsPlaceholder")}
                      value={formData.metadata.medical_conditions || ""}
                      onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, medical_conditions: e.target.value } })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs resize-none focus:border-indigo-500 transition"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("language")}</label>
                      <select
                        value={formData.metadata.language}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, language: e.target.value } })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                      >
                        <option value="en" className="bg-slate-900">{t("english")}</option>
                        <option value="hi" className="bg-slate-900">{t("hindi")}</option>
                        <option value="mr" className="bg-slate-900">{t("marathi")}</option>
                        <option value="or" className="bg-slate-900">{t("odia")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("themePreference")}</label>
                      <select
                        value={formData.metadata.theme}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, theme: e.target.value } })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                      >
                        <option value="dark" className="bg-slate-900">{t("darkMode")}</option>
                        <option value="light" className="bg-slate-900">{t("lightMode")}</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {modalStep === "membership" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {formData.role === "admin" || formData.role === "trainer" ? (
                <div className="py-4 text-center text-slate-400 text-sm italic font-medium">
                  {formData.role === "admin" ? t("adminRoleNoTrainer") || "Admin role - no trainer required" : t("trainerRoleNoTrainer") || "Trainer role - no trainer assignment needed"}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">{t("assignTrainer")}</label>
                  <select
                    value={formData.trainer_id || ""}
                    onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 transition"
                  >
                    <option value="" className="bg-slate-900">{t("selectTrainerOptional")}</option>
                    {trainers.map((t: any) => (
                      <option key={t.id} value={t.id} className="bg-slate-900">{t.name}</option>
                    ))}
                  </select>
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
            {t("cancel")}
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
                {t("back")}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isAnyLoading}
              onClick={isFinalStep ? onSave : onNext}
              className="flex-1 sm:flex-none px-10 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
            >
              {isFinalStep ? t("submit") : t("next")}
              {!isFinalStep && <ChevronRight size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
