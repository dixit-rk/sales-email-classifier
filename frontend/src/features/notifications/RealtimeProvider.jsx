import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../../shared/config";
import { useToast } from "../../shared/toast/toastContext";
import { useAuth } from "../auth";
import { RealtimeContext } from "./realtimeContext";
import { toNotification } from "./toNotification";

const EMAIL_CLASSIFIED_EVENT = "email:classified";
const MAX_NOTIFICATIONS = 30;

/** Opens the live connection for the signed-in user and turns pushed emails into notifications and toasts. */
export function RealtimeProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [version, setVersion] = useState(0);
  const hasConnected = useRef(false);

  useEffect(() => {
    if (!user) return undefined;

    const socket = io(API_URL, { withCredentials: true });

    socket.on("connect", () => {
      // After a reconnect, emails may have arrived unseen: refetch.
      if (hasConnected.current) setVersion((current) => current + 1);
      hasConnected.current = true;
    });

    socket.on(EMAIL_CLASSIFIED_EVENT, (email) => {
      const notification = toNotification(email);

      setNotifications((current) =>
        [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, MAX_NOTIFICATIONS),
      );
      setVersion((current) => current + 1);
      toast.show({ title: notification.title, message: notification.message, to: notification.to });
    });

    return () => {
      socket.disconnect();
      hasConnected.current = false;
    };
  }, [user, toast]);

  const value = useMemo(
    () => ({
      version,
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markRead: (id) => setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item))),
      markAllRead: () => setNotifications((current) => current.map((item) => ({ ...item, read: true }))),
      clear: () => setNotifications([]),
    }),
    [version, notifications],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
