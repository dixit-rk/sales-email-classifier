import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth";
import { RealtimeProvider } from "../features/notifications";
import { ThemeProvider } from "../shared/theme/ThemeProvider";
import { ToastProvider } from "../shared/toast/ToastProvider";
import { AppRoutes } from "./AppRoutes";

/** Provider stack and routes. */
export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <RealtimeProvider>
              <AppRoutes />
            </RealtimeProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
