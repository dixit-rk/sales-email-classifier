import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { useRealtime } from "../../notifications";
import { fetchStats } from "../api/statsApi";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/** Dashboard stats for the viewer's time zone; refetched when a new email is pushed. */
export function useStats() {
  const { version } = useRealtime();

  return useAsyncResource(`stats:${timeZone}:${version}`, (signal) => fetchStats(timeZone, signal));
}
