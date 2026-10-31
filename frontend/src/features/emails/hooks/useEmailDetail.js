import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { fetchEmail } from "../api/emailsApi";

/** Loads one email with its body; `id` of "" loads nothing. */
export function useEmailDetail(id) {
  const resource = useAsyncResource(id ? `email:${id}` : null, (signal) => fetchEmail(id, signal));

  return { ...resource, email: resource.data?.id === id ? resource.data : null };
}
