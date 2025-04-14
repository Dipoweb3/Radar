import * as React from "react";
import { ToastProps } from "@/lib/types"; // ✅ use your own ToastProps interface
// OR keep importing from "@/components/ui/toast" if you’re sure that’s what you want

const ToastContext = React.createContext<{
  toasts: ToastProps[];
  addToast: (toast: ToastProps) => void;
  removeToast: (id: string) => void;
} | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export { ToastContext };
