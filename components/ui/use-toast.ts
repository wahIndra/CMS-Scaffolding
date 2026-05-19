"use client";

import { useState } from "react";

type ToastVariant = "default" | "destructive";

interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

const listeners: Array<(toasts: ToastMessage[]) => void> = [];
let toastList: ToastMessage[] = [];

function dispatch(toast: ToastMessage) {
  toastList = [...toastList, toast];
  listeners.forEach((l) => l(toastList));
  setTimeout(() => {
    toastList = toastList.filter((t) => t.id !== toast.id);
    listeners.forEach((l) => l(toastList));
  }, 5000);
}

export function toast(options: Omit<ToastMessage, "id">) {
  dispatch({ ...options, id: Math.random().toString(36).slice(2) });
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>(toastList);

  useState(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  });

  return { toasts, toast };
}
