export type ViewType = "grid" | "list";
export type UserRole = "admin" | "trainee" | "employee";
export type ModalStep =
  | "role"
  | "details"
  | "personalInfo"
  | "healthInfo"
  | "membershipDetails"
  | "preferences";

export interface PersonalInfo {
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  dob: string;
}

export interface HealthInfo {
  medicalConditions: string;
  injuries: string;
  allergies: string;
}

export interface MembershipDetails {
  planType: string;
  joiningDate: string;
  trainerAssigned: string;
  planId: string;
  trainerId: string;
  durationInMonths: number;
  amount: number;
}

export interface PreferencesInfo {
  workoutTime: string;
  notificationPreference: string;
}

export interface UserFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  role: UserRole;
  profilePhoto?: string;
  password?: string;
  personalInfo?: PersonalInfo;
  healthInfo?: HealthInfo;
  membershipDetails?: MembershipDetails;
  preferences?: PreferencesInfo;
}
