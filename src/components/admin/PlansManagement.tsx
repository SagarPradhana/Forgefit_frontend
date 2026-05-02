import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  EmptyState,
  GlassCard,
  GlowButton,
  Modal,
  SectionTitle,
  Skeleton,
  Table,
} from "../ui/primitives";
import { Edit2, Search, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "../../store/toastStore";
import { api } from "../../utils/httputils";
import { API_ENDPOINTS } from "../../utils/url";
import { useTranslation } from "react-i18next";
import { adminPlansService, type WorkoutPlan, type DietPlan } from "../../services/adminPlansService";

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
         setWorkouts(res.data);
         setWorkoutMeta({
           page_no: p,
           total_count: res.pagination?.total_count || 0,
           page_size: pageSize,
           has_next: res.pagination?.has_next || false,
           has_previous: res.pagination?.has_previous || false
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
         setDiets(res.data);
         setDietMeta({
           page_no: p,
           total_count: res.pagination?.total_count || 0,
           page_size: pageSize,
           has_next: res.pagination?.has_next || false,
           has_previous: res.pagination?.has_previous || false
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
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN.GET_USERS_DROPDOWN, { search: s }) as any;
      if (res && res.data) {
        setUsersDropdown(res.data);
      }
    } catch (err) {
      console.error(err);
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
    try {
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
    }
  };

  const handleSaveDiet = async () => {
    try {
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
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
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
    }
  };

  const handleAssign = async () => {
    if (!assignUserId || !assignPlanId || !assignType) {
      toast.error("Please select a user and a plan.");
      return;
    }
    try {
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
    }
  };

  return (
    <GlassCard className="space-y-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col gap-6">
        <SectionTitle
          title={t("plans") || "Fitness & Nutrition Plans"}
          subtitle="Manage workout routines and dietary protocols for members."
        />
        
        {/* Improved Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-white/10 w-max backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("workout")}
            className={`relative px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-out overflow-hidden group ${
              activeTab === "workout"
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
              💪 Workout Plans
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("diet")}
            className={`relative px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-out overflow-hidden group ${
              activeTab === "diet"
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
              🥗 Diet Plans
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
                placeholder="Search by name, type, focus..."
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
              Add New Plan
            </GlowButton>
          </div>

          {/* Results Count */}
          {!workoutsLoading && workouts.length > 0 && (
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              Showing {workouts.length} of {workoutMeta.total_count} plans
              {workoutSearch && <span className="text-indigo-400 ml-2">• Filtered: "{workoutSearch}"</span>}
            </div>
          )}

          {workoutsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : workouts.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <Table
                headers={["Plan Details", "Type & Focus", "Days", "Created", "Actions"]}
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
                      {p.workout_details?.length || 0} Days
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
             </div>
           ) : (
             <EmptyState title="No Workout Plans" hint="Create your first workout strategy to begin." />
           )}

          {/* Pagination Controls */}
          {workouts.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Page {workoutMeta.page_no} of {Math.ceil(workoutMeta.total_count / workoutMeta.page_size)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchWorkouts(workoutMeta.page_no - 1)}
                  disabled={!workoutMeta.has_previous}
                  className="px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 disabled:bg-slate-900/50 disabled:text-slate-600 text-indigo-400 hover:text-indigo-300 disabled:hover:text-slate-600 transition-all text-xs font-bold uppercase tracking-wider disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => fetchWorkouts(workoutMeta.page_no + 1)}
                  disabled={!workoutMeta.has_next}
                  className="px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 disabled:bg-slate-900/50 disabled:text-slate-600 text-indigo-400 hover:text-indigo-300 disabled:hover:text-slate-600 transition-all text-xs font-bold uppercase tracking-wider disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
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
                placeholder="Search by name, focus area..."
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
              Add New Plan
            </GlowButton>
          </div>

          {/* Results Count */}
          {!dietsLoading && diets.length > 0 && (
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              Showing {diets.length} of {dietMeta.total_count} plans
              {dietSearch && <span className="text-emerald-400 ml-2">• Filtered: "{dietSearch}"</span>}
            </div>
          )}

          {dietsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : diets.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <Table
                headers={["Plan Name", "Focus Area", "Days", "Created", "Actions"]}
                rows={diets.map((p) => [
                  <span key={`${p.id}-name`} className="font-black text-white uppercase tracking-tight text-sm py-1 block group-hover:text-emerald-400 transition-colors">{p.name}</span>,
                  <span key={`${p.id}-focus`} className="text-xs font-bold text-slate-300">{p.focus}</span>,
                  <div key={`${p.id}-days`} className="flex items-center">
                    <span className="text-[11px] font-black text-emerald-100 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                      {p.diet_details?.length || 0} Days
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
             </div>
           ) : (
             <EmptyState title="No Diet Plans" hint="Formulate a nutritional strategy to start." />
           )}

          {/* Pagination Controls */}
          {diets.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Page {dietMeta.page_no} of {Math.ceil(dietMeta.total_count / dietMeta.page_size)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchDiets(dietMeta.page_no - 1)}
                  disabled={!dietMeta.has_previous}
                  className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-slate-900/50 disabled:text-slate-600 text-emerald-400 hover:text-emerald-300 disabled:hover:text-slate-600 transition-all text-xs font-bold uppercase tracking-wider disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => fetchDiets(dietMeta.page_no + 1)}
                  disabled={!dietMeta.has_next}
                  className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-slate-900/50 disabled:text-slate-600 text-emerald-400 hover:text-emerald-300 disabled:hover:text-slate-600 transition-all text-xs font-bold uppercase tracking-wider disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === MODALS === */}
      
      {/* Workout Plan Modal */}
      <Modal
        open={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        title={editWorkoutId ? "Edit Workout Plan" : "Create Workout Plan"}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setWorkoutModalOpen(false)}
            >
              Cancel
            </button>
            <GlowButton onClick={handleSaveWorkout} className="px-8">Save Protocol</GlowButton>
          </div>
        }
      >
        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Plan Identity</label>
              <input
                className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
                value={workoutForm.name}
                onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                placeholder="e.g. TITAN BULK PHASE"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Protocol Type</label>
              <input
                className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
                value={workoutForm.type}
                onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                placeholder="e.g. STRENGTH & POWER"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Primary Focus Area</label>
              <input
                className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
                value={workoutForm.focus}
                onChange={(e) => setWorkoutForm({ ...workoutForm, focus: e.target.value })}
                placeholder="e.g. HYPERTROPHY / POSTERIOR CHAIN"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Strategy Description</label>
              <textarea
                className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-indigo-500/50 outline-none transition duration-300 text-sm font-medium resize-none h-24 shadow-inner"
                value={workoutForm.description}
                onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                placeholder="Detail the methodology of this workout plan..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Training Cycles</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Construct day-by-day routines</p>
              </div>
              <button
                onClick={() => setWorkoutForm({
                  ...workoutForm,
                  workout_details: [...workoutForm.workout_details, { day: String(workoutForm.workout_details.length + 1), workouts: [] }]
                })}
                className="group flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-[11px] font-black uppercase tracking-widest">Add Cycle +</span>
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Day Identifier</label>
                    <select
                      className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-indigo-500 outline-none text-base font-black mt-1 transition-colors"
                      value={dayDetail.day || ""}
                      onChange={(e) => {
                        const newDetails = [...workoutForm.workout_details];
                        newDetails[dIndex].day = e.target.value;
                        setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                      }}
                    >
                      <option value="" className="bg-slate-900 text-slate-500">Select Day</option>
                      <option value={1} className="bg-slate-900 text-white">Monday</option>
                      <option value={2} className="bg-slate-900 text-white">Tuesday</option>
                      <option value={3} className="bg-slate-900 text-white">Wednesday</option>
                      <option value={4} className="bg-slate-900 text-white">Thursday</option>
                      <option value={5} className="bg-slate-900 text-white">Friday</option>
                      <option value={6} className="bg-slate-900 text-white">Saturday</option>
                      <option value={7} className="bg-slate-900 text-white">Sunday</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exercise Breakdown</label>
                      <button
                        onClick={() => {
                          const newDetails = [...workoutForm.workout_details];
                          newDetails[dIndex].workouts.push({ target_body_part: "", name: "", no_of_sets: 3, reps: "10" });
                          setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                        }}
                        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md"
                      >
                        <span className="text-[10px] font-black uppercase">Add Exercise +</span>
                      </button>
                    </div>
                    
                    <div className="grid gap-2">
                      {dayDetail.workouts.map((ex, eIndex) => (
                        <div key={eIndex} className="flex gap-2 items-center bg-slate-950/80 p-3 rounded-xl border border-white/5 group/row hover:border-indigo-500/20 transition-all">
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">Target</span>
                              <input
                                className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                                placeholder="Body Part"
                                value={ex.target_body_part}
                                onChange={(e) => {
                                  const newDetails = [...workoutForm.workout_details];
                                  newDetails[dIndex].workouts[eIndex].target_body_part = e.target.value;
                                  setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">Exercise</span>
                              <input
                                className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                                placeholder="Name"
                                value={ex.name}
                                onChange={(e) => {
                                  const newDetails = [...workoutForm.workout_details];
                                  newDetails[dIndex].workouts[eIndex].name = e.target.value;
                                  setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">Sets</span>
                              <input
                                type="number"
                                className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                                placeholder="Sets"
                                value={ex.no_of_sets}
                                onChange={(e) => {
                                  const newDetails = [...workoutForm.workout_details];
                                  newDetails[dIndex].workouts[eIndex].no_of_sets = Number(e.target.value);
                                  setWorkoutForm({ ...workoutForm, workout_details: newDetails });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">Reps</span>
                              <input
                                className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-indigo-500/30"
                                placeholder="e.g. 10-12"
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
                            className="text-slate-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 mt-4"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                      {dayDetail.workouts.length === 0 && (
                        <div className="text-center py-6 bg-slate-950/50 rounded-xl border border-white/5 border-dashed">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No exercises defined for this cycle</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {workoutForm.workout_details.length === 0 && (
                <div className="text-center py-12 bg-white/5 rounded-3xl border-2 border-white/5 border-dashed">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                    <Plus size={32} />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Empty Training Cycle</h4>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Begin by adding your first training day above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Diet Plan Modal */}
      <Modal
        open={dietModalOpen}
        onClose={() => setDietModalOpen(false)}
        title={editDietId ? "Edit Diet Protocol" : "Create Diet Protocol"}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setDietModalOpen(false)}
            >
              Cancel
            </button>
            <GlowButton onClick={handleSaveDiet} className="from-emerald-600 to-teal-500 px-8">Activate Protocol</GlowButton>
          </div>
        }
      >
        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Protocol Name</label>
              <input
                className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-emerald-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
                value={dietForm.name}
                onChange={(e) => setDietForm({ ...dietForm, name: e.target.value })}
                placeholder="e.g. KETO SHRED 2.0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Focus Area</label>
              <input
                className="w-full rounded-2xl bg-slate-950 border border-white/5 p-4 text-white focus:border-emerald-500/50 outline-none transition duration-300 text-sm font-bold shadow-inner"
                value={dietForm.focus}
                onChange={(e) => setDietForm({ ...dietForm, focus: e.target.value })}
                placeholder="e.g. FAT LOSS / MAINTENANCE"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Nutritional Cycle</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Define daily meal structures</p>
              </div>
              <button
                onClick={() => setDietForm({
                  ...dietForm,
                  diet_details: [...dietForm.diet_details, { day: String(dietForm.diet_details.length + 1), foods: [] }]
                })}
                className="group flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-[11px] font-black uppercase tracking-widest">Add Cycle +</span>
              </button>
            </div>

            <div className="space-y-4">
              {dietForm.diet_details.map((dayDetail, dIndex) => (
                <div key={dIndex} className="bg-slate-900/40 rounded-2xl p-6 border border-white/5 space-y-6 relative group transition-all hover:border-white/10 hover:bg-slate-900/60">
                  <button
                    onClick={() => {
                      const newDetails = [...dietForm.diet_details];
                      newDetails.splice(dIndex, 1);
                      setDietForm({ ...dietForm, diet_details: newDetails });
                    }}
                    className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 p-1.5 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <div className="w-full md:w-1/2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Day Identifier</label>
                    <select
                      className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-emerald-500 outline-none text-base font-black mt-1 transition-colors"
                      value={dayDetail.day || ""}
                      onChange={(e) => {
                        const newDetails = [...dietForm.diet_details];
                        newDetails[dIndex].day = e.target.value;
                        setDietForm({ ...dietForm, diet_details: newDetails });
                      }}
                    >
                      <option value="" className="bg-slate-900 text-slate-500">Select Day</option>
                      <option value={1} className="bg-slate-900 text-white">Monday</option>
                      <option value={2} className="bg-slate-900 text-white">Tuesday</option>
                      <option value={3} className="bg-slate-900 text-white">Wednesday</option>
                      <option value={4} className="bg-slate-900 text-white">Thursday</option>
                      <option value={5} className="bg-slate-900 text-white">Friday</option>
                      <option value={6} className="bg-slate-900 text-white">Saturday</option>
                      <option value={7} className="bg-slate-900 text-white">Sunday</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Macro Composition</label>
                      <button
                        onClick={() => {
                          const newDetails = [...dietForm.diet_details];
                          newDetails[dIndex].foods.push({ name: "", weight: "" });
                          setDietForm({ ...dietForm, diet_details: newDetails });
                        }}
                        className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded-md"
                      >
                        <span className="text-[10px] font-black uppercase">Add Food +</span>
                      </button>
                    </div>
                    
                    <div className="grid gap-2">
                      {dayDetail.foods.map((food, fIndex) => (
                        <div key={fIndex} className="flex gap-2 items-center bg-slate-950/80 p-3 rounded-xl border border-white/5 group/row hover:border-emerald-500/20 transition-all">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">Ingredient / Meal</span>
                              <input
                                className="bg-slate-900 border border-white/5 rounded-lg px-4 py-2.5 text-xs text-white w-full outline-none focus:border-emerald-500/30 shadow-inner"
                                placeholder="e.g. Chicken Breast"
                                value={food.name}
                                onChange={(e) => {
                                  const newDetails = [...dietForm.diet_details];
                                  newDetails[dIndex].foods[fIndex].name = e.target.value;
                                  setDietForm({ ...dietForm, diet_details: newDetails });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider ml-1">Portion Size</span>
                              <input
                                className="bg-slate-900 border border-white/5 rounded-lg px-4 py-2.5 text-xs text-white w-full outline-none focus:border-emerald-500/30 shadow-inner"
                                placeholder="e.g. 250g / 1 cup"
                                value={food.weight}
                                onChange={(e) => {
                                  const newDetails = [...dietForm.diet_details];
                                  newDetails[dIndex].foods[fIndex].weight = e.target.value;
                                  setDietForm({ ...dietForm, diet_details: newDetails });
                                }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const newDetails = [...dietForm.diet_details];
                              newDetails[dIndex].foods.splice(fIndex, 1);
                              setDietForm({ ...dietForm, diet_details: newDetails });
                            }}
                            className="text-slate-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 mt-4"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                      {dayDetail.foods.length === 0 && (
                        <div className="text-center py-6 bg-slate-950/50 rounded-xl border border-white/5 border-dashed">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No meals defined for this cycle</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {dietForm.diet_details.length === 0 && (
                <div className="text-center py-12 bg-white/5 rounded-3xl border-2 border-white/5 border-dashed">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <Plus size={32} />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Empty Nutritional Cycle</h4>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Begin by adding your first meal day above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Authorize ${assignType === "workout" ? "Workout" : "Diet"} Assignment`}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setAssignModalOpen(false)}
            >
              Cancel
            </button>
            <GlowButton onClick={handleAssign} className="px-8">Confirm Assignment</GlowButton>
          </div>
        }
      >
        <div className="space-y-6 pt-4">
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4">
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Assigning this protocol will grant the selected member immediate access to these routines through their portal.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Search & Select Member</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                <input
                  type="text"
                  placeholder="Type name or member ID..."
                  className="w-full rounded-2xl bg-slate-950 border border-white/10 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-all shadow-inner"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="w-full rounded-2xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition-all duration-300 text-sm font-bold appearance-none shadow-inner"
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
              >
                <option value="" disabled className="bg-slate-950">
                  {userSearch ? `Found ${usersDropdown.length} users` : "SELECT ACTIVE MEMBER..."}
                </option>
                {usersDropdown.map((u: any) => (
                  <option key={u.id} value={u.id} className="bg-slate-950">{u.name} — {u.username || u.member_id}</option>
                ))}
                {userSearch && usersDropdown.length === 0 && (
                  <option disabled className="bg-slate-950">NO USERS FOUND</option>
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <Minus size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Removal Authorization"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-8 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-95"
              onClick={handleDelete}
            >
              Confirm Removal
            </button>
          </div>
        }
      >
        <div className="text-center space-y-4 py-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500 border border-red-500/20 shadow-inner">
            <Trash2 size={40} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-black text-xl uppercase tracking-tighter">Destructive Action</p>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed px-10">
              This protocol will be permanently erased from the master database. This action is irreversible.
            </p>
          </div>
        </div>
      </Modal>

    </GlassCard>
  );
}
