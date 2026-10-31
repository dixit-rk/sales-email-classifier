import { useMemo, useState } from "react";
import { useAsyncResource } from "../../shared/hooks/useAsyncResource";
import { useToast } from "../../shared/toast/toastContext";
import { fetchCurrentUser, logout, updateProfile } from "./api/authApi";
import { AuthContext } from "./authContext";

const SESSION_KEY = "session";

/** Loads the signed-in user once and exposes sign-out and profile editing. A 401 means signed out, anything else is an error. */
export function AuthProvider({ children }) {
  const { data, error, loading, reload } = useAsyncResource(SESSION_KEY, fetchCurrentUser);
  const [signedOut, setSignedOut] = useState(false);
  const [saved, setSaved] = useState(null);
  const toast = useToast();

  const value = useMemo(() => {
    const failed = error && !error.isUnauthorized;

    return {
      user: signedOut || error ? null : (saved ?? data),
      status: loading ? "loading" : failed ? "error" : "ready",
      error,
      retry: reload,
      saveDisplayName: async (displayName) => setSaved(await updateProfile(displayName)),
      signOut: async () => {
        try {
          await logout();
          setSignedOut(true);
        } catch (logoutError) {
          toast.show({ tone: "error", message: logoutError.message });
        }
      },
    };
  }, [data, error, loading, reload, saved, signedOut, toast]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
