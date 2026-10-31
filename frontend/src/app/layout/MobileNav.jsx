import { NavLink } from "react-router-dom";
import { MOBILE_ITEMS } from "./navItems";

/** Bottom navigation shown at phone width. */
export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Main">
      {MOBILE_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
          <Icon aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
