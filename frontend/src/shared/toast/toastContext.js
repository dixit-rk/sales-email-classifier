import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

/** Returns `show({ message, title?, tone?, to? })` for transient success, error and info messages. */
export const useToast = () => useContext(ToastContext);
