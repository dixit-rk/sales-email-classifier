import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { useRealtime } from "../../notifications";
import { fetchEmails } from "../api/emailsApi";

/** One server-filtered page of emails; refetches when the params change or a new email is pushed. */
export function useEmailList(view, params) {
  const { version } = useRealtime();
  const { search, read, sort, order, page, limit } = params;
  const key = [view, search, read, sort, order, page, limit, version].join("|");

  return useAsyncResource(key, (signal) => fetchEmails({ view, search, read, sort, order, page, limit }, signal));
}
