import { create } from 'zustand';
import type { Role } from '../data/mockData';

type AuthState = {
  role: Role | null;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  isAuthenticated: false,
  login: (role) => set({ role, isAuthenticated: true }),
  logout: () => set({ role: null, isAuthenticated: false }),
}));
