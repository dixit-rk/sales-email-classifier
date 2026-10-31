import { createContext, useContext } from "react";

export const RealtimeContext = createContext(null);

/** `{ version, notifications, unreadCount, markRead, markAllRead, clear }`; `version` changes on every pushed email. */
export const useRealtime = () => useContext(RealtimeContext);
