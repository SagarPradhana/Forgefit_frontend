import { Modal, GlowButton, ButtonLoader } from "../../ui/primitives";
import { Plus, Trash2 } from "lucide-react";
import type { WorkoutPlan } from "../../../services/adminPlansService";
import { useTranslation } from "react-i18next";

interface WorkoutPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editWorkoutId: string | null;
  workoutForm: WorkoutPlan;
  setWorkoutForm: (form: WorkoutPlan) => void;
  onSave: () => void;
  saving?: boolean;
}

export function WorkoutPlanModal({
  isOpen,
  onClose,
  editWorkoutId,
  workoutForm,
  setWorkoutForm,
  onSave,
  saving = false,
}: WorkoutPlanModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={editWorkoutId ? t("editWorkoutPlan") : t("createWorkoutPlan")}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={onClose}
            disabled={saving}
          >
            {t("cancel")}
          </button>
          <GlowButton onClick={onSave} disabled={saving} className="px-8">
            <ButtonLoader label={t("submit")} loadingLabel={t("loading")} loading={saving} />
          </GlowButton>
        </div>
      }
    >
      <div className="space-y-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t("planIdentity")}</label>
            <input
              className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
              value={workoutForm.name}
              onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
              placeholder={t("planIdentityPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t("planType")}</label>
            <input
              className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
              value={workoutForm.type}
              onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
              placeholder={t("planTypePlaceholder")}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t("primaryFocus")}</label>
            <input
              className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
              value={workoutForm.focus}
              onChange={(e) => setWorkoutForm({ ...workoutForm, focus: e.target.value })}
              placeholder={t("primaryFocusPlaceholder")}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t("planDescription")}</label>
            <textarea
              className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-medium resize-none h-24 shadow-inner"
              value={workoutForm.description}
              onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
              placeholder={t("planDescriptionPlaceholder")}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{t("trainingCycles")}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{t("trainingCyclesSub")}</p>
            </div>
            <button
              onClick={() => setWorkoutForm({
                ...workoutForm,
                workout_details: [...workoutForm.workout_details, { day: String(workoutForm.workout_details.length + 1), workouts: [] }]
              })}
              className="group flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest">{t("addCycle")}</span>
            </button>
          </div>

          <div className="space-y-4">
            {workoutForm.workout_details.map((dayDetail, dIndex) => (
              <div key={dIndex} className="bg-slate-900/40 rounded-2xl p-6 border border-white/5 space-y-6 relative group transition-all hover:border-white/10 hover:bg-slate-900/60">
                <button
                  onClick={() => {
                    const newDetails = [...workoutForm.workout_details];
                    newDetails.splice(dIndex, 1);
                    setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                  }}
                  className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 p-1.5 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="w-full md:w-1/2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t("dayIdentifier")}</label>
                  <select
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-indigo-500 outline-none text-base font-black mt-1 transition-colors"
                    value={dayDetail.day || ""}
                    onChange={(e) => {
                      const newDetails = [...workoutForm.workout_details];
                      newDetails[dIndex].day = e.target.value;
                      setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                    }}
                  >
                    <option value="" className="bg-slate-900 text-slate-500">{t("selectDay")}</option>
                    <option value="1" className="bg-slate-900 text-white">{t("monday")}</option>
                    <option value="2" className="bg-slate-900 text-white">{t("tuesday")}</option>
                    <option value="3" className="bg-slate-900 text-white">{t("wednesday")}</option>
                    <option value="4" className="bg-slate-900 text-white">{t("thursday")}</option>
                    <option value="5" className="bg-slate-900 text-white">{t("friday")}</option>
                    <option value="6" className="bg-slate-900 text-white">{t("saturday")}</option>
                    <option value="7" className="bg-slate-900 text-white">{t("sunday")}</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("exerciseBreakdown")}</label>
                    <button
                      onClick={() => {
                        const newDetails = [...workoutForm.workout_details];
                        newDetails[dIndex].workouts.push({ target_body_part: "", name: "", no_of_sets: 3, reps: "10" });
                        setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                      }}
                      className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md"
                    >
                      <span className="text-[10px] font-black uppercase">{t("addExercise")} +</span>
                    </button>
                  </div>
                  
                  <div className="grid gap-2">
                    {dayDetail.workouts.map((ex, eIndex) => (
                      <div key={eIndex} className="flex gap-2 items-center bg-slate-950/80 p-3 rounded-xl border border-white/5 group/row hover:border-indigo-500/20 transition-all">
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">{t("target")}</span>
                            <input
                              className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                              placeholder={t("bodyPart")}
                              value={ex.target_body_part}
                              onChange={(e) => {
                                const newDetails = [...workoutForm.workout_details];
                                newDetails[dIndex].workouts[eIndex].target_body_part = e.target.value;
                                setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">{t("exercise")}</span>
                            <input
                              className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                              placeholder={t("name")}
                              value={ex.name}
                              onChange={(e) => {
                                const newDetails = [...workoutForm.workout_details];
                                newDetails[dIndex].workouts[eIndex].name = e.target.value;
                                setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">{t("sets")}</span>
                            <input
                              type="number"
                              className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                              value={ex.no_of_sets}
                              onChange={(e) => {
                                const newDetails = [...workoutForm.workout_details];
                                newDetails[dIndex].workouts[eIndex].no_of_sets = Number(e.target.value);
                                setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">{t("reps")}</span>
                            <input
                              className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                              placeholder={t("repsPlaceholder")}
                              value={ex.reps}
                              onChange={(e) => {
                                const newDetails = [...workoutForm.workout_details];
                                newDetails[dIndex].workouts[eIndex].reps = e.target.value;
                                setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                              }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newDetails = [...workoutForm.workout_details];
                            newDetails[dIndex].workouts.splice(eIndex, 1);
                            setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                          }}
                          className="text-slate-700 hover:text-red-400 transition-colors mt-4 p-1.5"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
