import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: number) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  
  addToast: (message, type) => {
    // Prevent duplicate messages within 2 seconds
    const existing = get().toasts.find(t => t.message === message);
    if (existing) return;
    
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
    
  clearAll: () => set({ toasts: [] }),
}));

export const toast = {
  success: (msg: string) => useToastStore.getState().addToast(msg, "success"),
  error: (msg: string) => useToastStore.getState().addToast(msg, "error"),
  info: (msg: string) => useToastStore.getState().addToast(msg, "info"),
};