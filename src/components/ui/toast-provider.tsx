"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster } from "@/components/ui/toaster";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: ToastProps) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

function useToastProvider(): ToastContextType {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((toast: ToastProps) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastContextValue = useToastProvider();

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export { ToastContext };
