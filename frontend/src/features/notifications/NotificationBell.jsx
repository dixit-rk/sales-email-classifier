import { Bell } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDismissOnOutside } from "../../shared/hooks/useDismissOnOutside";
import { formatListDate } from "../../shared/lib/formatDate";
import { Button, IconButton } from "../../shared/ui";
import { useRealtime } from "./realtimeContext";
import "./notifications.css";

const MAX_BADGE = 9;

/** Top-bar bell: unread badge and a dropdown of emails that arrived while the app was open. */
export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, clear } = useRealtime();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useDismissOnOutside(rootRef, open, () => setOpen(false));

  return (
    <div className="bell" ref={rootRef}>
      <IconButton icon={Bell} label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={open} onClick={() => setOpen(!open)} />
      {unreadCount > 0 && <span className="bell-badge" aria-hidden="true">{unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : unreadCount}</span>}
      {open && (
        <div className="bell-panel" role="region" aria-label="Notifications">
          <div className="bell-head">
            <strong>Notifications</strong>
            <div>
              <Button onClick={markAllRead} disabled={!unreadCount}>Mark all read</Button>
              <Button onClick={clear} disabled={!notifications.length}>Clear</Button>
            </div>
          </div>
          {notifications.length === 0 ? (
            <p className="bell-empty">New pricing inquiries appear here as they arrive.</p>
          ) : (
            <ul>
              {notifications.map((item) => (
                <li key={item.id}>
                  <Link to={item.to} className={`bell-item ${item.read ? "" : "unread"}`} onClick={() => { markRead(item.id); setOpen(false); }}>
                    <strong>{item.title}</strong>
                    <span>{item.message}</span>
                    <small>{formatListDate(item.receivedAt)}</small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
