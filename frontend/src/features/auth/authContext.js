import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

/** `{ user, status, error, retry, signOut }`; status is "loading", "ready" or "error". */
export const useAuth = () => useContext(AuthContext);
