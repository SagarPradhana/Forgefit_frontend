import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

// Interfaces for Workout Plans
export interface WorkoutDetail {
  day: string;
  workouts: {
    target_body_part: string;
    name: string;
    no_of_sets: number;
    reps: string;
  }[];
}

export interface WorkoutPlan {
  id?: string;
  name: string;
  type: string;
  description: string;
  focus: string;
  workout_details: WorkoutDetail[];
  created_date?: number;
}

// Interfaces for Diet Plans
export interface DietDetail {
  day: string;
  foods: {
    name: string;
    weight: string;
  }[];
}

export interface DietPlan {
  id?: string;
  name: string;
  focus: string;
  diet_details: DietDetail[];
  created_date?: number;
}

export const adminPlansService = {
  // Workout Plans
  createWorkoutPlan: async (payload: WorkoutPlan) => {
    return await api.post(API_ENDPOINTS.ADMIN.WORKOUT_PLANS, payload);
  },

  getWorkoutPlans: async (params?: any) => {
    return await api.get(API_ENDPOINTS.ADMIN.WORKOUT_PLANS_LIST, params);
  },

  getWorkoutPlanById: async (id: string) => {
    return await api.get(API_ENDPOINTS.ADMIN.WORKOUT_PLAN_DETAIL(id));
  },

  updateWorkoutPlan: async (id: string, payload: Partial<WorkoutPlan>) => {
    return await api.put(API_ENDPOINTS.ADMIN.WORKOUT_PLAN_DETAIL(id), payload);
  },

  deleteWorkoutPlan: async (id: string) => {
    return await api.delete(API_ENDPOINTS.ADMIN.WORKOUT_PLAN_DETAIL(id));
  },

  assignWorkoutPlan: async (payload: { user_id: string; workout_plan_id: string }) => {
    return await api.post(API_ENDPOINTS.ADMIN.WORKOUT_PLAN_ASSIGN, payload);
  },

  // Diet Plans
  createDietPlan: async (payload: DietPlan) => {
    return await api.post(API_ENDPOINTS.ADMIN.DIET_PLANS, payload);
  },

  getDietPlans: async (params?: any) => {
    return await api.get(API_ENDPOINTS.ADMIN.DIET_PLANS_LIST, params);
  },

  getDietPlanById: async (id: string) => {
    return await api.get(API_ENDPOINTS.ADMIN.DIET_PLAN_DETAIL(id));
  },

  updateDietPlan: async (id: string, payload: Partial<DietPlan>) => {
    return await api.put(API_ENDPOINTS.ADMIN.DIET_PLAN_DETAIL(id), payload);
  },

  deleteDietPlan: async (id: string) => {
    return await api.delete(API_ENDPOINTS.ADMIN.DIET_PLAN_DETAIL(id));
  },

  assignDietPlan: async (payload: { user_id: string; diet_plan_id: string }) => {
    return await api.post(API_ENDPOINTS.ADMIN.DIET_PLAN_ASSIGN, payload);
  },
};
