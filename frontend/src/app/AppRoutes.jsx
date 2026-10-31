import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../features/auth";
import { ROUTES } from "../shared/routes";
import { AppLoader, ErrorBoundary } from "../shared/ui";
import { AppShell } from "./layout/AppShell";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const InboxPage = lazy(() => import("../pages/InboxPage"));
const ReviewPage = lazy(() => import("../pages/ReviewPage"));
const OverviewPage = lazy(() => import("../pages/OverviewPage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));
const CatalogPage = lazy(() => import("../pages/CatalogPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const GuidePage = lazy(() => import("../pages/GuidePage"));
const PlaygroundPage = lazy(() => import("../pages/PlaygroundPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/** Route table: public login, then every signed-in page inside the shell. */
export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.playground} element={<PlaygroundPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to={ROUTES.overview} replace />} />
              <Route path={ROUTES.inbox} element={<InboxPage />} />
              <Route path={ROUTES.review} element={<ReviewPage />} />
              <Route path={ROUTES.overview} element={<OverviewPage />} />
              <Route path={ROUTES.analytics} element={<AnalyticsPage />} />
              <Route path={ROUTES.catalog} element={<CatalogPage />} />
              <Route path={ROUTES.settings} element={<SettingsPage />} />
              <Route path={ROUTES.guide} element={<GuidePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
