import * as React from "react";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

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
