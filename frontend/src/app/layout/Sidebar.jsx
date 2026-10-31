import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ProfileMenu } from "../../features/auth";
import { useEmailCounts } from "../../features/emails";
import { BrandMark, IconButton } from "../../shared/ui";
import { HELP_ITEM, MANAGE_ITEMS, WORKSPACE_ITEMS } from "./navItems";

function NavItem({ item, count }) {
  const Icon = item.icon;

  return (
    <NavLink to={item.to} className={({ isActive }) => `nav ${isActive ? "active" : ""}`} title={item.label}>
      <Icon aria-hidden="true" />
      <span className="nav-text">{item.label}</span>
      {count !== undefined && count !== null && <span className="count">{count}</span>}
    </NavLink>
  );
}

/** Desktop navigation with live counters, collapse toggle and the signed-in user. */
export function Sidebar({ collapsed, onToggle }) {
  const { counts } = useEmailCounts();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon"><BrandMark /></span>
        <span className="brand-wordmark">ChemQuote <em>AI</em></span>
        <IconButton icon={collapsed ? PanelLeftOpen : PanelLeftClose} label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="collapse-toggle" onClick={onToggle} />
      </div>
      <nav aria-label="Main">
        <div className="side-label">WORKSPACE</div>
        {WORKSPACE_ITEMS.map((item) => <NavItem key={item.to} item={item} count={counts?.[item.countKey]} />)}
        <div className="side-label">MANAGE</div>
        {MANAGE_ITEMS.map((item) => <NavItem key={item.to} item={item} />)}
      </nav>
      <div className="side-bottom">
        <NavItem item={HELP_ITEM} />
        <ProfileMenu variant="sidebar" />
      </div>
    </aside>
  );
}
