import { Navigate } from "react-router-dom";
import { LoginCard, LoginHero, useAuth } from "../features/auth";
import { AppLoader, ErrorState } from "../shared/ui";
import { ROUTES } from "../shared/routes";

/** Public sign-in page; a signed-in user is sent on to the overview. */
export default function LoginPage() {
  const { user, status, error, retry } = useAuth();

  if (status === "loading") return <AppLoader />;
  if (status === "error") return <ErrorState message={error.message} onRetry={retry} />;
  if (user) return <Navigate to={ROUTES.overview} replace />;

  return (
    <div className="login final-login">
      <LoginHero />
      <LoginCard />
    </div>
  );
}
