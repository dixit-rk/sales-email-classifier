import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { useRealtime } from "../../notifications";
import { fetchEmails } from "../api/emailsApi";

const RECENT_COUNT = 5;

/** The newest inquiries in the inbox; refetched when a new email is pushed. */
export function useRecentEmails() {
  const { version } = useRealtime();
  const resource = useAsyncResource(`recent:${version}`, (signal) =>
    fetchEmails({ view: "inbox", limit: RECENT_COUNT, sort: "receivedAt", order: "desc" }, signal).then((body) => body.data),
  );

  return resource;
}
