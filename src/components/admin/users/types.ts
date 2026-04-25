export type ViewType = "grid" | "list";
export type UserRole = "user" | "admin" | "trainee" | "employee";
export type ModalStep =
  | "role"
  | "details"
  | "metadata"
  | "membership";

export interface UserMetadata {
  height: number;
  weight: number;
  dob: number; // Unix timestamp
  gender: string;
  language: string;
  theme: string;
  fitness_goal: string;
  medical_conditions: string;
  workout_time: string;
  emergency_contact: string;
}

export interface UserFormData {
  // username: string;
  mobile: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  password?: string;
  metadata: UserMetadata;
  joining_date: number; // Unix timestamp
  trainer_id?: string;
  subscription_id?: string;
  duration_in_months?: number;
  amount?: number;
  status?: string;
  start_date?: number;
  end_date?: number;
  profilePhoto?: string; // For UI display
}
