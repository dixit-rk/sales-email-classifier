import { Navigate, Outlet } from "react-router-dom";
import { AppLoader, ErrorState } from "../../shared/ui";
import { ROUTES } from "../../shared/routes";
import { useAuth } from "./authContext";

/** Renders child routes only for a signed-in user; otherwise sends them to the login page. */
export function ProtectedRoute() {
  const { user, status, error, retry } = useAuth();

  if (status === "loading") return <AppLoader />;
  if (status === "error") return <ErrorState message={error.message} onRetry={retry} />;
  if (!user) return <Navigate to={ROUTES.login} replace />;

  return <Outlet />;
}
