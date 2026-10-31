import { createContext, useContext } from "react";

export const CountsContext = createContext(null);

/** `{ counts: { inbox, unreadInbox, review } | null, refresh }`. */
export const useEmailCounts = () => useContext(CountsContext);
