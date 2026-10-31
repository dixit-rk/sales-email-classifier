import { ChevronRight, CircleHelp, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ProfileMenu, useAuth } from "../../features/auth";
import { NotificationBell } from "../../features/notifications";
import { useTheme } from "../../shared/theme/themeContext";
import { IconButton } from "../../shared/ui";
import { ROUTES } from "../../shared/routes";
import { labelForPath } from "./navItems";

const gmailLabel = (user) => {
  if (!user.gmailConnected) return "Gmail not connected";

  return user.gmailWatching ? "Gmail connected" : "Gmail not syncing";
};

/** Breadcrumb, theme switch, notification bell and Gmail connection status. */
export function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <header className="topbar">
      <div className="crumb"><span className="crumb-root">Workspace <ChevronRight size={14} aria-hidden="true" /></span> <b>{labelForPath(pathname)}</b></div>
      <div className="top-actions">
        <IconButton icon={theme === "dark" ? Sun : Moon} label={`Switch to ${next} mode`} className="theme-switch" onClick={toggleTheme} />
        <Link to={ROUTES.guide} className="icon-btn topbar-help" aria-label="Help and guide" title="Help and guide"><CircleHelp size={18} aria-hidden="true" /></Link>
        <NotificationBell />
        <Link to={ROUTES.settings} className={`online ${user.gmailWatching ? "" : "offline"}`} title="Open Gmail settings">
          <span className="dot" /> {gmailLabel(user)}
        </Link>
        <ProfileMenu />
      </div>
    </header>
  );
}
