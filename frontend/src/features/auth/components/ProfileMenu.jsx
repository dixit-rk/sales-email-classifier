import { ChevronsUpDown, LogOut, UserPen } from "lucide-react";
import { useRef, useState } from "react";
import { useDismissOnOutside } from "../../../shared/hooks/useDismissOnOutside";
import { useAuth } from "../authContext";
import { EditProfileDialog } from "./EditProfileDialog";
import "./profile.css";

/**
 * Account menu (edit profile, sign out). `variant` is "topbar" (avatar button) or "sidebar"
 * (the whole user block, or just the avatar when the sidebar is collapsed).
 */
export function ProfileMenu({ variant = "topbar" }) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const rootRef = useRef(null);
  const initial = user.name.charAt(0).toUpperCase();
  const inSidebar = variant === "sidebar";

  useDismissOnOutside(rootRef, open, () => setOpen(false));

  const trigger = {
    type: "button",
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-label": `Account menu, ${user.name}`,
    title: "Account menu",
    onClick: () => setOpen(!open),
  };

  return (
    <div className={`profile ${inSidebar ? "profile-sidebar" : ""}`} ref={rootRef}>
      {inSidebar ? (
        <button {...trigger} className="user user-trigger">
          <span className="avatar">{initial}</span>
          <span className="user-text"><b>{user.name}</b><small>{user.email}</small></span>
          <ChevronsUpDown size={15} className="user-chevron" aria-hidden="true" />
        </button>
      ) : (
        <button {...trigger} className="avatar profile-button">{initial}</button>
      )}
      {open && (
        <div className={`profile-panel ${inSidebar ? "from-sidebar" : ""}`} role="menu">
          <div className="profile-head">
            <span className="avatar">{initial}</span>
            <div><b>{user.name}</b><small>{user.email}</small></div>
          </div>
          <button type="button" role="menuitem" className="profile-item" onClick={() => { setOpen(false); setEditing(true); }}>
            <UserPen size={16} aria-hidden="true" /> Edit profile
          </button>
          <button type="button" role="menuitem" className="profile-item" onClick={signOut}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
      <EditProfileDialog key={user.name} open={editing} onClose={() => setEditing(false)} />
    </div>
  );
}
