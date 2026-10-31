import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { useRealtime } from "../../notifications";
import { fetchAnalytics } from "../api/statsApi";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/** Analytics for a resolved `{ from, to }` range; keeps the previous numbers on screen while the next range loads. */
export function useAnalytics({ from, to }) {
  const { version } = useRealtime();

  return useAsyncResource(`analytics:${from}:${to}:${timeZone}:${version}`, (signal) =>
    fetchAnalytics({ from, to }, timeZone, signal),
  );
}
