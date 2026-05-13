import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  EmptyState,
  GlassCard,
  GlowButton,
  SectionTitle,
  Skeleton,
  Table,
  Pagination,
  LoadingOverlay,
} from "../ui/primitives";
import { Edit2, Search, Trash2, Plus } from "lucide-react";
import { toast } from "../../store/toastStore";
import { api } from "../../utils/httputils";
import { API_ENDPOINTS } from "../../utils/url";
import { useTranslation } from "react-i18next";
import { adminPlansService, type WorkoutPlan, type DietPlan } from "../../services/adminPlansService";
import { DeleteConfirmationModal } from "../common/DeleteConfirmationModal";
import { WorkoutPlanModal } from "./subscriptions/WorkoutPlanModal";
import { DietPlanModal } from "./subscriptions/DietPlanModal";
import { AssignPlanModal } from "./subscriptions/AssignPlanModal";

export function PlansManagement() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Params initialization
  const initialTab = (searchParams.get("tab") as "workout" | "diet") || "workout";
  const initialSearch = searchParams.get("search") || "";

  const [activeTab, setActiveTab] = useState<"workout" | "diet">(initialTab);

  // === WORKOUT PLANS STATES ===
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [workoutMeta, setWorkoutMeta] = useState({ page_no: 1, total_count: 0, page_size: 10, has_next: false, has_previous: false });
  const [workoutSearch, setWorkoutSearch] = useState(initialTab === "workout" ? initialSearch : "");
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [editWorkoutId, setEditWorkoutId] = useState<string | null>(null);
  const [workoutForm, setWorkoutForm] = useState<WorkoutPlan>({
    name: "", type: "", description: "", focus: "", workout_details: []
  });

  // === DIET PLANS STATES ===
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [dietMeta, setDietMeta] = useState({ page_no: 1, total_count: 0, page_size: 10, has_next: false, has_previous: false });
  const [dietSearch, setDietSearch] = useState(initialTab === "diet" ? initialSearch : "");
  const [dietsLoading, setDietsLoading] = useState(false);
  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [editDietId, setEditDietId] = useState<string | null>(null);
  const [dietForm, setDietForm] = useState<DietPlan>({
    name: "", focus: "", diet_details: []
  });

  // === ASSIGN MODAL STATES ===
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignType, setAssignType] = useState<"workout" | "diet" | null>(null);
  const [assignPlanId, setAssignPlanId] = useState<string>("");
  const [assignUserId, setAssignUserId] = useState<string>("");
  const [userSearch, setUserSearch] = useState("");
  const [usersDropdown, setUsersDropdown] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [workoutSaving, setWorkoutSaving] = useState(false);
  const [dietSaving, setDietSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // === DELETE MODAL STATES ===
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "workout" | "diet", id: string } | null>(null);

  // === FETCH FUNCTIONS ===
  const fetchWorkouts = async (p = workoutMeta.page_no || 1) => {
    setWorkoutsLoading(true);
    try {
      const pageSize = 10;
      const offset = (p - 1) * pageSize;

      // Build request params with search filter
      const params = {
        count: pageSize,
        offset,
        ...(workoutSearch && { search: workoutSearch.trim() }) // Only include search if not empty
      };

      const res = await adminPlansService.getWorkoutPlans(params) as any;
      if (res && res.data) {
        const totalCount = Number(
          res.pagination?.total_count ?? res.total_count ?? res.totalcount ?? res.count ?? res.data.length ?? 0
        );
        setWorkouts(res.data);
        setWorkoutMeta({
          page_no: p,
          total_count: totalCount,
          page_size: pageSize,
          has_next: res.pagination?.has_next ?? offset + pageSize < totalCount,
          has_previous: res.pagination?.has_previous ?? offset > 0
        });
      }
    } catch (err) {
      console.error("Error fetching workouts:", err);
      toast.error("Failed to fetch workout plans");
    } finally {
      setWorkoutsLoading(false);
    }
  };

  const fetchDiets = async (p = dietMeta.page_no || 1) => {
    setDietsLoading(true);
    try {
      const pageSize = 10;
      const offset = (p - 1) * pageSize;

      // Build request params with search filter
      const params = {
        count: pageSize,
        offset,
        ...(dietSearch && { search: dietSearch.trim() }) // Only include search if not empty
      };

      const res = await adminPlansService.getDietPlans(params) as any;
      if (res && res.data) {
        const totalCount = Number(
          res.pagination?.total_count ?? res.total_count ?? res.totalcount ?? res.count ?? res.data.length ?? 0
        );
        setDiets(res.data);
        setDietMeta({
          page_no: p,
          total_count: totalCount,
          page_size: pageSize,
          has_next: res.pagination?.has_next ?? offset + pageSize < totalCount,
          has_previous: res.pagination?.has_previous ?? offset > 0
        });
      }
    } catch (err) {
      console.error("Error fetching diets:", err);
      toast.error("Failed to fetch diet plans");
    } finally {
      setDietsLoading(false);
    }
  };

  const fetchUsers = async (s = userSearch) => {
    setUsersLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN.GET_USERS_DROPDOWN, { search: s }) as any;
      if (res && res.data) {
        setUsersDropdown(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (assignModalOpen) fetchUsers(userSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [userSearch, assignModalOpen]);

  // Handle search and tab changes with debouncing
  useEffect(() => {
    const currentSearch = activeTab === "workout" ? workoutSearch : dietSearch;

    // Update URL params whenever search or tab changes
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", activeTab);
    if (currentSearch) {
      newParams.set("search", currentSearch);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams, { replace: true });

    // Debounce API call to avoid too many requests
    const timer = setTimeout(() => {
      if (activeTab === "workout") {
        fetchWorkouts(1); // Reset to page 1 on search/tab change
      } else {
        fetchDiets(1); // Reset to page 1 on search/tab change
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [workoutSearch, dietSearch, activeTab, searchParams, setSearchParams]);

  // === EVENT HANDLERS ===
  const handleSaveWorkout = async () => {
    if (!workoutForm.name.trim()) {
      toast.error("Protocol name is required");
      return;
    }
    if (!workoutForm.focus.trim()) {
      toast.error("Objective focus is required");
      return;
    }
    if (workoutForm.workout_details.length === 0) {
      toast.error("Please add at least one training day");
      return;
    }
    try {
      setWorkoutSaving(true);
      if (editWorkoutId) {
        await adminPlansService.updateWorkoutPlan(editWorkoutId, workoutForm);
        toast.success("Workout plan updated successfully.");
      } else {
        await adminPlansService.createWorkoutPlan(workoutForm);
        toast.success("Workout plan created successfully.");
      }
      setWorkoutModalOpen(false);
      fetchWorkouts(workoutMeta.page_no);
    } catch (err) {
      toast.error("Failed to save workout plan.");
    } finally {
      setWorkoutSaving(false);
    }
  };

  const handleSaveDiet = async () => {
    if (!dietForm.name.trim()) {
      toast.error("Protocol name is required");
      return;
    }
    if (!dietForm.focus.trim()) {
      toast.error("Focus area is required");
      return;
    }
    if (dietForm.diet_details.length === 0) {
      toast.error("Please add at least one nutritional day");
      return;
    }
    try {
      setDietSaving(true);
      if (editDietId) {
        await adminPlansService.updateDietPlan(editDietId, dietForm);
        toast.success("Diet plan updated successfully.");
      } else {
        await adminPlansService.createDietPlan(dietForm);
        toast.success("Diet plan created successfully.");
      }
      setDietModalOpen(false);
      fetchDiets(dietMeta.page_no);
    } catch (err) {
      toast.error("Failed to save diet plan.");
    } finally {
      setDietSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === "workout") {
        await adminPlansService.deleteWorkoutPlan(deleteTarget.id);
        toast.success("Workout plan deleted successfully.");
        fetchWorkouts(workoutMeta.page_no);
      } else {
        await adminPlansService.deleteDietPlan(deleteTarget.id);
        toast.success("Diet plan deleted successfully.");
        fetchDiets(dietMeta.page_no);
      }
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete plan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignUserId || !assignPlanId || !assignType) {
      toast.error("Please select a user and a plan.");
      return;
    }
    try {
      setAssigning(true);
      if (assignType === "workout") {
        await adminPlansService.assignWorkoutPlan({ user_id: assignUserId, workout_plan_id: assignPlanId });
        toast.success("Workout plan assigned successfully.");
      } else {
        await adminPlansService.assignDietPlan({ user_id: assignUserId, diet_plan_id: assignPlanId });
        toast.success("Diet plan assigned successfully.");
      }
      setAssignModalOpen(false);
    } catch (err) {
      toast.error("Failed to assign plan.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <GlassCard className="space-y-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col gap-6">
        <SectionTitle
          title={t("plans") || "Fitness & Nutrition Plans"}
          subtitle={t("plansSubtitle")}
        />

        {/* Improved Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-white/10 w-max backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("workout")}
            className={`relative px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-out overflow-hidden group ${activeTab === "workout"
              ? "text-white"
              : "text-slate-400 hover:text-slate-300"
              }`}
          >
            {/* Background glow effect */}
            {activeTab === "workout" && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            )}
            {/* Hover effect for inactive */}
            {activeTab !== "workout" && (
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 rounded-xl transition-colors duration-300 -z-10" />
            )}
            {/* Active indicator shadow */}
            {activeTab === "workout" && (
              <div className="absolute inset-0 rounded-xl shadow-lg shadow-indigo-500/50 -z-10" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              💪 {t("workoutPlans")}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("diet")}
            className={`relative px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-out overflow-hidden group ${activeTab === "diet"
              ? "text-white"
              : "text-slate-400 hover:text-slate-300"
              }`}
          >
            {/* Background glow effect */}
            {activeTab === "diet" && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            )}
            {/* Hover effect for inactive */}
            {activeTab !== "diet" && (
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-xl transition-colors duration-300 -z-10" />
            )}
            {/* Active indicator shadow */}
            {activeTab === "diet" && (
              <div className="absolute inset-0 rounded-xl shadow-lg shadow-emerald-500/50 -z-10" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              🥗 {t("dietPlans")}
            </span>
          </button>
        </div>
      </div>

      {/* WORKOUT PLANS TAB */}
      {activeTab === "workout" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Search & Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input with Improved Design */}
            <div className="relative group flex-1 sm:flex-none sm:min-w-64">
              {/* Animated background blur */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-indigo-400/5 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

              {/* Search Icon */}
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300 pointer-events-none" size={18} />

              {/* Input Field */}
              <input
                type="text"
                placeholder={t("searchPlansPlaceholder")}
                value={workoutSearch}
                onChange={(e) => setWorkoutSearch(e.target.value)}
                className="relative w-full bg-slate-900/40 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500/60 focus:bg-slate-900/60 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 placeholder:text-slate-500"
              />

              {/* Clear button when search is active */}
              {workoutSearch && (
                <button
                  onClick={() => setWorkoutSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}

              {/* Loading indicator */}
              {workoutsLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Create Button */}
            <GlowButton
              onClick={() => {
                setWorkoutForm({ name: "", type: "", description: "", focus: "", workout_details: [] });
                setEditWorkoutId(null);
                setWorkoutModalOpen(true);
              }}
              className="px-6 py-3.5 flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest text-xs whitespace-nowrap"
            >
              <Plus size={16} />
              {t("addNewPlan")}
            </GlowButton>
          </div>

          {/* Results Count */}
          {!workoutsLoading && workouts.length > 0 && (
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              {t("showingCount", { count: workouts.length, total: workoutMeta.total_count })}
              {workoutSearch && <span className="text-indigo-400 ml-2">• {t("filtered")}: "{workoutSearch}"</span>}
            </div>
          )}

          {workoutsLoading && workouts.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : workouts.length > 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <Table
                headers={[t("planDetails"), t("typeFocus"), t("days"), t("created"), t("actions")]}
                rows={workouts.map((p) => [
                  <div key={`${p.id}-info`} className="flex flex-col gap-1 py-1">
                    <span className="font-black text-white uppercase tracking-tight text-sm group-hover:text-indigo-400 transition-colors">{p.name}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">{p.description}</span>
                  </div>,
                  <div key={`${p.id}-type`} className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em]">{p.type}</span>
                    <span className="text-xs font-bold text-slate-300">{p.focus}</span>
                  </div>,
                  <div key={`${p.id}-days`} className="flex items-center">
                    <span className="text-[11px] font-black text-indigo-100 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider">
                      {p.workout_details?.length || 0} {t("days")}
                    </span>
                  </div>,
                  <span key={`${p.id}-date`} className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                    {p.created_date ? new Date(p.created_date * 1000).toLocaleDateString() : "--"}
                  </span>,
                  <div key={`${p.id}-act`} className="flex gap-2">
                    <button
                      title="Assign to User"
                      className="group/btn text-emerald-400 hover:text-emerald-300 transition-all hover:scale-110 bg-emerald-500/10 hover:bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/10"
                      onClick={() => {
                        setAssignType("workout");
                        setAssignPlanId(p.id!);
                        fetchUsers();
                        setAssignModalOpen(true);
                      }}
                    >
                      <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                    </button>
                    <button
                      className="group/btn text-indigo-400 hover:text-indigo-300 transition-all hover:scale-110 bg-indigo-500/10 hover:bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/10"
                      onClick={() => {
                        setWorkoutForm(p);
                        setEditWorkoutId(p.id!);
                        setWorkoutModalOpen(true);
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="group/btn text-red-400 hover:text-red-300 transition-all hover:scale-110 bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-xl border border-red-500/10"
                      onClick={() => {
                        setDeleteTarget({ type: "workout", id: p.id! });
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ])}
              />
              <LoadingOverlay show={workoutsLoading && workouts.length > 0} label="Refreshing workout plans" compact />
            </div>
          ) : (
            <EmptyState title="No Workout Plans" hint="Create your first workout strategy to begin." />
          )}

          <Pagination
            currentPage={workoutMeta.page_no}
            totalPages={Math.ceil(workoutMeta.total_count / workoutMeta.page_size) || 1}
            hasPrev={workoutMeta.has_previous}
            hasNext={workoutMeta.has_next}
            onPrev={() => fetchWorkouts(workoutMeta.page_no - 1)}
            onNext={() => fetchWorkouts(workoutMeta.page_no + 1)}
          />
        </div>
      )}

      {/* DIET PLANS TAB */}
      {activeTab === "diet" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Search & Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input with Improved Design */}
            <div className="relative group flex-1 sm:flex-none sm:min-w-64">
              {/* Animated background blur */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

              {/* Search Icon */}
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300 pointer-events-none" size={18} />

              {/* Input Field */}
              <input
                type="text"
                placeholder={t("searchPlansPlaceholder")}
                value={dietSearch}
                onChange={(e) => setDietSearch(e.target.value)}
                className="relative w-full bg-slate-900/40 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white outline-none focus:border-emerald-500/60 focus:bg-slate-900/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder:text-slate-500"
              />

              {/* Clear button when search is active */}
              {dietSearch && (
                <button
                  onClick={() => setDietSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}

              {/* Loading indicator */}
              {dietsLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Create Button */}
            <GlowButton
              className="from-emerald-600 to-teal-500 shadow-emerald-500/20 hover:shadow-emerald-500/40 px-6 py-3.5 flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest text-xs whitespace-nowrap"
              onClick={() => {
                setDietForm({ name: "", focus: "", diet_details: [] });
                setEditDietId(null);
                setDietModalOpen(true);
              }}
            >
              <Plus size={16} />
              {t("addNewPlan")}
            </GlowButton>
          </div>

          {/* Results Count */}
          {!dietsLoading && diets.length > 0 && (
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              {t("showingCount", { count: diets.length, total: dietMeta.total_count })}
              {dietSearch && <span className="text-emerald-400 ml-2">• {t("filtered")}: "{dietSearch}"</span>}
            </div>
          )}

          {dietsLoading && diets.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : diets.length > 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <Table
                headers={[t("planName"), t("focusArea"), t("days"), t("created"), t("actions")]}
                rows={diets.map((p) => [
                  <span key={`${p.id}-name`} className="font-black text-white uppercase tracking-tight text-sm py-1 block group-hover:text-emerald-400 transition-colors">{p.name}</span>,
                  <span key={`${p.id}-focus`} className="text-xs font-bold text-slate-300">{p.focus}</span>,
                  <div key={`${p.id}-days`} className="flex items-center">
                    <span className="text-[11px] font-black text-emerald-100 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                      {p.diet_details?.length || 0} {t("days")}
                    </span>
                  </div>,
                  <span key={`${p.id}-date`} className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                    {p.created_date ? new Date(p.created_date * 1000).toLocaleDateString() : "--"}
                  </span>,
                  <div key={`${p.id}-act`} className="flex gap-2">
                    <button
                      title="Assign to User"
                      className="group/btn text-emerald-400 hover:text-emerald-300 transition-all hover:scale-110 bg-emerald-500/10 hover:bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/10"
                      onClick={() => {
                        setAssignType("diet");
                        setAssignPlanId(p.id!);
                        fetchUsers();
                        setAssignModalOpen(true);
                      }}
                    >
                      <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                    </button>
                    <button
                      className="group/btn text-indigo-400 hover:text-indigo-300 transition-all hover:scale-110 bg-indigo-500/10 hover:bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/10"
                      onClick={() => {
                        setDietForm(p);
                        setEditDietId(p.id!);
                        setDietModalOpen(true);
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="group/btn text-red-400 hover:text-red-300 transition-all hover:scale-110 bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-xl border border-red-500/10"
                      onClick={() => {
                        setDeleteTarget({ type: "diet", id: p.id! });
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ])}
              />
              <LoadingOverlay show={dietsLoading && diets.length > 0} label="Refreshing diet plans" compact />
            </div>
          ) : (
            <EmptyState title="No Diet Plans" hint="Formulate a nutritional strategy to start." />
          )}

          <Pagination
            currentPage={dietMeta.page_no}
            totalPages={Math.ceil(dietMeta.total_count / dietMeta.page_size) || 1}
            hasPrev={dietMeta.has_previous}
            hasNext={dietMeta.has_next}
            onPrev={() => fetchDiets(dietMeta.page_no - 1)}
            onNext={() => fetchDiets(dietMeta.page_no + 1)}
          />
        </div>
      )}

      {/* === MODALS === */}

      <WorkoutPlanModal
        isOpen={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        editWorkoutId={editWorkoutId}
        workoutForm={workoutForm}
        setWorkoutForm={setWorkoutForm}
        onSave={handleSaveWorkout}
        saving={workoutSaving}
      />

      <DietPlanModal
        isOpen={dietModalOpen}
        onClose={() => setDietModalOpen(false)}
        editDietId={editDietId}
        dietForm={dietForm}
        setDietForm={setDietForm}
        onSave={handleSaveDiet}
        saving={dietSaving}
      />

      <AssignPlanModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        assignType={assignType}
        assignPlanId={assignPlanId}
        assignUserId={assignUserId}
        setAssignUserId={setAssignUserId}
        userSearch={userSearch}
        setUserSearch={setUserSearch}
        usersDropdown={usersDropdown}
        onAssign={handleAssign}
        assigning={assigning}
        usersLoading={usersLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t("removalAuthorization")}
        description={t("removalDescription")}
        confirmLabel={t("submit")}
        isProcessing={deleteLoading}
      />

    </GlassCard>
  );
}
