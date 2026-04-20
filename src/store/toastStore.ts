import { create } from "zustand";

export type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  title: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, title?: string) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, title) => {
    const id = Date.now();
    const defaultTitle = type === "success" ? "Success" : "Error";
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, title: title || defaultTitle }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (msg: string, title?: string) => useToastStore.getState().addToast(msg, "success", title),
  error: (msg: string, title?: string) => useToastStore.getState().addToast(msg, "error", title),
};
