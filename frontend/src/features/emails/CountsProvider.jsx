import { useMemo } from "react";
import { useAsyncResource } from "../../shared/hooks/useAsyncResource";
import { useRealtime } from "../notifications";
import { fetchCounts } from "./api/emailsApi";
import { CountsContext } from "./countsContext";

/** Loads the sidebar counters and refreshes them whenever a new email is pushed. */
export function EmailCountsProvider({ children }) {
  const { version } = useRealtime();
  const { data, reload } = useAsyncResource(`counts:${version}`, fetchCounts);
  const value = useMemo(() => ({ counts: data, refresh: reload }), [data, reload]);

  return <CountsContext.Provider value={value}>{children}</CountsContext.Provider>;
}
