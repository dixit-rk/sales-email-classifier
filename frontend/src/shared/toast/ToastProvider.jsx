import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toastContext";
import { ToastStack } from "./ToastStack";

const TOAST_DURATION_MS = 5000;
const MAX_TOASTS = 4;

/** Owns the toast queue and renders it bottom-right. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const show = useCallback(
    (toast) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { tone: "info", ...toast, id }].slice(-MAX_TOASTS));
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
