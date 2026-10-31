import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { EmailCountsProvider } from "../../features/emails";
import { readStorage, writeStorage } from "../../shared/lib/storage";
import { AppLoader } from "../../shared/ui";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import "./layout.css";

const COLLAPSE_KEY = "chemquote-sidebar";

/** Signed-in frame: sidebar, top bar, page outlet and mobile navigation. */
export function AppShell() {
  const [collapsed, setCollapsed] = useState(() => readStorage(COLLAPSE_KEY) === "collapsed");

  const toggle = () => {
    writeStorage(COLLAPSE_KEY, collapsed ? "expanded" : "collapsed");
    setCollapsed(!collapsed);
  };

  return (
    <EmailCountsProvider>
      <div className={`workspace ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar collapsed={collapsed} onToggle={toggle} />
        <main className="main">
          <Topbar />
          <Suspense fallback={<AppLoader inline />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <MobileNav />
    </EmailCountsProvider>
  );
}
